import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserDetails = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
  
    userId: null,
  });

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
