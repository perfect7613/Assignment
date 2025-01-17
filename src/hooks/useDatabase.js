import { init, id, i } from '@instantdb/react';
import { useIndexedDB } from './useIndexedDB';
import { useCallback } from 'react';

// Define schema with both messages and contacts
const schema = i.schema({
  entities: {
    contacts: i.entity({
      name: i.string(),
      phone: i.string(),
      status: i.string(),
      timestamp: i.string(),
    }),
    messages: i.entity({
      contactId: i.string(),
      text: i.string(),
      timestamp: i.string(),
      sender: i.string(),
    }),
  },
});

const db = init({ 
  appId: "2addde50-c4df-4344-aa66-dc2db0fcc9e8",
  schema 
});

export const useDatabase = () => {
  const { storeData, getMessagesByContactId } = useIndexedDB();

  const syncWithIndexedDB = useCallback(async (messages) => {
    if (!messages) return;
    try {
      for (const message of messages) {
        await storeData('messages', message);
      }
    } catch (error) {
      console.error('Error syncing with IndexedDB:', error);
    }
  }, [storeData]);

  const getMessagesForContact = useCallback(async (contactId) => {
    if (!contactId) return [];
    try {
      // Use queryOnce for one-time queries
      const { data } = await db.queryOnce({ 
        messages: {
          $: {
            where: { contactId }
          }
        }
      });
      
      if (data?.messages) {
        await syncWithIndexedDB(data.messages);
        return data.messages;
      }
      return [];
    } catch (error) {
      console.log('Fetching from IndexedDB due to error:', error);
      return getMessagesByContactId(contactId);
    }
  }, [getMessagesByContactId, syncWithIndexedDB]);

  const getContactDetails = useCallback(async (contactId) => {
    if (!contactId) return null;
    try {
      // Use queryOnce to fetch contact details
      const { data } = await db.queryOnce({
        contacts: {
          $: {
            where: { id: contactId } // Assuming you have an ID field in your contacts
          }
        }
      });

      return data?.contacts ? data.contacts[0] : null; // Return the first contact found
    } catch (error) {
      console.error('Error fetching contact details:', error);
      return null;
    }
  }, []);

  const addMessage = async (messageData) => {
    const messageId = id();
    const newMessage = {
      id: messageId,
      ...messageData,
    };

    try {

      if (!newMessage.contactId || !newMessage.text || !newMessage.timestamp || !newMessage.sender) {
        throw new Error('Invalid message structure');
      }
      // Store in InstantDB
      await db.transact([
        db.tx.messages[messageId].update(newMessage),
      ]);  
      
      // Store in IndexedDB for offline access
      await storeData('messages', newMessage);
      return messageId;
    } catch (error) {
      console.error('Error adding message:', error);
      // If InstantDB fails, still try to store in IndexedDB
      try {
        await storeData('messages', newMessage);
        return messageId;
      } catch (indexedDBError) {
        console.error('Error storing in IndexedDB:', indexedDBError);
        throw error;
      }
    }
  };

  return { 
    db, 
    getMessagesForContact, 
    getContactDetails, // Return the new function
    addMessage 
  };
};