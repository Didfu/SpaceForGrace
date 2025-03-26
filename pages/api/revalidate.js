import { clearNotionCache } from "@/lib/notion";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // 🧹 Clear Notion cache to ensure fresh data
        clearNotionCache();  

        // 🔄 Revalidate Next.js cache for `/blog`
        revalidatePath("/blog"); 

        // 🚀 Trigger a hard refresh of the page
        await fetch("https://spaceforgrace.vercel.app/blog", {
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
        });

        return NextResponse.json({ message: "Cache cleared successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error clearing cache:", error);
        return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
    }
}
