// Sample blog data
export type BlogPost = {
      id: string;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      coverImage: string;
      date: string;
      readingTime: string;
      author: {
            name: string;
            role: string;
            avatar: string;
      };
      categories: string[];
      tags: string[];
};

export const blogPosts: BlogPost[] = [];

// Get all blog posts sorted by date (newest first)
export function getAllBlogPosts() {
      return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a single blog post by slug
export function getBlogPostBySlug(slug: string) {
      return blogPosts.find((post) => post.slug === slug);
}

// Get related posts (excluding the current post)
export function getRelatedPosts(currentSlug: string, limit = 3) {
      return getAllBlogPosts()
            .filter((post) => post.slug !== currentSlug)
            .slice(0, limit);
}
