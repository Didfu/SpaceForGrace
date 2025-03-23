const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getPageContent(pageId) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    const blocks = response.results;

    // Recursively fetch child blocks
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

async function getAllBlogPosts(pageId) {
  const content = await getPageContent(pageId);
  // Process content to extract blog posts
  const posts = content.filter(block => block.type === 'child_page').map(block => ({
    id: block.id,
    title: block.child_page.title,
    slug: block.id, // Assuming the block ID is used as the slug
    categories: block.properties?.categories?.multi_select.map(tag => tag.name) || [], // Adjust this line based on your Notion schema
    coverImage: block.properties?.coverImage?.files[0]?.file?.url || null, // Adjust this line based on your Notion schema
    excerpt: block.properties?.excerpt?.rich_text[0]?.plain_text || '', // Adjust this line based on your Notion schema
    author: {
      name: block.properties?.author?.people[0]?.name || 'Unknown',
      avatar: block.properties?.author?.people[0]?.avatar_url || '/placeholder.svg', // Adjust this line based on your Notion schema
    },
    date: block.properties?.date?.date?.start || new Date().toISOString(), // Adjust this line based on your Notion schema
  }));

  return posts;
}

async function getBlogPostBySlug(slug) {
  if (!slug) {
    throw new Error('Slug is required');
  }

  const pageId = slug; // Assuming the slug is the page ID
  const content = await getPageContent(pageId);

  if (!content) {
    return null;
  }

  const post = {
    id: pageId,
    title: content[0]?.child_page?.title || 'Untitled',
    content: content,
    // Add more fields as needed
  };

  return post;
}

module.exports = { getPageContent, getAllBlogPosts, getBlogPostBySlug };