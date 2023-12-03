import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouritesContext = React.createContext();

export const useFavourites = () => React.useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
    const [favourites, setFavourites] = React.useState([]);
    const [lastRemovedFavouriteId, setLastRemovedFavouriteId] = React.useState(null);

    // Load favourites when the component mounts
    React.useEffect(() => {
        (async () => {
            const loadedFavourites = await loadFavouritesFromStorage();
            setFavourites(loadedFavourites);
        })();
    }, []);

    const saveFavouritesToStorage = async (favourites) => {
        try {
            await AsyncStorage.setItem('my_favourites', JSON.stringify(favourites));
        } catch (error) {
            console.error("Error saving favourites: ", error);
        }
    };
    
    const loadFavouritesFromStorage = async () => {
        try {
            const storedFavourites = await AsyncStorage.getItem('my_favourites');
            if (storedFavourites) {
                return JSON.parse(storedFavourites);
            }
            return [];  // Default to empty array if nothing found
        } catch (error) {
            console.error("Error loading favourites: ", error);
            return [];  // Default to empty array on error
        }
    };

    const addFavourite = (item) => {
        const newFavourites = [...favourites, item];
        setFavourites(newFavourites);
        saveFavouritesToStorage(newFavourites);
    };

    const removeFavourite = async (itemId) => {
        const newFavourites = favourites.filter(fav => fav.id !== itemId);
        setFavourites(newFavourites);
        setLastRemovedFavouriteId(itemId); // set the ID of the removed favourite
        saveFavouritesToStorage(newFavourites);
        try {
            await AsyncStorage.setItem('favourites', JSON.stringify(newFavourites));
          } catch (error) {
            console.error("Error removing favourite: ", error);
          }
    };

    return (
        <FavouritesContext.Provider value={{ favourites, setFavourites, addFavourite, removeFavourite,saveFavouritesToStorage,loadFavouritesFromStorage,lastRemovedFavouriteId }}>
            {children}
        </FavouritesContext.Provider>
    );
};
