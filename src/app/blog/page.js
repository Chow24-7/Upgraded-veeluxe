import Link from 'next/link';
import Image from 'next/image';
import PageSection from '../_components/PageSection';
import { getAllPosts } from '@/lib/posts';
import JsonLd from '@/components/JsonLd';
import { canonicalMetadata, createBreadcrumbData } from '@/lib/seo';

export const metadata = canonicalMetadata('/blog', {
  title: 'Skincare Journal | Veeluxe',
  description: 'Read thoughtful guidance on skincare, daily rituals, and healthy habits from Veeluxe.',
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <JsonLd data={createBreadcrumbData([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ])} />
      <PageSection className="text-center">
        <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Blog</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">Notes on skincare, rituals, and healthy habits.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#555]">
          A modern editorial space for thoughtful skincare advice and simple guidance.
        </p>
      </PageSection>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <PageSection key={post.slug} delay={index * 60} className="overflow-hidden rounded-[24px] border border-[#f2e7e2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="relative h-56">
              <Image src={post.image} alt={`${post.title} article cover`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-8">
              <p className="text-sm text-muted">{post.date}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#333]">{post.title}</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex rounded-full bg-[#ff5722] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Read more</Link>
            </div>
          </PageSection>
        ))}
      </div>
    </div>
  );
}
