const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Fetch page content, including child blocks
async function getPageContent(pageId) {
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    const blocks = response.results;

    for (let block of blocks) {
      if (block.has_children) {
        block.children = await getPageContent(block.id);
      }
    }

    return blocks;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
}

// Extract date from the second meaningful paragraph block
function extractDateFromSubpage(blocks) {
  let count = 0;

  for (const block of blocks) {
    if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
      count++;
      if (count === 1) { // ✅ Fetching the second valid paragraph block
        return block.paragraph.rich_text[0].plain_text;
      }
    }
  }
  return new Date().toISOString(); // Default to current timestamp
}

// Fetch all blog posts from a Notion page
async function getAllBlogPosts(pageId) {
  const content = await getPageContent(pageId);

  const posts = await Promise.all(
    content
      .filter((block) => block.type === 'child_page')
      .map(async (block) => {
        const response = await notion.pages.retrieve({ page_id: block.id });

        const coverImage = response.cover
          ? response.cover.type === "external"
            ? response.cover.external.url
            : response.cover.file.url
          : null;

        const subpageContent = await getPageContent(block.id);
        const postDate = extractDateFromSubpage(subpageContent); // ✅ Fetching from second block
        return {
          id: block.id,
          title: block.child_page.title,
          slug: block.id, // Using block ID as slug
          categories: response.properties?.categories?.multi_select?.map(tag => tag.name) || [],
          coverImage: coverImage,
          excerpt: response.properties?.excerpt?.rich_text?.[0]?.plain_text || '',
          date: postDate,
        };
      })
  );
  // Sort posts by date, latest first
  posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
  
    return dateB - dateA; // Ensures newest first
  });
  
  return posts;
}

// Fetch a single blog post by slug
async function getBlogPostBySlug(slug) {
  if (!slug) throw new Error('Slug is required');

  const pageId = slug; // Assuming slug is the Notion page ID
  const content = await getPageContent(pageId);

  if (!content) return null;

  const response = await notion.pages.retrieve({ page_id: pageId });

  const coverImage = response.cover
    ? response.cover.type === "external"
      ? response.cover.external.url
      : response.cover.file.url
    : null;

  const postDate = extractDateFromSubpage(content);

  return {
    id: pageId,
    title: response.properties?.title?.title?.[0]?.plain_text || 'Untitled',
    content: content,
    coverImage: coverImage,
    date: postDate,
  };
}

module.exports = { getPageContent, getAllBlogPosts, getBlogPostBySlug };