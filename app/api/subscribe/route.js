// app/api/subscribe/route.js
import { NextResponse } from "next/server";
import crypto from 'crypto';

// This would be replaced with your actual database implementation
// For simplicity, we're using a simple array here
let subscribers = [];

// Generate a unique token for unsubscribe links
function generateToken(email) {
  return crypto.createHash('sha256').update(email + process.env.SECRET_KEY).digest('hex');
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return NextResponse.json({ 
        message: "You're already subscribed!",
        success: true
      });
    }
    
    // Add to subscribers
    const token = generateToken(email);
    subscribers.push({ email, token, subscribedAt: new Date() });
    
    // In a real app, you would save to a database:
    // await db.collection('subscribers').insertOne({ email, token, subscribedAt: new Date() });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}