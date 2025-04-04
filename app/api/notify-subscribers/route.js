// app/api/notify-subscribers/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// In a real app, you would get this from your database
// This is just a placeholder for demonstration
const subscribers = [
  { email: "your-test-email@example.com", token: "test-token" }
];

export async function POST(request) {
  // Validate internal API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { blogTitle, blogUrl } = await request.json();
    
    // Get all subscribers (in a real app, from your database)
    // const subscribers = await db.collection('subscribers').find().toArray();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify" });
    }
    
    // Send email to each subscriber
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: "Space For Grace <spaceforgrace@gmail.com>",
        to: subscriber.email,
        subject: `New Blog Post: ${blogTitle}`,
        html: `
          <h2>New post on Space For Grace!</h2>
          <p>We just published a new blog post: <strong>${blogTitle}</strong></p>
          <p><a href="${blogUrl}">Read it here</a></p>
          <p>Thanks for subscribing!</p>
          <p>If you wish to unsubscribe, <a href="https://spaceforgrace.vercel.app/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.token}">click here</a>.</p>
        `,
      })
    );
    
    await Promise.all(emailPromises);
    
    return NextResponse.json({ 
      success: true, 
      message: `Notification sent to ${subscribers.length} subscribers` 
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}