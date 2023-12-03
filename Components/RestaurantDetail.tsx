import React, { useEffect, useState } from 'react';

// Define the shape of the restaurant detail
interface RestaurantDetail {
  name: string;
  location: string;
  rating: number;
  // ... other fields
}

// Dummy function to simulate an API call
const fetchRestaurantDetailFromAPI = async (): Promise<RestaurantDetail> => {
  // Normally, you would make an API request here
  // For demonstration, we'll just return some mock data
  return {
    name: 'Sample Restaurant',
    location: 'Sample Location',
    rating: 4.5,
    // ... other fields
  };
};

const RestaurantDetail: React.FC = () => {
  const [restaurantDetail, setRestaurantDetail] = useState<RestaurantDetail | null>(null);

  useEffect(() => {
    // Fetch restaurant details when the component mounts
    const fetchData = async () => {
      const detail = await fetchRestaurantDetailFromAPI();
      setRestaurantDetail(detail);
    };

    fetchData();
  }, []);

  // Render loading state if data is not yet available
  if (!restaurantDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{restaurantDetail.name}</h1>
      <p>Location: {restaurantDetail.location}</p>
      <p>Rating: {restaurantDetail.rating}</p>
      {/* Render other details here */}
    </div>
  );
};

export default RestaurantDetail;
