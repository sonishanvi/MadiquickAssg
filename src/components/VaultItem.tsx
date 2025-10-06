'use client';

import { useState } from 'react';
import { VaultItemData } from '@/lib/encryption';

interface VaultItemProps {
  item: {
    _id: string;
    encryptedData: string;
    createdAt: string;
    updatedAt: string;
  };
  userPassword: string;
  onEdit: (id: string, data: VaultItemData) => void;
  onDelete: (id: string) => void;
}

export default function VaultItem({ item, userPassword, onEdit, onDelete }: VaultItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptedData, setDecryptedData] = useState<VaultItemData | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const decryptItem = async () => {
    try {
      const { decryptVaultItem } = await import('@/lib/encryption');
      const data = decryptVaultItem(item.encryptedData, userPassword);
      setDecryptedData(data);
      setIsDecrypted(true);
    } catch (error) {
      alert('Failed to decrypt item. Please check your password.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Auto-clear after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('');
      }, 15000);
      alert('Copied to clipboard! Will auto-clear in 15 seconds.');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleEdit = () => {
    if (!isDecrypted) {
      decryptItem();
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!decryptedData) return;

    try {
      const { encryptVaultItem } = await import('@/lib/encryption');
      const encryptedData = encryptVaultItem(decryptedData, userPassword);
      
      const response = await fetch(`/api/vault/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ encryptedData }),
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Item updated successfully!');
      } else {
        alert('Failed to update item');
      }
    } catch (error) {
      alert('Failed to update item');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/vault/${item._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          onDelete(item._id);
        } else {
          alert('Failed to delete item');
        }
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      {!isDecrypted ? (
        <div className="text-center">
          <button
            onClick={decryptItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Decrypt Item
          </button>
        </div>
      ) : (
        <div>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={decryptedData?.title || ''}
                  onChange={(e) => setDecryptedData({...decryptedData!, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={decryptedData?.username || ''}
                  onChange={(e) => setDecryptedData({...decryptedData!, username: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={decryptedData?.password || ''}
                  onChange={(e) => setDecryptedData({...decryptedData!, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={decryptedData?.url || ''}
                  onChange={(e) => setDecryptedData({...decryptedData!, url: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={decryptedData?.notes || ''}
                  onChange={(e) => setDecryptedData({...decryptedData!, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{decryptedData?.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Username:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-900">{decryptedData?.username}</span>
                    <button
                      onClick={() => copyToClipboard(decryptedData?.username || '')}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Password:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-900">
                      {showPassword ? decryptedData?.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(decryptedData?.password || '')}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                {decryptedData?.url && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">URL:</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={decryptedData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-xs font-medium"
                      >
                        {decryptedData.url}
                      </a>
                      <button
                        onClick={() => copyToClipboard(decryptedData.url || '')}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                
                {decryptedData?.notes && (
                  <div>
                    <span className="font-medium text-gray-900">Notes:</span>
                    <p className="text-sm text-gray-900 mt-1">{decryptedData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
