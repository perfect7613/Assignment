import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => (
  <div className="p-2 bg-gray-50">
    <div className="bg-white rounded-lg flex items-center px-3 py-1">
      <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search or start new chat"
        className="flex-1 outline-none text-sm py-2 bg-transparent"
      />
    </div>
  </div>
);

export default SearchBar;