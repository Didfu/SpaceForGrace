// Update your app/api/notion-webhook/route.js to handle page creation events

import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request) {
  // Get the request body as text first for debugging
  const bodyText = await request.text();
  console.log("Received webhook payload:", bodyText);
  
  try {
    // Parse the JSON body
    const payload = JSON.parse(bodyText);
    
    // Handle verification requests from Notion
    if (payload.type === "verification") {
      console.log("Verification token received:", payload.verification_token);
      return NextResponse.json({ verification_token: payload.verification_token });
    }
    
    // Handle page creation events
    if (payload.type === "page.created") {
      console.log("New page created:", payload.page.id);
      
      // Get page details from Notion API
      const pageData = await notion.pages.retrieve({ page_id: payload.page.id });
      
      // Extract the page title
      let pageTitle = "New Blog Post";
      try {
        // The structure depends on your Notion page properties
        pageTitle = pageData.properties.Name?.title?.[0]?.plain_text || pageTitle;
      } catch (err) {
        console.error("Error getting page title:", err);
      }
      
      // Generate page URL
      const pageUrl = `https://spaceforgrace.vercel.app/blog/${payload.page.id}`;
      
      // Notify subscribers
      await notifySubscribers(pageTitle, pageUrl);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function notifySubscribers(title, url) {
  try {
    // Call your notification endpoint
    await fetch("https://spaceforgrace.vercel.app/api/notify-subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.INTERNAL_API_KEY
      },
      body: JSON.stringify({
        blogTitle: title,
        blogUrl: url
      })
    });
    
    console.log("Notification sent to subscribers");
  } catch (error) {
    console.error("Failed to notify subscribers:", error);
  }
}