import googlemaps

# Initialize Google Maps client with your API key
gmaps = googlemaps.Client(key='AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U')  # Replace with your actual API key

# Define a location (latitude and longitude)
location = (31.520370, 74.358749)  # Coordinates for Lahore, Pakistan

# Perform a nearby search for restaurants
restaurants = gmaps.places_nearby(location=location, radius=1000, type='restaurant')

# Extract place_ids and fetch websites
for restaurant in restaurants.get('results', []):
    place_id = restaurant['place_id']
    place_details = gmaps.place(place_id=place_id)
    website = place_details.get('result', {}).get('website', 'No website available')
    print(restaurant['name'], place_id, website)
