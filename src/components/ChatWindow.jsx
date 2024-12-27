import React, { useEffect, useRef, useMemo } from 'react';
import { MessageCircle, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Message from './Message';
import MessageInput from './MessageInput';
import { useDatabase } from '../hooks/useDatabase';

const ChatWindow = () => {
  const { state } = useAppContext();
  const messageEndRef = useRef(null);
  const { getMessagesForContact, getContactDetails } = useDatabase();
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageData, setMessageData] = React.useState({ messages: [] });
  const [contactDetails, setContactDetails] = React.useState(null);

  useEffect(() => {
    const loadMessagesAndContact = async () => {
      if (!state.selectedContact) {
        setMessageData({ messages: [] });
        setContactDetails(null);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch messages for the selected contact
        const messages = await getMessagesForContact(state.selectedContact);
        setMessageData({ messages: messages || [] });

        // Fetch contact details for the selected contact
        const contact = await getContactDetails(state.selectedContact);
        setContactDetails(contact);
      } catch (error) {
        console.error('Error loading messages or contact details:', error);
        setMessageData({ messages: [] });
        setContactDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessagesAndContact();
  }, [state.selectedContact]); // React to contact change only

  // Periodic polling for new messages
  useEffect(() => {
    if (!state.selectedContact) return;

    const intervalId = setInterval(async () => {
      try {
        const updatedMessages = await getMessagesForContact(state.selectedContact);
        setMessageData({ messages: updatedMessages });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount or contact change
  }, [state.selectedContact]);

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

  const handleNewMessage = async (newMessage) => {
    try {
      // Optimistically add the new message
      setMessageData((prev) => ({ messages: [...prev.messages, newMessage] }));

      // Sync with server
      const updatedMessages = await getMessagesForContact(state.selectedContact);
      setMessageData((prev) => ({ messages: [...prev.messages, ...updatedMessages] }));
    } catch (error) {
      console.error('Error syncing message:', error);
    }
  };

  if (!state.selectedContact) {
    return (
      <div className="w-2/3 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <p>Select a contact to start chatting</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-2/3 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading chat...</p>
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
          <h2 className="font-medium">{contactDetails ? contactDetails.name : 'Loading...'}</h2>
          <p className="text-sm text-gray-500">
            {contactDetails ? contactDetails.status || 'Online' : 'Loading...'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {sortedMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput 
        contactId={state.selectedContact}
        onMessageSent={handleNewMessage}
      />
    </div>
  );
};

export default ChatWindow;
