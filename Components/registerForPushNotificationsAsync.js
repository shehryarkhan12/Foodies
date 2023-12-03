
import * as Notifications from 'expo-notifications';

// Call this function when you want to register the push notification token
const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If no permission, ask for it
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // If no permission still, exit the function
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    // Get the token that uniquely identifies this device
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Assume username is stored in your app state
    const username = 'ShehryarKhan'; 

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch('http://192.168.1.5:4000/saveExpoPushToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token,
            username: username,
        }),
    });
};

// Call this function when the component mounts
useEffect(() => {
    registerForPushNotificationsAsync()
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error("Failed to register for push notifications:", error);
        });
}, []);

export default registerForPushNotificationsAsync;
