// ItemsContext.js
import React, { createContext, useState, useContext } from 'react';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState({});
    const [orderId, setOrderId] = useState(null);
    const [subtotal, setSubtotal] = useState([]);
    const [deviceLocation, setDeviceLocation] = useState({
        latitude: null,
        longitude: null,
      });
      const [mapKey, setMapKey] = useState(1);
      const [token, setToken] = useState('');

    const contextValue = {
        selectedItems,
        setSelectedItems,
        orderId,
        setOrderId,
        subtotal,         // Add subtotal to the context
        setSubtotal ,      // Add setSubtotal to the context
        deviceLocation,
        setDeviceLocation,
        mapKey,
        setMapKey,
        token,
        setToken
    };

    return (
        <ItemsContext.Provider value={contextValue}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error("useItems must be used within a ItemsProvider");
    }
    return context;
};
