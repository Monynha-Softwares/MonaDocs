import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const projects = [
  {
    title: 'Boteco Pro',
    description: 'Sistema completo de gestão para bares e restaurantes com controle de pedidos, estoque e financeiro.',
    technologies: ['Flutter', 'TypeScript', 'Convex'],
    status: 'Em Desenvolvimento',
    link: '/docs/projetos/boteco-pro',
    icon: '🍺',
    color: '#FF6B35'
  },
  {
    title: 'Plataforma Educacional',
    description: 'Sistema de ensino online com cursos interativos, acompanhamento de progresso e certificação.',
    technologies: ['React', 'TypeScript', 'Docker'],
    status: 'Planejado',
    link: '/docs/intro',
    icon: '🎓',
    color: '#4F46E5'
  },
  {
    title: 'Sistema de Gestão Empresarial',
    description: 'Suite completa para gestão empresarial com módulos de RH, financeiro e operações.',
    technologies: ['TypeScript', 'Coolify', 'Docker'],
    status: 'Em Planejamento',
    link: '/docs/intro',
    icon: '🏢',
    color: '#10B981'
  }
];

const testimonials = [
  {
    name: 'Cliente Satisfeito',
    role: 'Proprietário de Bar',
    content: 'O Boteco Pro revolucionou a gestão do meu estabelecimento. Interface intuitiva e funcionalidades completas.',
    avatar: '👤'
  },
  {
    name: 'Parceiro Tecnológico',
    role: 'Desenvolvedor',
    content: 'Excelente trabalho em equipe e qualidade de código. Tecnologias modernas e boas práticas implementadas.',
    avatar: '👨‍💻'
  }
];

function ProjectCard({ project }) {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectHeader}>
        <div className={styles.projectIcon} style={{ backgroundColor: project.color }}>
          {project.icon}
        </div>
        <div className={styles.projectStatus}>
          {project.status}
        </div>
      </div>

      <h3 className={styles.projectTitle}>{project.title}</h3>
      <p className={styles.projectDescription}>{project.description}</p>

      <div className={styles.projectTech}>
        {project.technologies.map((tech) => (
          <span key={tech} className={styles.techTag}>
            {tech}
          </span>
        ))}
      </div>

      <Link to={project.link} className={styles.projectLink}>
        Ver Detalhes →
      </Link>
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.testimonialQuote}>
        "{testimonial.content}"
      </div>
      <div className={styles.testimonialAuthor}>
        <div className={styles.authorAvatar}>
          {testimonial.avatar}
        </div>
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>{testimonial.name}</div>
          <div className={styles.authorRole}>{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section className={styles.portfolio}>
      <div className="container">
        {/* Projects Section */}
        <div className="text--center margin-bottom--xl">
          <h2 className={styles.sectionTitle}>
            Nossos <span className="gradient-text">Projetos</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Soluções inovadoras desenvolvidas com as melhores tecnologias
          </p>
        </div>

        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="text--center margin-top--xl margin-bottom--lg">
          <h2 className={styles.sectionTitle}>
            O que dizem sobre nós
          </h2>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <h3>Pronto para inovar com a gente?</h3>
          <p>Entre em contato e vamos discutir seu próximo projeto</p>
          <div className={styles.ctaButtons}>
            <Link to="https://monynha.com" className="button button--primary button--lg">
              Falar com a Equipe
            </Link>
            <Link to="/docs/intro" className="button button--outline button--lg">
              Ver Documentação
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}