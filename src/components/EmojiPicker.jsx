import React from 'react';

const emojis = [
  '😊', '😂', '❤️', '👍', '🙌', '🎉', '🔥', '😎',
  '🤔', '😢', '😍', '🤣', '😅', '👋', '🙏', '👏',
  '💪', '✨', '⭐', '💯', '🎈', '🎁', '💝', '🌟'
];

const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onSelect(emoji)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;