import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const techStack = [
  {
    name: 'TypeScript',
    slug: 'typescript',
    icon: '🔷',
    description: 'A typed superset of JavaScript for safer, scalable code',
    color: '#3178c6'
  },
  {
    name: 'Flutter',
    slug: 'flutter',
    icon: '📱',
    description: "Google's UI toolkit for building natively compiled apps",
    color: '#02569B'
  },
  {
    name: 'Convex',
    slug: 'convex',
    icon: '⚡',
    description: 'Realtime backend-as-a-service for modern apps',
    color: '#FF6B35'
  },
  {
    name: 'Coolify',
    slug: 'coolify',
    icon: '🚀',
    description: 'Self-hosted deployment and app management platform',
    color: '#4F46E5'
  },
  {
    name: 'Docker',
    slug: 'docker-compose',
    icon: '🐳',
    description: 'Containerization for consistent environments',
    color: '#2496ED'
  },
  {
    name: 'React',
    slug: 'frontend-stack',
    icon: '⚛️',
    description: 'Library for building interactive web interfaces',
    color: '#61DAFB'
  }
];

function TechCard({ tech, isActive, onClick }) {
  return (
    <div
      className={clsx(styles.techCard, { [styles.active]: isActive })}
      onClick={onClick}
      style={{ '--tech-color': tech.color }}
    >
      <div className={styles.techIcon}>
        {tech.icon}
      </div>
      <h3 className={styles.techName}>{tech.name}</h3>
      {isActive && (
        <p className={styles.techDescription}>{tech.description}</p>
      )}
    </div>
  );
}

export default function TechStack() {
  const [activeTech, setActiveTech] = useState(0);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  async function fetchPreview(slug) {
    if (!slug) return null;
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const res = await fetch(`/docs/technologies/${slug}/`);
      if (!res.ok) throw new Error(`Preview fetch failed: ${res.status}`);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const selectors = ['.theme-doc-markdown', '.markdown', 'article', 'main'];
      for (const sel of selectors) {
        const el = doc.querySelector(sel);
        if (el) {
          const p = el.querySelector('p');
          if (p) {
            return p.innerHTML;
          }
        }
      }
      // fallback: first paragraph in body
      const p = doc.querySelector('p');
      return p ? p.innerHTML : null;
    } catch (err) {
      setPreviewError(err.message);
      return null;
    } finally {
      setPreviewLoading(false);
    }
  }

  React.useEffect(() => {
    let mounted = true;
    setPreviewHtml(null);
    setPreviewError(null);
    const slug = techStack[activeTech]?.slug;
    if (!slug) return undefined;
    fetchPreview(slug).then((html) => {
      if (mounted) setPreviewHtml(html);
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTech]);

  return (
    <section className={styles.techStack}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2 className={styles.sectionTitle}>
            Technologies &amp; <span className="gradient-text">Stack</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Modern technologies that power our solutions
          </p>
        </div>

        <div className={styles.techGrid}>
          {techStack.map((tech, index) => (
            <TechCard
              key={tech.name}
              tech={tech}
              isActive={activeTech === index}
              onClick={() => setActiveTech(index)}
            />
          ))}
        </div>

        <div className={styles.activeTechDisplay}>
          <div className={styles.activeTechCard}>
            <div className={styles.activeTechIcon}>
              {techStack[activeTech].icon}
            </div>
            <div className={styles.activeTechInfo}>
              <h3>{techStack[activeTech].name}</h3>
              <p>{techStack[activeTech].description}</p>
              <div className={styles.previewArea}>
                {previewLoading && <div className={styles.previewLoading}>Loading preview…</div>}
                {previewError && <div className={styles.previewError}>Preview unavailable.</div>}
                {previewHtml ? (
                  <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : null}
              </div>
              <div className={styles.readMoreRow}>
                <a className={styles.readMoreBtn} href={`/docs/technologies/${techStack[activeTech].slug}`}>Read full page →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}