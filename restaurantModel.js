const restaurantSchema = new mongoose.Schema({
    name: String,
    address: String,
    contactDetails: {
        phone: String,
        email: String,
        website: String
    },
    openingHours: {
        monday: String,
        tuesday: String,
        // ... (rest of the days)
    },
    images: [String], // URLs to images
    menus: [{
        name: String,
        items: [{
            name: String,
            description: String,
            price: Number
        }]
    }],
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    cuisine: String,
    priceRange: Number, // You can define this as per your requirements (e.g., 1-5)
    rating: Number,
    dietaryOptions: [String], // E.g., ["Vegetarian", "Vegan"]
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
restaurantSchema.index({ location: '2dsphere' });