import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

// Simple client-side GitHub repo fetcher with localStorage cache.
// - Fetches repos for a user and an organization, merges and dedupes them.
// - Uses unauthenticated GitHub API (rate limit: 60 req/hour per IP). Caches results to reduce requests.
// - Fully client-side so it works on static sites.

const CACHE_KEY = 'mona_repos_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

async function fetchAllRepos(url) {
  const perPage = 100;
  let page = 1;
  let results = [];
  while (true) {
    const resp = await fetch(`${url}${url.includes('?') ? '&' : '?'}per_page=${perPage}&page=${page}`);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`GitHub API error ${resp.status}: ${text}`);
    }
    const data = await resp.json();
    if (!Array.isArray(data)) break;
    results = results.concat(data);
    if (data.length < perPage) break;
    page += 1;
  }
  return results;
}

function mergeAndDedupe(a, b) {
  const map = new Map();
  (a || []).concat(b || []).forEach((r) => map.set(r.full_name, r));
  return Array.from(map.values()).sort((x, y) => new Date(y.updated_at) - new Date(x.updated_at));
}

export default function Repositories({user = 'marcelo-m7', org = 'Monynha-Softwares', showForks = false}) {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cacheInfo, setCacheInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load({forceRefresh = false} = {}) {
      setLoading(true);
      setError(null);

      try {
        // Check cache unless forced
        const cached = localStorage.getItem(CACHE_KEY);
        if (!forceRefresh && cached) {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.ts;
          setCacheInfo({ts: parsed.ts, age});
          if (age < CACHE_TTL_MS) {
            setRepos(parsed.data);
            setLoading(false);
            // still attempt background refresh but only if not forced
            refreshInBackground(parsed.ts);
            return;
          }
        }

        const [userRepos, orgRepos] = await Promise.all([
          fetchAllRepos(`https://api.github.com/users/${user}/repos?type=owner&sort=updated`),
          fetchAllRepos(`https://api.github.com/orgs/${org}/repos?type=public&sort=updated`),
        ]);

        const merged = mergeAndDedupe(userRepos, orgRepos).filter((r) => showForks || !r.fork);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data: merged}));
        if (!cancelled) {
          setRepos(merged);
          setCacheInfo({ts: Date.now(), age: 0});
        }
      } catch (err) {
        // If rate-limited or other errors, surface message but try to use stale cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!cancelled) setRepos(parsed.data);
          setError('Using cached data due to API error: ' + err.message);
        } else {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function refreshInBackground(oldTs) {
      try {
        const [userRepos, orgRepos] = await Promise.all([
          fetchAllRepos(`https://api.github.com/users/${user}/repos?type=owner&sort=updated`),
          fetchAllRepos(`https://api.github.com/orgs/${org}/repos?type=public&sort=updated`),
        ]);
  const merged = mergeAndDedupe(userRepos, orgRepos).filter((r) => showForks || !r.fork);
  localStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data: merged}));
  // update UI only if there was no data yet
  if (!repos) setRepos(merged);
  setCacheInfo({ts: Date.now(), age: 0});
      } catch (err) {
        // ignore background errors
        // console.warn('background refresh failed', err);
      }
    }

    // Force refresh handler
    async function refreshNow() {
      setError(null);
      await load({forceRefresh: true});
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, org, showForks]);

  if (loading && !repos) return <div className={styles.container}><p>Loading repositories...</p></div>;
  if (error && !repos) return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;

  function renderCacheInfo() {
    if (!cacheInfo) return null;
    const seconds = Math.floor((Date.now() - cacheInfo.ts) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    let when = '';
    if (hours > 0) when = `${hours}h ${minutes % 60}m ago`;
    else if (minutes > 0) when = `${minutes}m ago`;
    else when = `${seconds}s ago`;

    const ttlRemainingMs = Math.max(0, CACHE_TTL_MS - (Date.now() - cacheInfo.ts));
    const ttlMinutes = Math.ceil(ttlRemainingMs / 60000);
    return (
      <div className={styles.cacheBar}>
        <div className={styles.cacheInfo}>Cached: {when} • refresh in ~{ttlMinutes}m</div>
        <div>
          <button className={styles.refreshBtn} onClick={refreshNow} disabled={loading}>Refresh now</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderCacheInfo()}
      {error ? <div className={styles.warn}>⚠ {error}</div> : null}
      <div className={styles.grid}>
        {(repos || []).map((r) => (
          <a key={r.full_name} className={styles.card} href={r.html_url} target="_blank" rel="noreferrer">
            <div className={styles.cardHeader}>
              <h3>{r.name}</h3>
              <div className={styles.meta}>
                <span>★ {r.stargazers_count}</span>
                <span>● {r.language || '—'}</span>
              </div>
            </div>
            <p className={styles.description}>{r.description}</p>
            <div className={styles.footer}>
              <small>Updated {new Date(r.updated_at).toLocaleString()}</small>
            </div>
          </a>
        ))}
      </div>
      {repos && repos.length === 0 && <p>No repositories found.</p>}
    </div>
  );
}
