'use client';

import { useState, useCallback } from 'react';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Remove look-alike characters if option is enabled
    if (excludeLookalikes) {
      charset = charset.replace(/[0OIl1]/g, '');
    }
    
    if (charset.length === 0) {
      alert('Please select at least one character type');
      return;
    }
    
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(generatedPassword);
    onPasswordGenerated(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeLookalikes, onPasswordGenerated]);

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        // Auto-clear after 15 seconds
        setTimeout(() => {
          navigator.clipboard.writeText('');
        }, 15000);
        alert('Password copied to clipboard! Will auto-clear in 15 seconds.');
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy password');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Password Generator</h2>
      
      {/* Generated Password Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Generated Password:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm text-gray-900"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="128"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Character Options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex items-center text-gray-900">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="mr-2"
          />
          Uppercase (A-Z)
        </label>
        
        <label className="flex items-center text-gray-900">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="mr-2"
          />
          Lowercase (a-z)
        </label>
        
        <label className="flex items-center text-gray-900">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="mr-2"
          />
          Numbers (0-9)
        </label>
        
        <label className="flex items-center text-gray-900">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="mr-2"
          />
          Symbols (!@#$)
        </label>
      </div>

      {/* Exclude Look-alikes */}
      <div className="mb-4">
        <label className="flex items-center text-gray-900">
          <input
            type="checkbox"
            checked={excludeLookalikes}
            onChange={(e) => setExcludeLookalikes(e.target.checked)}
            className="mr-2"
          />
          Exclude look-alike characters (0, O, l, 1, I)
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        type="button"
        className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
      >
        Generate Password
      </button>
    </div>
  );
}
