import React, { createContext, useState, useContext } from 'react';

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
    const [prices, setPrices] = useState([]);

    const updatePrice = (itemId, newPrice) => {
        setPrices(prevPrices => ({
            ...prevPrices,
            [itemId]: newPrice,
        }));
    };

    return (
        <PriceContext.Provider value={{ prices, updatePrice,setPrices }}>
            {children}
        </PriceContext.Provider>
    );
};

export const usePrice = () => {
    const context = useContext(PriceContext);
    if (!context) {
        throw new Error("usePrice must be used within a PriceProvider");
    }
    return context;
};
