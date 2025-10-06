'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleAuthSuccess = (token: string, user: { id: string; email: string }) => {
    localStorage.setItem('token', token);
    // Store user password for encryption (in a real app, you'd handle this more securely)
    const userPassword = prompt('Enter your password for encryption:');
    if (userPassword) {
      localStorage.setItem('userPassword', userPassword);
    }
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 Password Vault
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure password management with client-side encryption. 
            Generate strong passwords and store them safely in your personal vault.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-3">🔑</div>
            <h3 className="text-xl font-semibold mb-2">Password Generator</h3>
            <p className="text-gray-600">
              Generate strong, customizable passwords with length control and character options.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Client-Side Encryption</h3>
            <p className="text-gray-600">
              Your passwords are encrypted before leaving your device. We never see your data.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600">
              Search, edit, and organize your passwords with a clean, intuitive interface.
            </p>
          </div>
        </div>

        {/* Authentication Form */}
        <div className="max-w-md mx-auto">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Security Notice:</strong> This app uses client-side encryption. 
              Your master password is never stored on our servers. 
              Make sure to remember your password as we cannot recover it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}