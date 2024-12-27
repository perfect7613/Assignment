import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  selectedContact: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_CONTACT':
      return {
        ...state,
        selectedContact: action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);