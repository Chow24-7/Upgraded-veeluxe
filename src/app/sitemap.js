import { getAllPosts } from '@/lib/posts';

export default function sitemap() {
  const posts = getAllPosts();
  const blogUrls = posts.map((post) => ({
    url: `https://veeluxe.example.com/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
  }));

  return [
    { url: 'https://veeluxe.example.com', lastModified: new Date() },
    { url: 'https://veeluxe.example.com/about', lastModified: new Date() },
    { url: 'https://veeluxe.example.com/products', lastModified: new Date() },
    { url: 'https://veeluxe.example.com/cart', lastModified: new Date() },
    { url: 'https://veeluxe.example.com/wishlist', lastModified: new Date() },
    { url: 'https://veeluxe.example.com/blog', lastModified: new Date() },
    ...blogUrls,
  ];
}
