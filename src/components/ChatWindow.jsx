import React, { useEffect, useRef, useMemo } from 'react';
import { MessageCircle, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Message from './Message';
import MessageInput from './MessageInput';
import { useDatabase } from '../hooks/useDatabase';

const ChatWindow = () => {
  const { state } = useAppContext();
  const messageEndRef = useRef(null);
  const { db, getMessagesForContact } = useDatabase();


  // Load messages with offline support
  useEffect(() => {
    if (state.selectedContact) {
      const loadMessages = async () => {
        try {
          await getMessagesForContact(state.selectedContact);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };
      loadMessages();
    }
  }, [state.selectedContact, getMessagesForContact]);

  const selectedContact = state.selectedContact;


  // Sort messages
  const sortedMessages = useMemo(() => {
    if (!messageData?.messages) return [];
    return [...messageData.messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [messageData?.messages]);

  // Auto-scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sortedMessages]);

  if (!state.selectedContact || !selectedContact) {
    return (
      <div className="w-2/3 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <p>Select a contact to start chatting</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="w-2/3 flex flex-col h-screen">
      <div className="p-3 bg-gray-100 border-b flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <h2 className="font-medium">{selectedContact.name}</h2>
          <p className="text-sm text-gray-500">
            {selectedContact.status || 'Online'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput 
        contactId={state.selectedContact}
        onMessageSent={async (message) => {
          try {
            await getMessagesForContact(state.selectedContact);
          } catch (error) {
            console.error('Error syncing message:', error);
          }
        }}
      />
    </div>
  );
};

export default ChatWindow;