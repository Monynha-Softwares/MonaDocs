import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Projetos Inovadores',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Explore nossa documentação completa de projetos, desde sistemas de gestão
        para bares e restaurantes até plataformas educacionais e soluções web modernas.
      </>
    ),
  },
  {
    title: 'Tecnologias Avançadas',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Conheça as tecnologias que utilizamos: TypeScript, Flutter, Convex, Coolify,
        Docker e muito mais. Guias práticos e melhores práticas incluídas.
      </>
    ),
  },
  {
    title: 'Padrões e Qualidade',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Acesse nossos padrões internos de desenvolvimento, guias de contribuição
        e práticas recomendadas para manter a qualidade em todos os projetos.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
