import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: `${post.title} | Veeluxe`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Veeluxe`,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Veeluxe`,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff5722]">Blog</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">{post.date}</p>
        <div className="relative mt-8 h-72 overflow-hidden rounded-[24px]">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>
        <div className="prose prose-stone mt-8 max-w-none text-lg leading-8 text-[#555]">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-semibold text-[#333]">Related posts</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <a key={related.slug} href={`/blog/${related.slug}`} className="block rounded-[20px] border border-[#f2e7e2] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              <p className="text-sm text-muted">{related.date}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#333]">{related.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#666]">{related.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
