// app/unsubscribe/page.jsx
'use client'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [status, setStatus] = useState('processing');
  
  useEffect(() => {
    if (email && token) {
      unsubscribe();
    } else {
      setStatus('invalid');
    }
    
    async function unsubscribe() {
      try {
        const response = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`);
        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Error unsubscribing:", error);
        setStatus('error');
      }
    }
  }, [email, token]);
  
  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Unsubscribe</h1>
      
      {status === 'processing' && (
        <p>Processing your unsubscribe request...</p>
      )}
      
      {status === 'success' && (
        <div>
          <p className="mb-4">You have been successfully unsubscribed from our newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always subscribe again.</p>
        </div>
      )}
      
      {status === 'error' && (
        <p className="text-red-600">There was a problem processing your request. Please try again or contact us for assistance.</p>
      )}
      
      {status === 'invalid' && (
        <p className="text-red-600">Invalid unsubscribe link. Please check the link in your email and try again.</p>
      )}
      
      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline">Return to homepage</a>
      </div>
    </div>
  );
}