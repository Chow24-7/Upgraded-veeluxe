import { getAllPosts } from '@/lib/posts';
import { products } from '@/data/products';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap() {
  const posts = getAllPosts();
  const blogUrls = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date || new Date()),
  }));
  const productUrls = products.map((product) => ({
    url: absoluteUrl(`/products/${product.id}`),
  }));

  return [
    { url: absoluteUrl('/'), lastModified: new Date() },
    { url: absoluteUrl('/about'), lastModified: new Date() },
    { url: absoluteUrl('/products'), lastModified: new Date() },
    { url: absoluteUrl('/privacy'), lastModified: new Date() },
    { url: absoluteUrl('/terms'), lastModified: new Date() },
    { url: absoluteUrl('/shipping-returns'), lastModified: new Date() },
    ...productUrls,
    { url: absoluteUrl('/blog'), lastModified: new Date() },
    ...blogUrls,
  ];
}
