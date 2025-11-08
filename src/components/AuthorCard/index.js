import React from 'react';
import styles from './styles.module.css';

export default function AuthorCard({ name, title, image = '/img/marcelo-m7-avatar.png', linkedin, github, children }) {
  return (
    <div className={styles.card}>
      <img className={styles.avatar} src={image} alt={name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/marcelo-m7-avatar.svg'; }} />
      <div className={styles.meta}>
        <div className={styles.name}>{name}</div>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.links}>
          {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {github && <a href={github} target="_blank" rel="noreferrer">GitHub</a>}
        </div>
        {children && <div className={styles.children}>{children}</div>}
      </div>
    </div>
  );
}
