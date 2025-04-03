// components/SubscribeForm.jsx
'use client'
import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };
  
  return (
    <div className="subscribe-form p-4 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Subscribe to our blog</h3>
      <p className="mb-4">Get notified when we publish new content!</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="px-4 py-2 rounded border flex-grow"
        />
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {status === 'success' && 
        <p className="mt-2 text-green-600">Thanks for subscribing!</p>
      }
      {status === 'error' && 
        <p className="mt-2 text-red-600">Something went wrong. Please try again.</p>
      }
    </div>
  );
}