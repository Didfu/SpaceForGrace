import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { BlogPost } from "@/lib/blog"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative block">
        <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[3/2]"} overflow-hidden`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-wrap gap-2 mb-2">
          {post.categories?.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          <h3 className={`font-bold tracking-tight ${featured ? "text-2xl" : "text-xl"} line-clamp-2`}>{post.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </CardFooter>
    </Card>
  )
}