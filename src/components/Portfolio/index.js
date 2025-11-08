import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const projects = [
  {
    title: 'Boteco Pro',
    description: 'A complete management system for bars and restaurants: orders, inventory, and billing.',
    technologies: ['Flutter', 'TypeScript', 'Convex'],
    status: 'In Development',
    link: '/docs/projects/boteco-pro',
    icon: '🍺',
    color: '#FF6B35'
  },
  {
    title: 'Educational Platform',
    description: 'Online learning platform with interactive courses, progress tracking, and certification.',
    technologies: ['React', 'TypeScript', 'Docker'],
    status: 'Planned',
    link: '/docs/intro',
    icon: '🎓',
    color: '#4F46E5'
  },
  {
    title: 'Enterprise Management Suite',
    description: 'A complete suite for enterprise management with HR, finance, and operations modules.',
    technologies: ['TypeScript', 'Coolify', 'Docker'],
    status: 'Planned',
    link: '/docs/intro',
    icon: '🏢',
    color: '#10B981'
  }
];

const TECH_SLUGS = {
  'TypeScript': 'typescript',
  'Docker': 'docker-compose',
  'React': 'frontend-stack',
  'Flutter': 'flutter',
  'Convex': 'convex',
  'Coolify': 'coolify'
};

const testimonials = [
  {
    name: 'Happy Customer',
    role: 'Bar Owner',
    content: 'Boteco Pro transformed how I run my business. Intuitive UI and complete feature set.',
    avatar: '👤'
  },
  {
    name: 'Technology Partner',
    role: 'Developer',
    content: 'Great team and strong code quality. Modern technologies and solid practices in place.',
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
        {project.technologies.map((tech) => {
          const mapped = TECH_SLUGS[tech];
          if (mapped) {
            return (
              <Link key={tech} to={`/docs/technologies/${mapped}`} className={styles.techTag}>
                {tech}
              </Link>
            );
          }
          // fallback: render as plain tag if there's no matching docs page
          return (
            <span key={tech} className={styles.techTag}>{tech}</span>
          );
        })}
      </div>

      <Link to={project.link} className={styles.projectLink}>
        View details →
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
            Our <span className="gradient-text">Projects</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Innovative solutions built with modern technologies
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
            What people say about us
          </h2>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <h3>Ready to innovate with us?</h3>
          <p>Get in touch and let's discuss your next project.</p>
          <div className={styles.ctaButtons}>
            <Link to="https://monynha.com/contact" className="button button--primary button--lg">
              Talk to the Team
            </Link>
            <Link to="/docs/intro" className="button button--outline button--lg">
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}