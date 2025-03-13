import Image from "next/image"
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function BlogPost() {
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
          <p>
            Next.js has revolutionized the way developers build React applications. With its powerful features like
            server-side rendering, static site generation, and incremental static regeneration, it provides an excellent
            foundation for creating fast, SEO-friendly web applications.
          </p>

          <h2>Why Choose Next.js?</h2>

          <p>
            The web development landscape is constantly evolving, and staying ahead of the curve is essential. Next.js
            offers several advantages that make it a compelling choice for modern web applications:
          </p>

          <ul>
            <li>Improved performance through server-side rendering and static generation</li>
            <li>Built-in routing system that's intuitive and powerful</li>
            <li>Automatic code splitting for faster page loads</li>
            <li>API routes for building backend functionality</li>
            <li>Great developer experience with hot reloading</li>
          </ul>

          <h2>Getting Started with Next.js</h2>

          <p>
            Setting up a Next.js project is straightforward. With just a few commands, you can have a fully functional
            application up and running. The framework provides sensible defaults while allowing for extensive
            customization when needed.
          </p>

          <p>
            The App Router introduced in Next.js 13 has further simplified the development process, making it easier to
            create complex layouts and nested routes. With React Server Components, you can now build more efficient
            applications with reduced client-side JavaScript.
          </p>

          <blockquote>
            "Next.js has transformed how we approach web development. The combination of performance optimizations and
            developer experience improvements makes it our go-to framework for new projects."
          </blockquote>

          <h2>Conclusion</h2>

          <p>
            As web applications continue to grow in complexity, having the right tools becomes increasingly important.
            Next.js provides a robust foundation that scales with your needs, whether you're building a simple blog or a
            complex e-commerce platform.
          </p>
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
  )
}
