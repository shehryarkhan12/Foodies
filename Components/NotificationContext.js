import React, { createContext, useState, useContext,useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0); // Example count
    const incrementNotificationCount = () => {
        setNotificationCount(prevCount => prevCount + 1);
    };

    useEffect(() => {
        console.log("Notification Count in Context:", notificationCount);
    }, [notificationCount]);

    const ContextValue=[
        notifications,
        setNotifications,
        notificationCount,
        setNotificationCount,
        incrementNotificationCount,
    ]
    return (
        <NotificationContext.Provider value={ContextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};