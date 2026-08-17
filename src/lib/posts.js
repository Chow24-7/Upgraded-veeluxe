import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(fileContents) {
  const match = fileContents.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return null;

  const frontmatter = match[1];
  const data = {};
  for (const line of frontmatter.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    data[key] = value.replace(/^['"]|['"]$/g, '');
  }

  return data;
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));

  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const frontmatter = parseFrontmatter(fileContents);

    return {
      slug: frontmatter?.slug || fileName.replace(/\.md$/, ''),
      title: frontmatter?.title || 'Untitled post',
      date: frontmatter?.date || '',
      excerpt: frontmatter?.excerpt || '',
      image: frontmatter?.image || '/images/background image.jpg',
      content: fileContents.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ''),
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

export function getRelatedPosts(currentSlug) {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.slug !== currentSlug).slice(0, 3);
}
