const { Client } = require('@notionhq/client');
const slugify = require('slugify');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const BLOG_PARENT_PAGE_ID = process.env.NOTION_PAGE_ID;

let allPostsCache = null; // Preload blog posts at startup

// **🏎️ Preload all blog posts at startup**
(async () => {
  allPostsCache = await getAllBlogPosts();
})();

// **🚀 Fetch all blog posts from parent page**
async function getAllBlogPosts() {
  if (!BLOG_PARENT_PAGE_ID) {
    throw new Error("❌ Missing NOTION_BLOG_PAGE_ID in environment variables.");
  }

  // Fetch subpages under parent page
  const content = await notion.blocks.children.list({ block_id: BLOG_PARENT_PAGE_ID });
  const childPages = content.results.filter(block => block.type === 'child_page');

  // Fetch metadata **in parallel** for all child pages
  const posts = await Promise.all(
    childPages.map(async (block) => {
      const response = await notion.pages.retrieve({ page_id: block.id });
      const title = response.properties?.title?.title?.[0]?.plain_text || 'Untitled';
      const slug = slugify(title, { lower: true, strict: true });

      return {
        id: block.id,
        title,
        slug,
        coverImage: response.cover?.external?.url || response.cover?.file?.url || null,
        date: response.properties?.date?.date?.start || new Date().toISOString(),
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// **🚀 Fetch a single blog post by slug**
async function getBlogPostBySlug(slug) {
  const posts = allPostsCache || await getAllBlogPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) return null;

  // Fetch content **only if needed**
  const content = await notion.blocks.children.list({ block_id: post.id });

  return { ...post, content: content.results };
}

module.exports = { getAllBlogPosts, getBlogPostBySlug };
