'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultItem from '@/components/VaultItem';
import SearchFilter from '@/components/SearchFilter';
import { VaultItemData, encryptVaultItem } from '@/lib/encryption';

interface VaultItemType {
  _id: string;
  encryptedData: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [vaultItems, setVaultItems] = useState<VaultItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPassword, setUserPassword] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [newItem, setNewItem] = useState<VaultItemData>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Get user password for decryption
    const storedPassword = localStorage.getItem('userPassword');
    if (storedPassword) {
      setUserPassword(storedPassword);
    }

    fetchVaultItems();
  }, [router]);

  const fetchVaultItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/vault', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVaultItems(data.items);
        setFilteredItems(data.items);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch vault items:', errorData);
        // Show user-friendly message
        alert('Failed to load vault items. Please check your database connection.');
      }
    } catch (error) {
      console.error('Failed to fetch vault items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filter);
  };

  const applyFilters = (searchQuery: string, filterType: string) => {
    let filtered = [...vaultItems];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => {
        try {
          // Decrypt the item to search through its actual content
          const { decryptVaultItem } = require('@/lib/encryption');
          const decryptedData = decryptVaultItem(item.encryptedData, userPassword);
          
          // Search through all fields
          const searchLower = searchQuery.toLowerCase();
          return (
            decryptedData.title?.toLowerCase().includes(searchLower) ||
            decryptedData.username?.toLowerCase().includes(searchLower) ||
            decryptedData.url?.toLowerCase().includes(searchLower) ||
            decryptedData.notes?.toLowerCase().includes(searchLower)
          );
        } catch (error) {
          // If decryption fails, fall back to basic search
          // Decryption failed for search, using fallback
          return item._id.toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => {
        try {
          // Decrypt the item to check its content for filtering
          const { decryptVaultItem } = require('@/lib/encryption');
          const decryptedData = decryptVaultItem(item.encryptedData, userPassword);
          
          const title = decryptedData.title?.toLowerCase() || '';
          const url = decryptedData.url?.toLowerCase() || '';
          const notes = decryptedData.notes?.toLowerCase() || '';
          
          switch (filterType) {
            case 'recent':
              // Show items from last 7 days
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              return new Date(item.createdAt) > sevenDaysAgo;
              
            case 'websites':
              // Show items that are website-related
              return title.includes('website') || title.includes('web') || 
                     url.includes('http') || url.includes('www') ||
                     title.includes('gmail') || title.includes('facebook') || 
                     title.includes('twitter') || title.includes('instagram');
                     
            case 'apps':
              // Show items that are application-related
              return title.includes('app') || title.includes('application') ||
                     title.includes('mobile') || title.includes('desktop') ||
                     notes.includes('app') || notes.includes('mobile');
                     
            case 'accounts':
              // Show items that are account-related
              return title.includes('account') || title.includes('login') ||
                     title.includes('bank') || title.includes('email') ||
                     title.includes('gmail') || title.includes('outlook') ||
                     notes.includes('account') || notes.includes('login');
                     
            default:
              return true;
          }
        } catch (error) {
          // If decryption fails, show the item (fallback)
          // Decryption failed for filter, showing item
          return true;
        }
      });
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
    applyFilters(searchQuery, filter);
  };

  const handlePasswordGenerated = (password: string) => {
    setNewItem({ ...newItem, password });
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.username || !newItem.password) {
      alert('Please fill in title, username, and password');
      return;
    }

    if (!userPassword) {
      const password = prompt('Enter your master password for encryption:');
      if (!password) {
        alert('Password is required to encrypt your data');
        return;
      }
      setUserPassword(password);
      localStorage.setItem('userPassword', password);
    }

    try {
      const encryptedData = encryptVaultItem(newItem, userPassword);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ encryptedData }),
      });

      if (response.ok) {
        const data = await response.json();
        setVaultItems([data.item, ...vaultItems]);
        setFilteredItems([data.item, ...filteredItems]);
        setNewItem({ title: '', username: '', password: '', url: '', notes: '' });
        setShowAddForm(false);
        alert('Item added successfully!');
      } else {
        alert('Failed to add item');
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    }
  };

  const handleEditItem = (id: string, data: VaultItemData) => {
    // This will be handled by the VaultItem component
    fetchVaultItems(); // Refresh the list
  };

  const handleDeleteItem = (id: string) => {
    setVaultItems(vaultItems.filter(item => item._id !== id));
    setFilteredItems(filteredItems.filter(item => item._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPassword');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Password Vault</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {showAddForm ? 'Cancel' : 'Add Item'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Password Generator */}
        <div className="mb-8">
          <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Vault Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Gmail Account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  value={newItem.username}
                  onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="your.email@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={newItem.password}
                  onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="Use generator above"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="https://gmail.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                rows={3}
                placeholder="Additional notes about this account..."
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />

        {/* Vault Items */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Vault Items ({filteredItems.length})</h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No vault items found</p>
              <p className="text-gray-400 mt-2">Add your first item using the &quot;Add Item&quot; button above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <VaultItem
                  key={item._id}
                  item={item}
                  userPassword={userPassword}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
