import Restaurant from './restaurantModel';

const getNearbyRestaurants = async (latitude, longitude) => {
    try {
        const nearbyRestaurants = await Restaurant.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 5000  // 5km
                }
            }
        });
        return nearbyRestaurants;
    } catch (error) {
        console.error(error);
        throw error;  // or handle it appropriately
    }
};

export default {
    getNearbyRestaurants,
};
