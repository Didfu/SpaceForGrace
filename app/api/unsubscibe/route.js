// app/api/unsubscribe/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  if (!email || !token) {
    return NextResponse.json({ error: "Missing email or token" }, { status: 400 });
  }
  
  try {
    // In a real app, you would verify the token and remove from your database:
    // const result = await db.collection('subscribers').deleteOne({ 
    //   email: email, 
    //   token: token 
    // });
    
    // if (result.deletedCount === 0) {
    //   return NextResponse.json({ error: "Invalid unsubscribe request" }, { status: 400 });
    // }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}