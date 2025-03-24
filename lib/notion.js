import { Client } from '@notionhq/client';
import slugify from 'slugify';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const BLOG_PARENT_PAGE_ID = process.env.NOTION_PAGE_ID;

let allPostsCache = null;
let contentCache = new Map(); // ✅ Caching page content to reduce redundant API calls

// **🏎️ Preload blog posts once**
(async () => {
  try {
    allPostsCache = await getAllBlogPosts();
  } catch (error) {
    console.error('Error preloading blog posts:', error);
  }
})();

// **📌 Fetch page content (Now with caching)**
async function getPageContent(pageId) {
  if (contentCache.has(pageId)) return contentCache.get(pageId); // ✅ Use cache

  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    const blocks = response.results;

    for (let block of blocks) {
      if (block.has_children) {
        block.children = await getPageContent(block.id);
      }
    }

    contentCache.set(pageId, blocks); // ✅ Store in cache
    return blocks;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return [];
  }
}

// **📅 Extract date from the second meaningful paragraph block**
function extractDateFromSubpage(blocks) {
  let count = 0;
  for (const block of blocks) {
    if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
      count++;
      if (count === 1) {
        return block.paragraph.rich_text[0].plain_text;
      }
    }
  }
  return new Date().toISOString();
}

// **🚀 Fetch all blog posts**
async function getAllBlogPosts() {
  if (allPostsCache) return allPostsCache; // ✅ Use cache

  if (!BLOG_PARENT_PAGE_ID) {
    throw new Error("❌ Missing NOTION_BLOG_PAGE_ID in environment variables.");
  }

  try {
    const content = await notion.blocks.children.list({ block_id: BLOG_PARENT_PAGE_ID });
    const childPages = content.results.filter(block => block.type === 'child_page');

    const posts = await Promise.all(
      childPages.map(async (block) => {
        const response = await notion.pages.retrieve({ page_id: block.id });
        const title = response.properties?.title?.title?.[0]?.plain_text || 'Untitled';
        const slug = slugify(title, { lower: true, strict: true });

        const subpageContent = await getPageContent(block.id); // ✅ Unchanged, but cached
        const postDate = extractDateFromSubpage(subpageContent);

        return {
          id: block.id,
          title,
          slug,
          coverImage: response.cover?.external?.url || response.cover?.file?.url || null,
          date: postDate,
        };
      })
    );

    allPostsCache = posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // ✅ Cache results
    return allPostsCache;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// **🚀 Fetch a single blog post by slug (Uses cache for content)**
async function getBlogPostBySlug(slug) {
  try {
    const posts = allPostsCache || await getAllBlogPosts();
    const post = posts.find(p => p.slug === slug);
    if (!post) return null;

    // ✅ Fetch content only if not already cached
    if (!contentCache.has(post.id)) {
      const content = await getPageContent(post.id);
      contentCache.set(post.id, content);
    }

    return { ...post, content: contentCache.get(post.id) };
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error);
    return null;
  }
}

// **🔗 Get related blog posts**
async function getRelatedBlogPosts(postId) {
  const allPosts = allPostsCache || await getAllBlogPosts();
  return allPosts
    .filter((post) => post.id !== postId)
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 2);
}

// ✅ Correct ES Module export
export { getAllBlogPosts, getBlogPostBySlug, getRelatedBlogPosts };
