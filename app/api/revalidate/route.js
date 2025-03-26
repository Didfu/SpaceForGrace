import { clearNotionCache } from "@/lib/notion";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        clearNotionCache(); // ✅ Clears Notion cache
        revalidatePath("/blog"); // ✅ Clears Next.js page cache

        return NextResponse.json({ message: "Cache cleared successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error clearing cache:", error);
        return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
    }
}
