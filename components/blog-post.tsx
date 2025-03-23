import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: any[];
    categories?: string[];
    coverImage?: string;
    excerpt?: string;
    date?: string;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const renderBlock = (block) => {
    if (!block) return null; // Ensure block exists before rendering
  
    const renderText = (richTextArray) =>
      richTextArray.map((textObj, index) => {
        let textElement = textObj.plain_text;
  
        if (textObj.annotations.bold) textElement = <strong key={index}>{textElement}</strong>;
        if (textObj.annotations.italic) textElement = <em key={index}>{textElement}</em>;
        if (textObj.annotations.underline) textElement = <u key={index}>{textElement}</u>;
        if (textObj.annotations.strikethrough) textElement = <s key={index}>{textElement}</s>;
  
        return <span key={index}>{textElement} </span>;
      });
  
    switch (block.type) {
      case 'paragraph':
        return <p key={block.id} className="mb-4">{renderText(block.paragraph?.rich_text || [])}</p>;
  
      case 'heading_2':
        return <h2 key={block.id} className="text-2xl font-bold mt-6 mb-4">{renderText(block.heading_2?.rich_text || [])}</h2>;
  
      case 'heading_3':
        return <h3 key={block.id} className="text-xl font-semibold mt-4 mb-3">{renderText(block.heading_3?.rich_text || [])}</h3>;
  
      case 'bulleted_list_item':
        return <li key={block.id} className="mb-2">{renderText(block.bulleted_list_item?.rich_text || [])}</li>;
  
      case 'image':
        return (
          <div key={block.id} className="relative aspect-video overflow-hidden rounded-lg my-6">
            <Image
              src={block.image.file.url}
              alt={block.image.caption?.[0]?.plain_text || 'Image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        );
  
      default:
        return null;
    }
  };
  
    

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.categories?.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
            </div>
          </div>

          
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt="Featured image for blog post"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.content.slice(1).map((block) => renderBlock(block))}
        </div>
      </article>
    </div>
  );
}