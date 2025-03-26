import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        revalidatePath("/blog"); // ✅ Clears the cache for `/blog`
        
        // Optionally force-fetch the page to trigger a refresh
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
