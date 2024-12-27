import React from 'react';
import { formatTime } from '../utils/formatTime';

const Message = ({ message }) => {
  const isUserMessage = message.sender === 'user';

  return (
    <div className={`flex message-item ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] break-words rounded-lg px-4 py-2 transition-all hover:scale-[1.02] ${
          isUserMessage ? 'bg-blue-500 text-white' : 'bg-white'
        }`}
      >
        <p>{message.text}</p>
        <span className={`text-xs ${isUserMessage ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Message;