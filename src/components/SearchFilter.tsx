'use client';

import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

export default function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-900 mb-2">
            Search Vault Items
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title, username, URL, or notes..."
            style={{ color: '#1f2937' }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="sm:w-48">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-900 mb-2">
            Filter by Type
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="all" className="text-gray-900">All Items</option>
            <option value="recent" className="text-gray-900">Recent (Last 7 days)</option>
            <option value="websites" className="text-gray-900">Websites</option>
            <option value="apps" className="text-gray-900">Applications</option>
            <option value="accounts" className="text-gray-900">Accounts</option>
          </select>
        </div>
      </div>

      {/* Search Tips */}
      <div className="mt-3 text-sm text-gray-700">
        <p>💡 Search tips: Use keywords like &quot;gmail&quot;, &quot;facebook&quot;, or &quot;banking&quot; to find specific items</p>
      </div>
    </div>
  );
}
