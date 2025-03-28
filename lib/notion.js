import { Client } from '@notionhq/client';
import slugify from 'slugify';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const BLOG_PARENT_PAGE_ID = process.env.NOTION_PAGE_ID;

// ✅ Fetch page content
async function getPageContent(pageId) {
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    const blocks = response.results;

    await Promise.all(
      blocks
        .filter(block => block.has_children)
        .map(async block => {
          block.children = await getPageContent(block.id);
        })
    );

    return blocks;
  } catch (error) {
    console.error('Error fetching page content:', error);
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

// ✅ Fetch all blog posts
async function getAllBlogPosts() {
  if (!BLOG_PARENT_PAGE_ID) {
    throw new Error("❌ Missing NOTION_BLOG_PAGE_ID in environment variables.");
  }

  try {
    const response = await notion.blocks.children.list({ block_id: BLOG_PARENT_PAGE_ID });
    const childPages = response.results.filter(block => block.type === 'child_page');

    const posts = await Promise.all(
      childPages.map(async (block) => {
        const response = await notion.pages.retrieve({ page_id: block.id });
        const title = response.properties?.title?.title?.[0]?.plain_text || 'Untitled';
        const slug = slugify(title, { lower: true, strict: true });

        const subpageContent = await getPageContent(block.id);
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

    // ✅ Sort posts by date (Latest First)
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// ✅ Fetch a single blog post
async function getBlogPostBySlug(slug) {
  const posts = await getAllBlogPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return null;

  post.content = await getPageContent(post.id);
  post.date = extractDateFromSubpage(post.content); // Get accurate date
  return post;
}

// ✅ Get related blog posts
async function getRelatedBlogPosts(postId) {
  const allPosts = await getAllBlogPosts();
  return allPosts
    .filter(post => post.id !== postId)
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 2);
}

// ✅ Correct ES Module export
export { getAllBlogPosts, getBlogPostBySlug, getRelatedBlogPosts };
