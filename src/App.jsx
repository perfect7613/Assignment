import React from 'react';
import { AppProvider } from './context/AppContext';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';

const App = () => {
  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100">
        <ContactList />
        <ChatWindow />
      </div>
    </AppProvider>
  );
};

export default App;