import { getAllBlogPosts } from "@/lib/notion";
import { BlogCard } from "@/components/blog-card";
import { unstable_noStore as noStore } from "next/cache"; // 🔥 Disable caching

export default async function HomePage() {
  noStore(); // 🚀 Prevents Vercel from caching blog posts
  const allPosts = await getAllBlogPosts(process.env.NOTION_PAGE_ID);
  const featuredPost = allPosts[0];
  const regularPosts = allPosts.slice(1);

  return (
    <div className="container mx-auto px-4 py-12 font-balaram">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Space For Grace</h1>
        <p className="text-xl text-black max-w-2xl mx-auto">
          Some thoughts combining mundane reality with scientific spirituality
        </p>
      </header>

      <section className="mb-12">
        {featuredPost && <BlogCard post={featuredPost} featured={true} />}
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
