import { NextResponse } from "next/server";

export async function POST(request) {
  // Get the request body as text
  const bodyText = await request.text();
  
  // Log the body for debugging - check your server logs
  console.log("Received webhook payload:", bodyText);
  
  try {
    // If body is JSON, parse it
    const payload = bodyText ? JSON.parse(bodyText) : {};
    
    // Check if this is a verification request
    if (payload.type === "verification") {
      console.log("Verification token received:", payload.verification_token);
      
      // Return the verification token in the required format
      return NextResponse.json({
        verification_token: payload.verification_token
      });
    }
    
    // Handle other webhook events...
    console.log("Webhook event received:", payload.type);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}