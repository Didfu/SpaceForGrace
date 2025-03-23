import { GetStaticProps } from 'next';
import { getPageContent } from '../lib/notion';
import Image from "next/image";
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BlogPost({ content }) {
  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={block.id}>{block.paragraph.text[0]?.plain_text}</p>;
      case 'heading_2':
        return <h2 key={block.id}>{block.heading_2.text[0]?.plain_text}</h2>;
      case 'heading_3':
        return <h3 key={block.id}>{block.heading_3.text[0]?.plain_text}</h3>;
      case 'bulleted_list_item':
        return <li key={block.id}>{block.bulleted_list_item.text[0]?.plain_text}</li>;
      case 'image':
        return (
          <div key={block.id} className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={block.image.file.url}
              alt={block.image.caption[0]?.plain_text || 'Image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        );
      // Add more block types as needed
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
            <Badge variant="secondary">Technology</Badge>
            <Badge variant="secondary">Web Development</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Building Modern Web Applications with Next.js and React
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime="2025-03-09">March 9, 2025</time>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>8 min read</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Author" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Jane Doe</p>
              <p className="text-sm text-muted-foreground">Senior Developer</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Featured image for blog post"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {content.map((block) => renderBlock(block))}
        </div>

        {/* Footer */}
        <footer className="border-t pt-6">
          <div className="flex flex-wrap gap-2 items-center">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">Next.js</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">Web Development</Badge>
            <Badge variant="outline">JavaScript</Badge>
          </div>

          <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
            <Button variant="outline">← Previous Post</Button>
            <Button variant="outline">Next Post →</Button>
          </div>
        </footer>
      </article>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const pageId = process.env.NOTION_PAGE_ID;
  const content = await getPageContent(pageId);

  return {
    props: {
      content,
    },
  };
};