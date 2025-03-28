import { Client } from "@notionhq/client";
import slugify from "slugify";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const BLOG_PARENT_PAGE_ID = process.env.NOTION_PAGE_ID;

// Cache structure for preloading
const cache = {
  allPosts: null,
  lastUpdated: 0,
  pageContent: {}, // Caches page content for individual posts
};

// ✅ Fetch page content with caching
async function getPageContent(pageId) {
  if (cache.pageContent[pageId]) return cache.pageContent[pageId]; // Serve cached content

  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    const blocks = response.results;

    await Promise.all(
      blocks
        .filter((block) => block.has_children)
        .map(async (block) => {
          block.children = await getPageContent(block.id);
        })
    );

    cache.pageContent[pageId] = blocks; // Store in cache
    return blocks;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
}

// ✅ Extract date from first paragraph block
function extractDateFromSubpage(blocks) {
  for (const block of blocks) {
    if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
      return block.paragraph.rich_text[0].plain_text;
    }
  }
  return new Date().toISOString();
}

// ✅ Check if cache is outdated (new posts added)
async function isCacheOutdated() {
  if (!cache.allPosts) return true; // No cache? Fetch fresh data

  try {
    const response = await notion.blocks.children.list({ block_id: BLOG_PARENT_PAGE_ID });
    const latestPostCount = response.results.filter((block) => block.type === "child_page").length;

    return latestPostCount !== cache.allPosts.length; // If count changes, refresh
  } catch (error) {
    console.error("Error checking for new posts:", error);
    return true; // Default to refreshing if an error occurs
  }
}

// ✅ Preload all blog posts (including images)
async function preloadBlogPosts() {
  if (!BLOG_PARENT_PAGE_ID) {
    throw new Error("❌ Missing NOTION_BLOG_PAGE_ID in environment variables.");
  }

  // Use cache if it's valid and was updated recently (5 min)
  if (!(await isCacheOutdated()) && Date.now() - cache.lastUpdated < 5 * 60 * 1000) {
    return cache.allPosts;
  }

  try {
    const response = await notion.blocks.children.list({ block_id: BLOG_PARENT_PAGE_ID });
    const childPages = response.results.filter((block) => block.type === "child_page");

    const posts = await Promise.all(
      childPages.map(async (block) => {
        const response = await notion.pages.retrieve({ page_id: block.id });
        const title = response.properties?.title?.title?.[0]?.plain_text || "Untitled";
        const slug = slugify(title, { lower: true, strict: true });

        const subpageContent = await getPageContent(block.id);
        const postDate = extractDateFromSubpage(subpageContent);

        // Extract cover image (Notion supports external & file-based covers)
        const coverImage =
          response.cover?.external?.url || response.cover?.file?.url || null;

        return {
          id: block.id,
          title,
          slug,
          coverImage,
          date: postDate,
        };
      })
    );

    // ✅ Sort posts by date (latest first)
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // ✅ Store in cache and update timestamp
    cache.allPosts = sortedPosts;
    cache.lastUpdated = Date.now();

    return sortedPosts;
  } catch (error) {
    console.error("Error preloading blog posts:", error);
    return [];
  }
}

// ✅ Fetch all blog posts (fast access from preloaded data)
async function getAllBlogPosts() {
  return cache.allPosts || (await preloadBlogPosts());
}

// ✅ Fetch a single blog post (only load content when needed)
async function getBlogPostBySlug(slug) {
  const posts = await getAllBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  post.content = await getPageContent(post.id);
  post.date = extractDateFromSubpage(post.content); // Get accurate date
  return post;
}

// ✅ Get related blog posts (efficiently)
async function getRelatedBlogPosts(postId) {
  const allPosts = await getAllBlogPosts();
  return allPosts
    .filter((post) => post.id !== postId)
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 2);
}

// ✅ Periodically refresh the cache in the background
setInterval(preloadBlogPosts, 5 * 60 * 1000); // Refresh every 5 minutes

// ✅ Correct ES Module export
export { getAllBlogPosts, getBlogPostBySlug, getRelatedBlogPosts };
