export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    try {
      await res.revalidate('/blog'); // ✅ This will clear the `/blog` page cache
      return res.status(200).json({ message: 'Cache cleared successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to clear cache' });
    }
  }
  