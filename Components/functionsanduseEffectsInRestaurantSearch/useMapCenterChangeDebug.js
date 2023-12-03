import { useEffect } from 'react';

export const useMapCenterChangeDebug = (mapCenter) => {
    useEffect(() => {
        console.log("mapCenter changed:", mapCenter);
    }, [mapCenter]);
};
