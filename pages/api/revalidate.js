import { revalidateTag } from 'next/cache';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await revalidateTag('blog_posts_cache'); // 👈 Clears old cache
    return res.status(200).json({ message: 'Cache cleared successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to clear cache' });
  }
}
