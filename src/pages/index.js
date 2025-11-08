import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import TechStack from '@site/src/components/TechStack';
import Portfolio from '@site/src/components/Portfolio';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
            Welcome to <span className="gradient-text">MonaDocs</span>
          </Heading>
          <p className="hero__subtitle">
            Central documentation for <strong>Monynha Softwares</strong> — innovating with technology
          </p>
          <div className={styles.heroDescription}>
            <p>
              Explore our complete documentation on innovative projects, modern
              technologies, and engineering standards that power robust digital
              solutions.
            </p>
          </div>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              🚀 Explore Documentation
            </Link>
            {/* make Visit Website use same personalized CTA style */}
            <Link
              className="button button--secondary button--lg"
              to="https://monynha.com"
              target="_blank"
              rel="noopener noreferrer">
              🌐 Visit Website
            </Link>
          </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`MonaDocs - Monynha Softwares Documentation`}
      description="Central documentation containing guides, standards, and information about Monynha Softwares projects, technologies, and processes">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TechStack />
        <Portfolio />
      </main>
    </Layout>
  );
}
