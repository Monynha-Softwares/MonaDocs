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
          Bem-vindo à <span className="gradient-text">MonaDocs</span>
        </Heading>
        <p className="hero__subtitle">
          Documentação central da <strong>Monynha Softwares</strong> - Inovando com tecnologia
        </p>
        <div className={styles.heroDescription}>
          <p>
            Explore nossa documentação completa sobre projetos inovadores,
            tecnologias avançadas e padrões de desenvolvimento que impulsionam
            soluções digitais de ponta.
          </p>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            🚀 Explorar Documentação
          </Link>
          <Link
            className="button button--outline button--lg"
            to="https://monynha.com">
            🌐 Visitar Website
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
      title={`MonaDocs - Documentação Monynha Softwares`}
      description="Documentação central contendo guias, padrões e informações sobre projetos, tecnologias e processos da Monynha Softwares">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TechStack />
        <Portfolio />
      </main>
    </Layout>
  );
}
