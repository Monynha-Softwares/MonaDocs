const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function readSource(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFileSync(filePath, 'utf8');
}

test('homepage imports TechStack and Portfolio components', () => {
  const homepageSource = readSource('src/pages/index.js');

  assert.match(
    homepageSource,
    /import\s+TechStack\s+from\s+'@site\/src\/components\/TechStack';/,
    'Homepage should import the TechStack component'
  );

  assert.match(
    homepageSource,
    /import\s+Portfolio\s+from\s+'@site\/src\/components\/Portfolio';/,
    'Homepage should import the Portfolio component'
  );
});

test('tech stack component defines technology cards', () => {
  const techStackSource = readSource('src/components/TechStack/index.js');

  assert.match(
    techStackSource,
    /const\s+techStack\s*=\s*\[/,
    'TechStack component should define the techStack array'
  );
});

