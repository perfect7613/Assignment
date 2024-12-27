export const useIndexedDB = () => {
    const dbName = 'WhatsAppClone';
    const dbVersion = 1;
    let db = null;
  
    const initDB = () => {
      return new Promise((resolve, reject) => {
        // Delete existing database to force upgrade
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        deleteRequest.onsuccess = () => {
          const request = indexedDB.open(dbName, dbVersion);
  
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            db = request.result;
            resolve(db);
          };
  
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create messages store
            if (!db.objectStoreNames.contains('messages')) {
              const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
              messagesStore.createIndex('contactId', 'contactId', { unique: false });
              console.log('Created messages store with contactId index');
            }
            
            // Create contacts store
            if (!db.objectStoreNames.contains('contacts')) {
              const contactsStore = db.createObjectStore('contacts', { keyPath: 'id' });
              contactsStore.createIndex('name', 'name', { unique: false });
              console.log('Created contacts store with name index');
            }
          };
        };
      });
    };
  
    const storeData = async (storeName, data) => {
      if (!db) {
        db = await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    };
  
    const getMessagesByContactId = async (contactId) => {
      if (!db) {
        db = await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('messages', 'readonly');
        const store = transaction.objectStore('messages');
        const contactIdIndex = store.index('contactId');
  
        const request = contactIdIndex.getAll(contactId);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
      });
    };
  
    return { storeData, getMessagesByContactId };
  };