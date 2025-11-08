import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const techStack = [
  {
    name: 'TypeScript',
    icon: '🔷',
    description: 'Linguagem tipada para desenvolvimento robusto',
    color: '#3178c6'
  },
  {
    name: 'Flutter',
    icon: '📱',
    description: 'Framework para desenvolvimento mobile multiplataforma',
    color: '#02569B'
  },
  {
    name: 'Convex',
    icon: '⚡',
    description: 'Backend-as-a-Service para aplicações realtime',
    color: '#FF6B35'
  },
  {
    name: 'Coolify',
    icon: '🚀',
    description: 'Plataforma de deploy e gerenciamento de aplicações',
    color: '#4F46E5'
  },
  {
    name: 'Docker',
    icon: '🐳',
    description: 'Containerização para ambientes consistentes',
    color: '#2496ED'
  },
  {
    name: 'React',
    icon: '⚛️',
    description: 'Biblioteca para interfaces web interativas',
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

  return (
    <section className={styles.techStack}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2 className={styles.sectionTitle}>
            Nossa <span className="gradient-text">Stack Tecnológica</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Tecnologias modernas que impulsionam nossas soluções
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}