import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useIndexedDB } from '../hooks/useIndexedDB';

const MessageInput = ({ contactId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const { addMessage } = useDatabase();
  const { storeData } = useIndexedDB();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !contactId) return;

    const newMessage = {
      contactId,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    try {
      // Store in InstantDB
      await addMessage(newMessage);

      // Store in IndexedDB for offline access
      await storeData('messages', newMessage);

      setMessage('');
      if (onMessageSent) {
        onMessageSent(newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // If InstantDB fails, still store in IndexedDB
      try {
        await storeData('messages', newMessage);
        setMessage('');
      } catch (indexedDBError) {
        console.error('Error storing in IndexedDB:', indexedDBError);
      }
    }
  };

  return (
    <form onSubmit={handleSend} className="p-4 bg-white border-t">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;