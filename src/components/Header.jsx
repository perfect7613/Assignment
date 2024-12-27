import React from 'react';
import { User, Plus, MoreVertical } from 'lucide-react';

const Header = ({ onNewChat }) => (
  <div className="bg-gray-100 p-3 flex items-center justify-between border-b">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-gray-600" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={onNewChat} 
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-600" />
      </button>
      <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  </div>
);

export default Header;