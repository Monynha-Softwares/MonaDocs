import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const projects = [
  {
    title: 'Boteco Pro',
    description: 'A complete management system for bars and restaurants: orders, inventory, and billing.',
    technologies: ['Flutter', 'TypeScript', 'Convex'],
    status: 'In Development',
    link: '/docs/projects/boteco-pro',
    featured: true,
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

const contributors = [
  {
    name: 'Tércio Barreto',
    role: 'Contributor',
    linkedin: 'https://www.linkedin.com/in/t%C3%A9rcio-barreto-40a840120/',
    avatar: '👤',
    bio: 'Full-stack developer and contributor to MonaDocs.'
  },
  {
    name: 'Marcelo (marcelo-m7)',
    role: 'Founder & Maintainer',
    linkedin: 'https://www.linkedin.com/in/marcelo-m7/',
    avatar: '👨‍💻',
    bio: 'Lead developer and project maintainer.'
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

function ContributorCard({ person }) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.testimonialQuote}>
        {person.bio}
      </div>
      <div className={styles.testimonialAuthor}>
        <div className={styles.authorAvatar}>
          {person.avatar}
        </div>
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>{person.name}</div>
          <div className={styles.authorRole}>{person.role}</div>
        </div>
        <div>
          <a className={styles.linkedinLink} href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  // Featured + filters + pagination
  const PAGE_SIZE = 6;
  // compute available techs
  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies)));
  // find featured project (first that has featured: true) or fallback to first
  const featured = projects.find((p) => p.featured) || projects[0];

  const [selectedTech, setSelectedTech] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTitle, setActiveTitle] = React.useState(featured.title);

  const filtered = projects.filter((p) => p.title !== featured.title && (!selectedTech || p.technologies.includes(selectedTech)));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, (currentPage - 1) * PAGE_SIZE + PAGE_SIZE);

  function selectTech(t) {
    const next = (selectedTech === t ? null : t);
    setSelectedTech(next);
    try { if (typeof window !== 'undefined') localStorage.setItem('portfolio_selected_tech', next || ''); } catch (e) {}
    setCurrentPage(1);
  }

  // Read persisted tech filter on client mount
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const v = localStorage.getItem('portfolio_selected_tech');
        if (v) setSelectedTech(v);
      }
    } catch (e) {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep activeTitle consistent with filters/pages: if active project not in current paged list, reset to first
  React.useEffect(() => {
    const existsInPaged = paged.some((p) => p.title === activeTitle);
    if (!existsInPaged) {
      const first = paged[0] || featured || projects[0];
      if (first) setActiveTitle(first.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedTech]);

  return (
    <section className={styles.portfolio}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2 className={styles.sectionTitle}>
            Our <span className="gradient-text">Projects</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Innovative solutions built with modern technologies
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <button className={`${styles.filterBtn} ${!selectedTech ? styles.activeFilter : ''}`} onClick={() => selectTech(null)}>All</button>
            {allTechs.map((t) => (
              <button key={t} className={`${styles.filterBtn} ${selectedTech === t ? styles.activeFilter : ''}`} onClick={() => selectTech(t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* Two-column project selector similar to TechStack: left = list, right = preview */}
        <div className={styles.twoColumnRow}>
          <div className={styles.featuredColumn}>
            <div className={styles.leftList}>
              {paged.map((project) => (
                <div key={project.title} className={styles.projectThumb}>
                  <button
                    type="button"
                    className={styles.projectThumbInner}
                    onClick={() => {
                      try { setActiveTitle(project.title); } catch (e) {}
                    }}
                    aria-pressed={activeTitle === project.title}
                  >
                    <div className={styles.thumbHeader}>
                      <div className={styles.projectIconSmall} style={{ backgroundColor: project.color }}>{project.icon}</div>
                      <div className={styles.thumbMeta}>
                        <h4 className={styles.thumbTitle}>{project.title}</h4>
                        <div className={styles.thumbStatus}>{project.status}</div>
                      </div>
                    </div>
                    <p className={styles.thumbDescription}>{project.description}</p>
                  </button>
                  <div className={styles.thumbActions}>
                    <Link to={project.link} className="button button--link">View details →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              <button className="button button--outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
              <div className={styles.pageInfo}>Page {currentPage} of {totalPages}</div>
              <button className="button button--primary" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
          <div className={styles.gridColumn}>
            {/* preview area for active project */}
            <div className={styles.previewCard}>
              {
                (() => {
                  const active = projects.find((p) => p.title === activeTitle) || featured || projects[0];
                  return (
                    <div>
                      <div className={styles.projectHeader}>
                        <div className={styles.projectIcon} style={{ backgroundColor: active.color }}>{active.icon}</div>
                        <div className={styles.projectStatus}>{active.status}</div>
                      </div>
                      <h3 className={styles.projectTitle}>{active.title}</h3>
                      <p className={styles.projectDescription}>{active.description}</p>
                      <div className={styles.projectTech}>
                        {active.technologies.map((tech) => {
                          const mapped = TECH_SLUGS[tech];
                          if (mapped) return (<Link key={tech} to={`/docs/technologies/${mapped}`} className={styles.techTag}>{tech}</Link>);
                          return (<span key={tech} className={styles.techTag}>{tech}</span>);
                        })}
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <Link to={active.link} className="button button--primary">View details →</Link>
                      </div>
                    </div>
                  );
                })()
              }
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text--center margin-top--xl margin-bottom--lg">
          <h2 className={styles.sectionTitle}>
            What people say about us
          </h2>
        </div>

        <div className={styles.testimonialsGrid}>
          {contributors.map((person) => (
            <ContributorCard key={person.name} person={person} />
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