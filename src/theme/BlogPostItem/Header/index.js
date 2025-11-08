import React from 'react';
import OriginalHeader from '@theme-original/BlogPostItem/Header';
import AuthorCard from '@site/src/components/AuthorCard';

const AUTHOR_MAP = {
  'marcelo-m7': { name: 'Marcelo Santos', title: 'Founder & Maintainer', image: '/img/marcelo-m7-avatar.svg', linkedin: 'https://www.linkedin.com/in/marcelo-m7/', github: 'https://github.com/marcelo-m7' },
  'slorber': { name: 'Sébastien Lorber', title: 'Docusaurus maintainer', image: '/img/yangshun.png', linkedin: 'https://sebastienlorber.com', github: 'https://github.com/slorber' },
  'yangshun': { name: 'Yangshun Tay', title: 'Co-founder GreatFrontEnd', image: '/img/yangshun.png', linkedin: 'https://linkedin.com/in/yangshun', github: 'https://github.com/yangshun' },
  'tercio-barreto': { name: 'Tércio Barreto', title: 'Contributor — Data & Operations', image: '/img/tercio-barreto-avatar.svg', linkedin: 'https://www.linkedin.com/in/t%C3%A9rcio-barreto-40a840120/', github: '' }
};

export default function Header(props) {
  const fm = props.content && props.content.frontMatter ? props.content.frontMatter : {};
  const authorKey = Array.isArray(fm.authors) ? fm.authors[0] : fm.authors;
  const author = AUTHOR_MAP[authorKey];
  return (
    <>
      <OriginalHeader {...props} />
      {author && (
        <div style={{ marginTop: '1rem' }}>
          <AuthorCard name={author.name} title={author.title} image={author.image} linkedin={author.linkedin} github={author.github} />
        </div>
      )}
    </>
  );
}
