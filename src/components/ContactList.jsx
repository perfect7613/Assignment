import React, { useState } from 'react';
import { User, Plus } from 'lucide-react';
import { init, id } from '@instantdb/react';
import { useAppContext } from '../context/AppContext';
import AddContactModal from './AddContactModal';

const db = init({
  appId: "2addde50-c4df-4344-aa66-dc2db0fcc9e8",
});

const ContactList = () => {
  const { state, dispatch } = useAppContext();
  const [showAddContact, setShowAddContact] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = db.useQuery({
    contacts: {},
  });

  const handleContactClick = (contactId) => {
    if (contactId !== state.selectedContact) {
      dispatch({ type: 'SELECT_CONTACT', payload: contactId });
    }
  };

  const filteredContacts = data?.contacts?.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddContact = async (contactData) => {
    const contactId = id();
    try {
      await db.transact([
        db.tx.contacts[contactId].update({
          id: contactId,
          ...contactData,
          timestamp: new Date().toISOString(),
        }),
      ]);
      // Automatically select the newly added contact
      handleContactClick(contactId);
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  return (
    <div className="w-1/3 border-r border-gray-200 h-screen bg-white flex flex-col">
      <div className="p-4 bg-gray-100 flex items-center justify-between">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <button
          onClick={() => setShowAddContact(true)}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-2 bg-gray-50">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search or start new chat"
          className="w-full px-3 py-2 rounded-lg bg-white outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact.id)}
              className={`p-3 hover:bg-gray-50 cursor-pointer border-b transition-colors duration-200 ${
                state.selectedContact === contact.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.status}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No contacts found</div>
        )}
      </div>

      {showAddContact && (
        <AddContactModal
          isOpen={showAddContact}
          onClose={() => setShowAddContact(false)}
          onAdd={handleAddContact}
        />
      )}
    </div>
  );
};

export default ContactList;