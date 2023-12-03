import express, { Router, json } from 'express';
import { connect, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pkg from 'bcryptjs';
const { compareSync } = pkg;
import axios from 'axios';
const { get } = axios;
import { Expo } from 'expo-server-sdk';

let expo = new Expo();


import cors from 'cors';
const router = Router();
import config from './config.json' assert { type: 'json' };
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';


const GOOGLE_API_KEY = 'AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U';
console.log("Using Google API Key:", GOOGLE_API_KEY);
const app = express();
const PORT = 4000;
const SECRET_KEY = '0325';  // Change this!

//import { initializeApp, credential as _credential, messaging } from 'firebase-admin';
//import serviceAccount from 'path/to/serviceAccountKey.json'; // Your Firebase config file


const userSchema = new Schema({
    
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: Object, default: {} },
    resetCode: { type: String, default: null },
    resetCodeExpires: { type: Date, default: null },
    expoPushTokens: [{ type: String }]
});

const User = model('User', userSchema);
const restaurantSchema = new Schema({
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
    price_level: Number, // You can define this as per your requirements (e.g., 1-5)
    rating: Number,
    dietaryOptions: [String], // E.g., ["Vegetarian", "Vegan"]
});
restaurantSchema.index({ location: '2dsphere' });
const Restaurant = model('Restaurant', restaurantSchema);



const itemSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  });
  
  const categorySchema = new Schema({
    name: { type: String, required: true },
    items: [itemSchema] // Directly use the itemSchema here
  });
  
  const menuSchema = new Schema({
    categories: [categorySchema]
  });
  
  const Menu = model('Menu', menuSchema);
  
  const orderItemSchema = new Schema({
    name: String,
    quantity: Number,
    price: Number,
    lati: Number,
    longi: Number,
    token: String,
    
    // Add more fields as necessary
  });
  
  // Create a model from the schema
  const OrderItem = model('OrderItem', orderItemSchema);
 
//   (async () => {

//     const newMenuData = {
//         categories: [
//             {
//                 name: "Burgers",
//                 items: [
//                     {
//                         name: "THE SUPER CBO",
//                         price: 450,
//                         description: "Delicious burger with a variety of toppings.",
//                         imageUrl: "https://raineysworld.weebly.com/uploads/4/7/4/1/47418761/3369551.jpg?266"
//                       },
//                       {
//                         name: "BIG MAC",
//                         price: 550,
//                         description: "Iconic burger with special sauce and double patties.",
//                         imageUrl: "https://static.wikia.nocookie.net/ronaldmcdonald/images/a/a4/Double_Big_Mac.jpg/revision/latest?cb=20150714024147"
//                       },
//                       {
//                         name: "BIG TASTY",
//                         price: 525,
//                         description: "Tasty burger with fresh ingredients.",
//                         imageUrl: "https://images.openfoodfacts.org/images/products/200/000/002/5785/front_fr.23.400.jpg"
//                       },
//                       {
//                         name: "CRISPY MCBACON",
//                         price: 425,
//                         description: "Crispy bacon with juicy patties.",
//                         imageUrl: "https://mcdonalds.com.mt/wp-content/uploads/2023/02/WEBSITE-TEMPLATE.png"
//                       },
//                       {
//                         name: "DOUBLE CHICKEN CHEESE",
//                         price: 430,
//                         description: "Double chicken delight with cheese.",
//                         imageUrl: "https://mcdonalds.gr/wp-content/uploads/2022/09/Double-Chicken-Cheese-1280x866px.png"
//                       },
//                       {
//                         name: "McCHICKEN",
//                         price: 525,
//                         description: "Classic McChicken with mayo.",
//                         imageUrl: "https://mcdonalds.com.au/sites/mcdonalds.com.au/files/product-McChicken-2023-desktop.png"
//                       },
//                       {
//                         name: "DOUBLE CHEESEBURGER",
//                         price: 426,
//                         description: "Double patty with molten cheese.",
//                         imageUrl: "https://facts.net/wp-content/uploads/2023/06/McDonalds-Double-Cheeseburger-730x494.jpg"
//                       },
//                       {
//                         name: "HAMBURGER",
//                         price: 550,
//                         description: "Simple yet delicious hamburger.",
//                         imageUrl: "https://media.cnn.com/api/v1/images/stellar/prod/220428140436-04-classic-american-hamburgers.jpg?c=16x9&q=h_720,w_1280,c_fill/f_webp"
//                       },
//                       {
//                         name: "100% ANGUS BEEF THICKBURGERS",
//                         price: 850,
//                         description: "Made with 100% Angus beef for a rich flavor.",
//                         imageUrl: "https://mms.businesswire.com/media/20150923005171/en/487168/4/Tex_Mex_w_both_logos.jpg?download=1"
//                       },
//                       {
//                         name: "CHARGRILLED BURGERS",
//                         price: 780,
//                         description: "Perfectly chargrilled for a smoky taste.",
//                         imageUrl: "http://images.foodmento.com/U3P972F3861-1453148641-c3c.jpg"
//                       },
//                       {
//                         name: "FAMOUS STAR",
//                         price: 850,
//                         description: "Star burger with signature ingredients.",
//                         imageUrl: "https://carlsjr.com.my/wp-content/uploads/2020/08/famous-star-with-cheese.png"
//                       },
//                       {
//                         name: "JALAPENO",
//                         price: 890,
//                         description: "Spicy burger with jalapeno toppings.",
//                         imageUrl: "https://i0.wp.com/www.theimpulsivebuy.com/wordpress/wp-content/uploads/2023/07/mcdcheejalabaconqp1.jpeg?resize=768%2C768&ssl=1"
//                       },
                     
//                       {
//                         name: "MUSHROOM N SWISS",
//                         price: 870,
//                         description: "Loaded with mushrooms and Swiss cheese.",
//                         imageUrl: "https://whitneybond.com/wp-content/uploads/2023/05/mushroom-swiss-burger-13.jpeg"
//                       },
                      
//                       {
//                         name: "CRUNCHY FISH BURGER",
//                         price: 380, 
//                         description: "Crispy fish fillet burger with tartar sauce.",
//                         imageUrl: "https://www.kitchensanctuary.com/wp-content/uploads/2014/01/Crispy-Fish-Burger-with-Shoestring-Fries-Recipe-square-FS.jpg"
//                     },
//                     {
//                         name: "GRILLED CHICKEN SUPREME",
//                         price: 420, 
//                         description: "Grilled chicken burger with premium toppings.",
//                         imageUrl: "https://roomservice.com.pk/wp-content/uploads/2020/10/GOURMET-GRILLED-CHICKEN-BURGER-01.jpg"
//                     },
//                     {
//                         name: "MEXICAN FIESTA BURGER",
//                         price: 450, 
//                         description: "Burger loaded with Mexican-inspired flavors.",
//                         imageUrl: "https://www.foodmag.com.au/wp-content/uploads/2015/09/Grilld-1024x683.jpg"
//                     },
//                     {
//                         name: "SMOKED SALMON BURGER",
//                         price: 520, 
//                         description: "Burger with smoked salmon and cream cheese.",
//                         imageUrl: "https://www.delscookingtwist.com/wp-content/uploads/2014/08/Nordic-Burger2.jpg"
//                     },
//                     {
//                         name: "MANGO CHUTNEY BURGER",
//                         price: 400, 
//                         description: "Burger with tangy mango chutney.",
//                         imageUrl: "https://littlespoonfarm.com/wp-content/uploads/2021/07/turkey-burger-with-mango-chutney-recipe-2.jpg"
//                     },
               
//                     {
//                         name: "SPICY CHICKEN DELIGHT",
//                         price: 420, 
//                         description: "Spicy chicken burger with a delightful taste.",
//                         imageUrl: "https://www.yorkshirepudd.co.uk/wp-content/uploads/2023/08/Crispy20Chicken20Burgers20with20Lemon20Pepper20Mayo.jpg"
//                     },
//                     {
//                         name: "ZINGER BURGER",
//                         price: 380, 
//                         description: "Crunchy zinger burger with special sauce.",
//                         imageUrl: "https://mlwlg6cbmaj2.i.optimole.com/w:auto/h:auto/q:mauto/f:avif/https://foodstudioofficial.com/wp-content/uploads/2022/12/82.jpg"
//                     },
//                     {
//                         name: "VEGGIE DELUXE",
//                         price: 350, 
//                         description: "Deluxe vegetarian burger with fresh veggies.",
//                         imageUrl: "https://www.mcdonalds.be/_webdata/product-images/V1-2_Productpagina-Visuals_Veggie-De-Luxe.jpg"
//                     },
//                     {
//                         name: "BBQ BACON BURGER",
//                         price: 450, 
//                         description: "Burger with BBQ sauce and crispy bacon.",
//                         imageUrl: "https://potatorolls.com/wp-content/uploads/Maple-Bacon-Burger3-960x640.jpg"
//                     },
//                     {
//                         name: "SPICY VEGGIE BURGER",
//                         price: 350, 
//                         description: "Spicy vegetarian burger with a mix of veggies.",
//                         imageUrl: "https://pinchofyum.com/wp-content/uploads/Tofu-Burgers-1-2.jpg"
//                     },
//                     {
//                         name: "GOURMET TRUFFLE BURGER",
//                         price: 580, 
//                         description: "Luxurious burger with truffle-infused ingredients.",
//                         imageUrl: "https://stpierrebakery-co-uk.s3.eu-west-1.amazonaws.com/app/uploads/2021/11/Truffle-Mushroom-Burger.jpg"
//                     },
//                     {
//                         name: "SWEET AND SPICY CHICKEN BURGER",
//                         price: 450, 
//                         description: "Chicken burger with a perfect balance of sweet and spicy flavors.",
//                         imageUrl: "https://cdn-prd.healthymealplans.com/recipe/b7974c82b2c16b59d1f0ea6beae4544d-Sweet-Spicy-Chicken-Burger_16x9_Healthy-Meal-Plans.jpg"
//                     },
//                     {
//                         name: "TEX-MEX BBQ BURGER",
//                         price: 500, 
//                         description: "Burger with a Tex-Mex twist and tangy BBQ sauce.",
//                         imageUrl: "https://smokeygoodness.com/wp-content/uploads/2021/07/tex-mex-article--1024x683.jpg"
//                     },
//                     {
//                         name: "CRISPY ONION RING BURGER",
//                         price: 420, 
//                         description: "Burger topped with crispy onion rings for that extra crunch.",
//                         imageUrl: "https://recipes.net/wp-content/uploads/2020/04/chicken-burger-with-crispy-onion-rings.jpg"
//                     },
//                 ]
//             },
//             {
//                 name: "Pizza",
//                 items: [
//                     {
//                         name: "MARGHERITA PIZZA",
//                         price: 700, 
//                         description: "Classic pizza with tomato sauce, mozzarella cheese, and basil.",
//                         imageUrl: "https://ohsweetbasil.com/wp-content/uploads/four-cheese-margherita-pizza-recipe-12-scaled.jpg"
//                     },
//                     {
//                         name: "PEPPERONI PIZZA",
//                         price: 800, 
//                         description: "Pizza with tomato sauce, mozzarella cheese, and pepperoni slices.",
//                         imageUrl: "https://tastesbetterfromscratch.com/wp-content/uploads/2023/06/Pepperoni-Pizza-1.jpg"
//                     },
//                     {
//                         name: "VEGETARIAN SUPREME PIZZA",
//                         price: 750, 
//                         description: "Pizza with assorted veggies, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://i0.wp.com/www.thursdaynightpizza.com/wp-content/uploads/2022/06/veggie-pizza-side-view-out-of-oven.png?resize=720%2C480&ssl=1"
//                     },
//                     {
//                         name: "BBQ CHICKEN PIZZA",
//                         price: 850,
//                         description: "Pizza with BBQ sauce, grilled chicken, onions, and mozzarella cheese.",
//                         imageUrl: "https://sallysbakingaddiction.com/wp-content/uploads/2014/03/Homemade-BBQ-Chicken-Pizza.jpg"
//                     },
//                     {
//                         name: "SPICY PEPPER PIZZA",
//                         price: 780, 
//                         description: "Pizza with spicy peppers, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://www.thecandidcooks.com/wp-content/uploads/2022/08/spicy-sausage-pepper-pizza-feature.jpg"
//                     },
//                     {
//                         name: "HAWAIIAN PIZZA",
//                         price: 780, 
//                         description: "Pizza with ham, pineapple, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://static01.nyt.com/images/2023/03/29/multimedia/23HAMREX2-pineapple-ham-pizza-qwct/HAMREX2-pineapple-ham-pizza-qwct-superJumbo.jpg"
//                     },
//                     {
//                         name: "MEAT LOVER'S PIZZA",
//                         price: 850, 
//                         description: "Pizza with pepperoni, sausage, bacon, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://www.queensleeappetit.com/wp-content/uploads/2019/02/Meat-Lovers-Pizza-5-1-480x480.jpg"
//                     },
//                     {
//                         name: "MEDITERRANEAN PIZZA",
//                         price: 820, 
//                         description: "Pizza with olives, feta cheese, sun-dried tomatoes, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://www.acouplecooks.com/wp-content/uploads/2019/06/Mediterranean-Pizza-001.jpg"
//                     },
//                     {
//                         name: "BUFFALO CHICKEN PIZZA",
//                         price: 890, 
//                         description: "Pizza with buffalo chicken, hot sauce, ranch dressing, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://thecozycook.com/wp-content/uploads/2023/08/Buffalo-Chicken-Pizza-f.jpg"
//                     },
//                     {
//                         name: "VEGAN DELIGHT PIZZA",
//                         price: 750, 
//                         description: "Vegan pizza with assorted veggies, tomato sauce, and dairy-free cheese.",
//                         imageUrl: "https://sundayfoodapprentice.files.wordpress.com/2014/04/dscn4367.jpg"
//                     },
//                     {
//                         name: "BBQ BEEF PIZZA",
//                         price: 870, 
//                         description: "Pizza with BBQ beef, onions, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://weirdandwildpizza.com/wp-content/uploads/2019/08/korean-bbq-beef-kimchi.jpg"
//                     },
//                     {
//                         name: "WHITE SAUCE CHICKEN PIZZA",
//                         price: 920, 
//                         description: "Pizza with creamy white sauce, chicken, mushrooms, and mozzarella cheese.",
//                         imageUrl: "https://lilluna.com/wp-content/uploads/2015/03/chicken-spinach-alfredo-pizza-resize-8.jpg"
//                     },
//                     {
//                         name: "SPINACH AND FETA PIZZA",
//                         price: 850,
//                         description: "Pizza with spinach, feta cheese, olives, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://cozycravings.com/wp-content/uploads/2023/05/DSC_5371-2.jpg"
//                     },
//                     {
//                         name: "THREE CHEESE PIZZA",
//                         price: 800, 
//                         description: "Pizza with cheddar, mozzarella, and parmesan cheese, tomato sauce, and basil.",
//                         imageUrl: "https://veenaazmanov.com/wp-content/uploads/2020/06/3-cheese-pizza-with-no-knead-pizza-dough3.jpg"
//                     },
//                     {
//                         name: "SUPREME DELUXE PIZZA",
//                         price: 950, 
//                         description: "Pizza with pepperoni, sausage, bell peppers, onions, olives, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://www.shutterstock.com/image-photo/beef-supreme-deluxe-pizza-topped-260nw-2195984379.jpg"
//                     },
//                     {
//                         name: "MUSHROOM LOVER'S PIZZA",
//                         price: 880, 
//                         description: "Pizza with assorted mushrooms, garlic sauce, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://i0.wp.com/www.thursdaynightpizza.com/wp-content/uploads/2021/05/finished-without-chives_STAMP.png?fit=1200%2C800&ssl=1"
//                     },
//                     {
//                         name: "CAPRESE PIZZA",
//                         price: 920, 
//                         description: "Pizza with tomatoes, fresh mozzarella cheese, basil, balsamic glaze, and olive oil.",
//                         imageUrl: "https://example.com/caprese-pizza.jpg"
//                     },
//                     {
//                         name: "BBQ PULLED PORK PIZZA",
//                         price: 950, 
//                         description: "Pizza with BBQ pulled pork, onions, BBQ sauce, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://thepracticalkitchen.com/wp-content/uploads/2020/08/bbq_pulled_pork_pizza-0204-1-scaled.jpg"
//                     },
//                     {
//                         name: "GREEK PIZZA",
//                         price: 890, 
//                         description: "Pizza with olives, feta cheese, red onions, tomatoes, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://www.cookingclassy.com/wp-content/uploads/2013/10/greek-pizza2+srgb.-450x500.jpg"
//                     },
//                     {
//                         name: "BUFFALO CAULIFLOWER PIZZA",
//                         price: 850, 
//                         description: "Pizza with buffalo cauliflower, blue cheese dressing, tomato sauce, and mozzarella cheese.",
//                         imageUrl: "https://www.threeolivesbranch.com/wp-content/uploads/2018/01/IMG_7841-768x1024.jpg"
//                     },
//                 ]
//             },
        
//             {
//                 name: "BBQ Tikka",
//                 items: [
//                     {
//                         name: "CHICKEN MALAI TIKKA",
//                         price: 350, 
//                         description: "Tender chicken pieces marinated in creamy malai (cream) sauce.",
//                         imageUrl: "https://www.cookwithnabeela.com/wp-content/uploads/2023/10/ChickenMalaiTikka.webp"
//                     },
//                     {
//                         name: "BEEF SEEKH KEBAB",
//                         price: 400, 
//                         description: "Minced beef kebabs seasoned with spices and grilled to perfection.",
//                         imageUrl: "https://www.ndtv.com/cooks/images/seekh-kebab-620.jpg"
//                     },
//                     {
//                         name: "FISH TIKKA",
//                         price: 450, 
//                         description: "Fresh fish fillets marinated in spices and grilled to perfection.",
//                         imageUrl: "https://vaya.in/recipes/wp-content/uploads/2018/03/Fish-Tikka.jpg"
//                     },
//                     {
//                         name: "PANEER TIKKA",
//                         price: 380, 
//                         description: "Cottage cheese cubes marinated in spices and grilled to a smoky perfection.",
//                         imageUrl: "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg"
//                     },
//                     {
//                         name: "MUTTON BOTI KEBAB",
//                         price: 500, 
//                         description: "Tender mutton pieces marinated and skewered for a delightful taste.",
//                         imageUrl: "https://c.ndtvimg.com/2020-01/6i8e995g_kebab_625x300_24_January_20.jpg"
//                     },
//                     {
//                         name: "BBQ VEGETABLES",
//                         price: 320, 
//                         description: "Assorted vegetables marinated and grilled for a flavorful experience.",
//                         imageUrl: "https://cdn.loveandlemons.com/wp-content/uploads/2019/07/best-grilled-vegetables.jpg"
//                     },
//                     {
//                         name: "CHICKEN RESHMI KEBAB",
//                         price: 420, 
//                         description: "Creamy and flavorful chicken kebabs marinated in a special Reshmi sauce.",
//                         imageUrl: "https://www.pakistanichefrecipes.com/wp-content/uploads/2019/06/Chicken-Reshmi-Kabab-500x500.jpg"
//                     },
//                     {
//                         name: "BEEF MALAI BOTI",
//                         price: 480, 
//                         description: "Tender beef pieces marinated in a creamy Malai sauce for a rich taste.",
//                         imageUrl: "https://www.foodfusion.com/wp-content/uploads/2019/08/Malai-Boti-Recipe-by-Food-fusion-5.jpg"
//                     },
//                     {
//                         name: "TANDOORI PRAWNS",
//                         price: 550, 
//                         description: "Large prawns marinated in Tandoori spices and grilled to perfection.",
//                         imageUrl: "https://mytastycurry.com/wp-content/uploads/2019/08/tandoori-Prawns1-1.jpg"
//                     },
//                     {
//                         name: "SPICY LAMB CHOPS",
//                         price: 600, 
//                         description: "Spicy and succulent lamb chops grilled to a smoky perfection.",
//                         imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/amritsari-crispy-lamb-chops-028cae6.jpg?resize=768,574"
//                     },
//                     {
//                         name: "SPICY CHICKEN WINGS",
//                         price: 350, 
//                         description: "Crispy chicken wings marinated in a spicy blend of sauces.",
//                         imageUrl: "https://bakerbynature.com/wp-content/uploads/2015/02/Sweet-and-Spicy-Sriracha-Chicken-Wings-0-6.jpg"
//                     },
//                     {
//                         name: "GARLIC BUTTER SHRIMPS",
//                         price: 450, 
//                         description: "Juicy shrimps sautéed in garlic butter for a rich and flavorful taste.",
//                         imageUrl: "https://www.wholesomeyum.com/wp-content/uploads/2022/01/wholesomeyum-Lemon-Garlic-Butter-Shrimp-Recipe-19.jpg"
//                     },
//                     {
//                         name: "BBQ VEGETABLE SKEWERS",
//                         price: 320, 
//                         description: "Assorted vegetables skewered and grilled with BBQ glaze.",
//                         imageUrl: "https://www.allrecipes.com/thmb/Pjnu0_YHcIYLlxwisZLSQeX3QvI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1968731-daca7034ebbf49fd85fd2da3cd180e1b.jpg"
//                     },
//                     {
//                         name: "MINTY LAMB KEBABS",
//                         price: 550, 
//                         description: "Lamb kebabs infused with mint and spices, grilled to perfection.",
//                         imageUrl: "https://www.ocado.com/cmscontent/recipe_image_large/30690928.jpg?Z9Ig"
//                     },
//                 ]
//             },
//             {
                

//                  name: "Appetizers",
//                         items: [
//                             {
//                                 name: "SAMOSA",
//                                 price: 50,
//                                 description: "Deep-fried pastry filled with spiced potatoes and peas.",
//                                 imageUrl: "https://www.cookwithnabeela.com/wp-content/uploads/2023/06/AlooSamosa3.webp"
//                             },
//                             {
//                                 name: "PAKORAY",
//                                 price: 260, 
//                                 description: "Deep-fried fritters made with gram flour and spices.",
//                                 imageUrl: "https://www.masala.tv/wp-content/uploads/2020/09/CHEESY-ONION-PAKORAYy.jpg"
//                             },
                            
//                         ]
//                     },
//                     {
//                         name: "Main Courses",
//                         items: [
//                             {
//                                 name: "BIRYANI",
//                                 price: 300, 
//                                 description: "Fragrant rice dish cooked with meat, spices, and herbs.",
//                                 imageUrl: "https://images.food52.com/7f0yncraWeYUJG_lLbH2ie1xd6g=/2016x1344/d815e816-4664-472e-990b-d880be41499f--chicken-biryani-recipe.jpg"
//                             },
//                             {
//                                 name: "NIHARI",
//                                 price: 550, 
//                                 description: "Slow-cooked meat stew with rich and flavorful gravy.",
//                                 imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/37/Mutton_Nihari.jpg"
//                             },
//                             {
//                                 name: "CHICKEN KARHAI",
//                                 price: 1350, 
//                                 description: "Spicy chicken curry cooked in a wok-like karhai with tomatoes and green chilies.",
//                                 imageUrl: "https://satyamskitchen.com/wp-content/uploads/2021/03/chicken_karahi_background_1_60-e1615515187927-700x525.jpg"
//                             },
//                             {
//                                 name: "BEEF NIHARI",
//                                 price: 400, 
//                                 description: "Slow-cooked beef stew with a flavorful and aromatic gravy.",
//                                 imageUrl: "https://untoldrecipesbynosheen.com/wp-content/uploads/2020/09/Nihari-new-hero-scaled.jpeg"
//                             },
//                             {
//                                 name: "PALAK PANEER",
//                                 price: 320, 
//                                 description: "Creamy spinach curry with chunks of paneer (Indian cottage cheese).",
//                                 imageUrl: "https://healthynibblesandbits.com/wp-content/uploads/2020/01/Saag-Paneer-FF.jpg"
//                             },
//                             {
//                                 name: "MASOOR DAL",
//                                 price: 280, 
//                                 description: "Red lentil curry cooked with onions, tomatoes, and spices.",
//                                 imageUrl: "https://www.jcookingodyssey.com/wp-content/uploads/2023/06/whole-masoor-dal-recipe.jpg"
//                             },
//                             {
//                                 name: "BEEF BIRYANI",
//                                 price: 450, 
//                                 description: "Flavorful rice dish cooked with tender beef, spices, and herbs.",
//                                 imageUrl: "https://www.kookingk.com/wp-content/uploads/2020/07/biryani-recipe.jpg"
//                             },
//                             {
//                                 name: "HARYALI CHICKEN",
//                                 price: 1380, 
//                                 description: "Tender chicken pieces marinated in green herbs and spices, grilled to perfection.",
//                                 imageUrl: "https://static.toiimg.com/photo/84667994.cms"
//                             },
//                             {
//                                 name: "MUTTON KORMA",
//                                 price: 3420,
//                                 description: "Mutton cooked in a rich, creamy gravy with aromatic spices.",
//                                 imageUrl: "https://therecipespk.com/wp-content/uploads/2014/03/Degi.Mutton.Korma_.jpg"
//                             },
//                             {
//                                 name: "ALOO GOSHT",
//                                 price: 1350,
//                                 description: "Classic Pakistani dish with tender meat and potatoes in a flavorful curry.",
//                                 imageUrl: "https://example.com/aloo-gosht.jpg"
//                             },
//                             {
//                                 name: "BHUNA GOSHT",
//                                 price: 1400, 
//                                 description: "Mutton cooked to perfection with onions, tomatoes, and spices.",
//                                 imageUrl: "https://example.com/bhuna-gosht.jpg"
//                             },
//                             {
//                                 name: "PALAK GOSHT",
//                                 price: 1360, 
//                                 description: "Mutton cooked with spinach, garlic, and spices for a healthy and tasty dish.",
//                                 imageUrl: "https://example.com/palak-gosht.jpg"
//                             },
//                         ]
//                     },
//                     {
//                         name: "Rice Dishes",
//                         items: [
//                             {
//                                 name: "CHICKEN BIRYANI",
//                                 price: 400, 
//                                 description: "Classic Pakistani biryani with flavorful chicken, rice, and aromatic spices.",
//                                 imageUrl: "https://images.food52.com/7f0yncraWeYUJG_lLbH2ie1xd6g=/2016x1344/d815e816-4664-472e-990b-d880be41499f--chicken-biryani-recipe.jpg"
//                             },
//                             {
//                                 name: "VEGETABLE PULAO",
//                                 price: 300, 
//                                 description: "Fragrant rice dish cooked with mixed vegetables and spices.",
//                                 imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/veg-pulao-recipe.jpg"
//                             },
//                             {
//                                 name: "CHICKEN PULAO",
//                                 price: 350, 
//                                 description: "Flavorful rice dish cooked with chicken, spices, and aromatic herbs.",
//                                 imageUrl: "https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/021d144c10c84d9b91fdfaf8068ce39e.png?resize=1200:*&output-format=jpg&output-quality=auto"
//                             },
//                             {
//                                 name: "BEEF BIRYANI",
//                                 price: 380, 
//                                 description: "Traditional Pakistani biryani with tender beef, rice, and flavorful spices.",
//                                 imageUrl: "https://www.kookingk.com/wp-content/uploads/2020/07/biryani-recipe.jpg"
//                             },
//                             {
//                                 name: "VEGETABLE FRIED RICE",
//                                 price: 250, 
//                                 description: "Stir-fried rice with mixed vegetables, soy sauce, and seasonings.",
//                                 imageUrl: "https://omnivorescookbook.com/wp-content/uploads/2023/06/230515_Vegetable-Fried-Rice_4.jpg"
//                             },
//                             {
//                                 name: "MUTTON YAKHNI PULAO",
//                                 price: 400, 
//                                 description: "Mutton pulao prepared with a flavorful yakhni (broth) and basmati rice.",
//                                 imageUrl: "https://myfoodstory.com/wp-content/uploads/2021/08/Mutton-Yakhni-Pulao-3.jpg"
//                             },
//                         ]
//                     },
//                     {
//                         name: "Desserts",
//                         items: [
//                             {
//                                 name: "GULAB JAMUN",
//                                 price: 150,
//                                 description: "Deep-fried milk dumplings soaked in sugar syrup.",
//                                 imageUrl: "https://static.toiimg.com/thumb/63799510.cms?imgsize=1091643&width=800&height=800"
//                             },
//                             {
//                                 name: "KHEER",
//                                 price: 120, 
//                                 description: "Creamy rice pudding with nuts and cardamom.",
//                                 imageUrl: "https://www.spiceupthecurry.com/wp-content/uploads/2021/10/kheer-recipe-2.jpg"
//                             },
//                             {
//                                 name: "RASMALAI",
//                                 price: 130, 
//                                 description: "Soft cheese patties soaked in sweetened, thickened milk.",
//                                 imageUrl: "https://www.cookwithmanali.com/wp-content/uploads/2014/07/Rasmalai-Recipe-500x500.jpg"
//                             },
//                             {
//                                 name: "JALEBI",
//                                 price: 90, 
//                                 description: "Deep-fried sweet spirals soaked in sugar syrup.",
//                                 imageUrl: "https://desicookbook.com/wp-content/uploads/2021/12/jalebi.jpg"
//                             },
//                             {
//                                 name: "FALOODA",
//                                 price: 150, 
//                                 description: "Cold dessert made with vermicelli, syrup, ice cream, and nuts.",
//                                 imageUrl: "https://www.cookwithkushi.com/wp-content/uploads/2019/06/best_falooda_ice_cream_Dessert_drink_Indian.jpg"
//                             },
                           
//                         ]
//                     },
//                     {
//                         name: "Breads",
//                         items: [
//                             {
//                                 name: "NAAN",
//                                 price: 50, 
//                                 description: "Traditional oven-baked flatbread.",
//                                 imageUrl: "https://www.budgetbytes.com/wp-content/uploads/2010/09/Homemade-Naan-stack-1.jpg"
//                             },
//                             {
//                                 name: "ROTI",
//                                 price: 30, 
//                                 description: "Whole wheat flatbread.",
//                                 imageUrl: "https://www.simplyrecipes.com/thmb/3QALSvYU7u6ErRz0mQf9LfpTx4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Roti-LEAD-1-f3256a549133427e9e0e79fb5ee3d2f8.jpg"
//                             },
//                             {
//                                 name: "ROGHANI NAAN",
//                                 price: 60, 
//                                 description: "Soft and fluffy leavened bread brushed with ghee.",
//                                 imageUrl: "https://img-global.cpcdn.com/recipes/a7d681ee171c2753/1200x630cq70/photo.jpg"
//                             },
//                             {
//                                 name: "GARLIC NAAN",
//                                 price: 50, 
//                                 description: "Naan bread flavored with garlic and herbs.",
//                                 imageUrl: "https://cafedelites.com/wp-content/uploads/2020/06/Garlic-Naan-Recipe-IMAGE-76.jpg"
//                             },
//                             {
//                                 name: "PESHAWARI NAAN",
//                                 price: 70, 
//                                 description: "Naan stuffed with sweet coconut, raisins, and nuts.",
//                                 imageUrl: "https://www.sprinklesandsprouts.com/wp-content/uploads/2020/05/Peshwari-Naan-3.jpg"
//                             },
//                             {
//                                 name: "PLAIN PARATHA",
//                                 price: 40, 
//                                 description: "Flaky and crispy layered flatbread.",
//                                 imageUrl: "https://rookiewithacookie.com/wp-content/uploads/2020/05/IMG_2570.jpg"
//                             },
//                             {
//                                 name: "ALOO PARATHA",
//                                 price: 50, 
//                                 description: "Paratha stuffed with spiced mashed potatoes.",
//                                 imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/aloo-paratha.jpg"
//                             },
//                         ]
//                     },
//                     {
//                         name: "Drinks",
//                         items: [
                           
//                             {
//                                 name: "MASALA CHAI",
//                                 price: 120, 
//                                 description: "Spiced tea brewed with aromatic spices and milk.",
//                                 imageUrl: "https://www.healthshots.com/wp-content/uploads/2020/09/masala-chai.jpg"
//                             },
//                             {
//                                 name: "ICED COFFEE",
//                                 price: 290, 
//                                 description: "Chilled coffee served with ice and optional milk and sugar.",
//                                 imageUrl: "https://frostingandfettuccine.com/wp-content/uploads/2022/12/Caramel-Iced-Coffee-6.jpg"
//                             },
//                             {
//                                 name: "LEMONADE",
//                                 price: 250, 
//                                 description: "Classic lemon-flavored refreshing drink.",
//                                 imageUrl: "https://natashaskitchen.com/wp-content/uploads/2023/07/Lemonade-Recipe-4.jpg"
//                             },
//                             {
//                                 name: "FRESH JUICES",
//                                 price: 270, 
//                                 description: "Assorted fresh fruit juices made with seasonal fruits.",
//                                 imageUrl: "https://insanelygoodrecipes.com/wp-content/uploads/2021/10/Delicious-Fruit-Juices-Orange-Kiwi-and-Strawberry.jpg"
//                             },
//                             {
//                                 name: "STRAWBERRY SMOOTHIE",
//                                 price: 290, 
//                                 description: "Creamy smoothie made with fresh strawberries and yogurt.",
//                                 imageUrl: "https://thestayathomechef.com/wp-content/uploads/2023/06/Strawberry-Smoothie-Recipe_Square-1.jpg"
//                             },
//                             {
//                                 name: "MOJITO",
//                                 price: 100, 
//                                 description: "Classic cocktail with mint, lime, sugar, soda water, and rum.",
//                                 imageUrl: "https://cdn.loveandlemons.com/wp-content/uploads/2020/07/mojito.jpg"
//                             },
//                             {
//                                 name: "VIRGIN PINA COLADA",
//                                 price: 180, 
//                                 description: "Non-alcoholic version of the tropical favorite with pineapple and coconut cream.",
//                                 imageUrl: "https://hips.hearstapps.com/hmg-prod/images/virgin-pin-a-colada-horizontal-1673390884.jpg?crop=0.9470370370370371xw:1xh;center,top&resize=1200:*"
//                             },
                           
                          
//                             {
//                                 name: "COCONUT WATER",
//                                 price: 100, 
//                                 description: "Natural hydrating drink straight from the coconut.",
//                                 imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2017/08/coconut-water-bb9cfe8.jpg?resize=768,574"
//                             },
//                         ]
//                     },
//                     {
//                         name: "Salads",
//                         items: [
//                             {
//                                 name: "CAESAR SALAD",
//                                 price: 320, 
//                                 description: "Fresh romaine lettuce, croutons, Parmesan cheese, and Caesar dressing.",
//                                 imageUrl: "https://natashaskitchen.com/wp-content/uploads/2019/01/Caesar-Salad-Recipe-3.jpg"
//                             },
//                             {
//                                 name: "GREEK SALAD",
//                                 price: 230, 
//                                 description: "Cucumbers, tomatoes, olives, feta cheese, and Greek dressing.",
//                                 imageUrl: "https://www.noracooks.com/wp-content/uploads/2022/06/vegan-caesar-salad-4.jpg"
//                             },
//                             {
//                                 name: "GREEK SALAD",
//                                 price: 400, 
//                                 description: "Classic Greek salad with tomatoes, cucumbers, olives, feta cheese, and vinaigrette.",
//                                 imageUrl: "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/08/Greek-Salad-main.jpg"
//                             },
//                             {
//                                 name: "CAESAR SALAD",
//                                 price: 390, 
//                                 description: "Traditional Caesar salad with romaine lettuce, croutons, parmesan cheese, and Caesar dressing.",
//                                 imageUrl: "https://example.com/caesar-salad.jpg"
//                             },
                           
//                             {
//                                 name: "SPINACH SALAD",
//                                 price: 295, 
//                                 description: "Healthy spinach salad with strawberries, almonds, feta cheese, and balsamic vinaigrette.",
//                                 imageUrl: "https://example.com/spinach-salad.jpg"
//                             },
//                             {
//                                 name: "COBB SALAD",
//                                 price: 410, 
//                                 description: "Cobb salad with grilled chicken, bacon, avocado, tomatoes, eggs, and blue cheese dressing.",
//                                 imageUrl: "https://example.com/cobb-salad.jpg"
//                             },
//                             {
//                                 name: "QUINOA SALAD",
//                                 price: 320, 
//                                 description: "Nutritious quinoa salad with mixed vegetables, chickpeas, and lemon herb dressing.",
//                                 imageUrl: "https://example.com/quinoa-salad.jpg"
//                             },
//                         ]
//                     },
//                     {
//                         name: "Soups",
//                         items: [
//                             {
//                                 name: "TOMATO SOUP",
//                                 price: 590, 
//                                 description: "Classic tomato soup garnished with fresh basil.",
//                                 imageUrl: "https://example.com/tomato-soup.jpg"
//                             },
//                             {
//                                 name: "CHICKEN CORN SOUP",
//                                 price: 600, 
//                                 description: "Hearty soup with chicken, corn, and flavorful broth.",
//                                 imageUrl: "https://example.com/chicken-corn-soup.jpg"
//                             },
//                             {
//                                 name: "TOMATO SOUP",
//                                 price: 370, 
//                                 description: "Classic tomato soup garnished with fresh basil and croutons.",
//                                 imageUrl: "https://example.com/tomato-soup.jpg"
//                             },
//                             {
//                                 name: "CHICKEN NOODLE SOUP",
//                                 price: 580, 
//                                 description: "Hearty chicken noodle soup with vegetables and tender chicken chunks.",
//                                 imageUrl: "https://example.com/chicken-noodle-soup.jpg"
//                             },
//                             {
//                                 name: "MUSHROOM SOUP",
//                                 price: 475, 
//                                 description: "Creamy mushroom soup with sautéed mushrooms and herbs.",
//                                 imageUrl: "https://example.com/mushroom-soup.jpg"
//                             },
//                             {
//                                 name: "SPICY LENTIL SOUP",
//                                 price: 385, 
//                                 description: "Flavorful lentil soup with spices, vegetables, and a touch of spice.",
//                                 imageUrl: "https://example.com/lentil-soup.jpg"
//                             },
//                             {
//                                 name: "THAI TOM YUM SOUP",
//                                 price: 290, 
//                                 description: "Spicy and tangy Thai soup with shrimp, mushrooms, and lemongrass.",
//                                 imageUrl: "https://example.com/tom-yum-soup.jpg"
//                             },
//                             {
//                                 name: "CORN CHOWDER",
//                                 price: 380, 
//                                 description: "Rich and creamy corn chowder with corn kernels and potatoes.",
//                                 imageUrl: "https://example.com/corn-chowder.jpg"
//                             },
//                         ]
//                     },
//                     {
//                         name: "Seafood",
//                         items: [
//                             {
//                                 name: "GRILLED FISH",
//                                 price: 1580, 
//                                 description: "Fresh fish marinated and grilled to perfection.",
//                                 imageUrl: "https://example.com/grilled-fish.jpg"
//                             },
//                             {
//                                 name: "SHRIMP SCAMPI",
//                                 price: 2200, 
//                                 description: "Tender shrimp sautéed in garlic and butter sauce.",
//                                 imageUrl: "https://example.com/shrimp-scampi.jpg"
//                             },
//                             {
//                                 name: "GRILLED SALMON",
//                                 price: 1350, 
//                                 description: "Tender grilled salmon fillet served with lemon butter sauce.",
//                                 imageUrl: "https://example.com/grilled-salmon.jpg"
//                             },
//                             {
//                                 name: "SHRIMP SCAMPI",
//                                 price: 1240, 
//                                 description: "Juicy shrimp sautéed in garlic, butter, and white wine, served over pasta.",
//                                 imageUrl: "https://example.com/shrimp-scampi.jpg"
//                             },
//                             {
//                                 name: "CRAB CAKES",
//                                 price: 1230, 
//                                 description: "Delicious crab cakes served with remoulade sauce and mixed greens.",
//                                 imageUrl: "https://example.com/crab-cakes.jpg"
//                             },
//                             {
//                                 name: "FISH TACOS",
//                                 price: 1220, 
//                                 description: "Crispy fish tacos with slaw, avocado, and chipotle mayo, served with fries.",
//                                 imageUrl: "https://example.com/fish-tacos.jpg"
//                             },
//                             {
//                                 name: "SEAFOOD PAELLA",
//                                 price: 1650, 
//                                 description: "Traditional Spanish paella with assorted seafood, rice, and aromatic spices.",
//                                 imageUrl: "https://example.com/seafood-paella.jpg"
//                             },
//                             {
//                                 name: "LOBSTER BISQUE",
//                                 price: 1110, 
//                                 description: "Creamy lobster soup with chunks of lobster meat and sherry.",
//                                 imageUrl: "https://example.com/lobster-bisque.jpg"
//                             },
//                         ]
//                     },
                   

                
            
        
        
        
        
//         ]
//     };

//     try {
//         // No need to check if categories is an array or if items is an array 
//         // because we're defining them as arrays above.
//         const result = await Menu.create(newMenuData);
//         console.log("Data successfully inserted:", result);
//       } catch (err) {
//         console.error("Error inserting data:", err);
//       }
//     })();


const restaurantLoginSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: Object, default: {} },
    resetCode: { type: String, default: null },
    resetCodeExpires: { type: Date, default: null },
    notifications: { type: Array, default: [] },
    expoPushTokens: [{ type: String }]
});

const RestaurantLogin = model('RestaurantLogin', restaurantLoginSchema);
  

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    dateCreated: { type: Date, default: Date.now }
});
const Review = model('Review', reviewSchema);

const userTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fcmToken: { type: String, required: true }
});

const UserToken = model('UserToken', userTokenSchema);



// const nearbyRestaurants = await Restaurant.find({
//     location: {
//         $near: {
//             $geometry: {
//                 type: 'Point',
//                 coordinates: [longitude, latitude]
//             },
//             $maxDistance: 5000  // 5km
//         }
//     }
// });



app.use(cors());
app.use(json());
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/saveExpoPushTokenFR', async (req, res) => {
    const { username, token } = req.body;

    try {
        // Assuming 'Restaurant' is your mongoose model for the restaurant schema
        const restaurant = await RestaurantLogin.findOne({ username: username });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Push the new token to the expoPushTokens array if it doesn't already exist
        if (restaurant.expoPushTokens.indexOf(token) === -1) {
            restaurant.expoPushTokens.push(token);
            console.log("token", token);
            await restaurant.save();
            res.status(200).json({ message: 'Token saved successfully' });
        } else {
            res.status(200).json({ message: 'Token already exists' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/saveExpoPushToken', async (req, res) => {
    const { username, token } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Push the new token to the expoPushTokens array if it doesn't already exist
        if (user.expoPushTokens.indexOf(token) === -1) {
            user.expoPushTokens.push(token);
            console.log("token",token);
            await user.save();
            res.status(200).json({ message: 'Token saved successfully' });
        } else {
            res.status(200).json({ message: 'Token already exists' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/order/add', async (req, res) => {
    try {
      const itemData = req.body; // Item details from the request
      const orderItem = new OrderItem(itemData);
      await orderItem.save();
      res.status(200).send('Item added to order');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding item to order');
    }
  });
  
  // update record
    app.put("/api/order/add/:id", async (req, res) => {
        let orderSchedule = await OrderItem.findById(req.params.id);

        orderSchedule.price = req.body.price; 
  
  
    await orderSchedule.save();
    return res.send(orderSchedule);
  });
  // GET endpoint to retrieve order items
  app.get('/api/order/items', async (req, res) => {
    try {
      const items = await OrderItem.find({});
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving order items');
    }
  });

app.post('/login', async (req, res) => {
    console.log("Received login request:", req.body);  // Debugging line

    let user;
    // If an email is provided in the request, find by email. Otherwise, find by username.
    if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
    } else if (req.body.username) {
        user = await User.findOne({ username: req.body.username });
    }

    console.log("User found:", user);  // Debugging line

    if (user && await compareSync(req.body.password, user.password)) {
        console.log("Password matched");  // Debugging line
        const token = jwt.sign({ id: user._id }, SECRET_KEY);
        if (req.body.expoPushToken) {
            user.expoPushTokens = req.body.expoPushTokens;
            await user.save();
        }
        return res.json({
            token, 
            profile: {
                username: user.username,
                email: user.email,
                id: user._id.toString(),  // Add the unique ID to the profile response
                ...user.profile  // Spread the existing profile properties (if any)
            }
        });
    }
    
    console.log("Invalid credentials");  // Debugging line
    res.status(400).send('Invalid credentials');
});


app.post('/getToken', async (req, res) => {
    const { username, password } = req.body;

    try {
        const restaurant = await RestaurantLogin.findOne({ username });
        
        if (!restaurant) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, restaurant.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: restaurant._id }, SECRET_KEY, { expiresIn: '1h' });  // Token expires in 1 hour

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/menus', async (req, res) => {
    const { category, section } = req.query;

    try {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (section && section !== 'All') {
        query.section = section;
      }

      const menus = await Menu.find(query); // Fetch menus based on the query

      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});


app.get('/search', async (req, res) => {
    try {
        console.log("Received query parameters:", req.query);
        let { name } = req.query;
        const filters = {};

        if (typeof name !== 'string' || !name) {
            return res.status(400).json({ error: 'Valid name parameter is required' });
        }

        filters.name = new RegExp(name, 'i');

        let restaurants = await Restaurant.find(filters);
        console.log("MongoDB query result:", restaurants);

        if (restaurants.length === 0) {
            const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.latitude},${req.query.longitude}&radius=5000&type=restaurant&key=${GOOGLE_API_KEY}`;
            const googlePlacesResponse = await axios.get(googlePlacesUrl);
            console.log("Google Places API response:", googlePlacesResponse.data);

            if (googlePlacesResponse && googlePlacesResponse.data && googlePlacesResponse.data.results) {
                restaurants = googlePlacesResponse.data.results.filter(place => place.name.toLowerCase().includes(name.toLowerCase()));
                restaurants = restaurants.map(place => ({
                    name: place.name,
                    address: place.vicinity,  // Assumes the 'vicinity' field from Google Places API
                    contactDetails: {
                        // Google Places API might not provide phone, email, website in the same call
                        phone: place.formatted_phone_number || '',
                        email: '',  // Not available from Google Places API
                        website: place.website || ''
                    },
                    openingHours: {
                        // Mapping might be complex as Google Places API and your schema might differ
                        // You can leave it empty or map it accordingly later
                    },
                    images: place.photos ? place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`) : [],
                    menus: [],  // Not available from Google Places API
                    location: {
                        type: 'Point',
                        coordinates: [place.geometry.location.lng, place.geometry.location.lat]
                    },
                    cuisine: '',  // Not available from Google Places API
                    price_level: place.price_level,
                    rating: place.rating,
                    dietaryOptions: []  // Not available from Google Places API
                }));
                
            }
        }

        console.log("Filters used:", filters);
        console.log("Found restaurants:", restaurants);

        res.json(restaurants);

    } catch (error) {
        console.error("An internal error occurred:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.post('/save-token', async (req, res) => {
    try {
        const { userId, fcmToken } = req.body;
        const userToken = new UserToken({ userId, fcmToken });
        await userToken.save();
        res.status(201).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/restaurant/:id', async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ error: 'Restaurant not found' });
    }
});

app.put('/update', async (req, res) => {
    console.log("Received PUT request for /update");

    if (!req.body || Object.keys(req.body).length === 0) {
        console.error("Update error: Empty request body");
        res.status(400).send({ error: "Invalid request body" });
        return;
    }

    const { userId, field, newValue } = req.body;
    console.log("Received userId:", userId);
    console.log("Updating field:", field, "with value:", newValue);
    try {
        const userExists = await User.findOne({ _id: userId }); // changed from userId to default _id
        if (!userExists) {
            console.error("Update error: User not found");
            res.status(404).send({ error: "User not found" });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { [field]: newValue }, { new: true }); // used findByIdAndUpdate

        if (!updatedUser) {
            console.error("Update error: Failed to update user");
            res.status(500).send({ error: "Failed to update user" });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({ error: "Failed to update profile" });
    }
});

app.get('/getExpoPushTokens', async (req, res) => {
    const { username } = req.query;
    try {
        // Replace 'User' with 'RestaurantLogin' if that's the intended model
        const restaurant = await RestaurantLogin.findOne({ username: new RegExp(`^${username}$`, 'i') });
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        // Assuming the restaurant document has an array of push tokens
        res.json({ expoPushTokens: restaurant.expoPushTokens });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.post('/restaurantLogin', async (req, res) => {
    console.log("Received restaurant login request:", req.body);  // Debugging line

    let restaurant;
    // If an email is provided in the request, find by email. Otherwise, find by username.
    if (req.body.email) {
        restaurant = await RestaurantLogin.findOne({ email: req.body.email });
    } else if (req.body.username) {
        restaurant = await RestaurantLogin.findOne({ username: new RegExp(`^${req.body.username}$`, 'i') });
    }

    console.log("Restaurant found:", restaurant);  // Debugging line

    if (restaurant && await compareSync(req.body.password, restaurant.password)) {
        console.log("Password matched");  // Debugging line
        const token = jwt.sign({ id: restaurant._id }, SECRET_KEY);
        if (req.body.expoPushTokens) {
            restaurant.expoPushTokens = req.body.expoPushTokens;
            await restaurant.save();
        }
        return res.json({
            token, 
            profile: {
                username: restaurant.username,
                email: restaurant.email,
                id: restaurant._id.toString(),
                ...restaurant.profile  // Spread the existing profile properties (if any)
            }
        });
    }
    
    console.log("Invalid credentials");  // Debugging line
    res.status(400).send('Invalid credentials');
});


app.post('/registerRestaurant', async (req, res) => {
    try {
        // Check if restaurant already exists based on restaurantId, email, or username
        let restaurant = await RestaurantLogin.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (restaurant) {
            return res.status(400).json({ msg: 'Restaurant already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

         // Ensure the push tokens are stored as an array
         const expoPushTokens = Array.isArray(req.body.expoPushTokens) ? req.body.expoPushTokens : [req.body.expoPushTokens];

        // Create a new restaurant login entry
        restaurant = new RestaurantLogin({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            expoPushTokens: expoPushTokens, 
        });

        await restaurant.save();

        res.json({ msg: 'Restaurant registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



app.post('/register', async (req, res) => {
    try {
        // Check if user already exists based on email or username
        let user = await User.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //const expoPushTokens = Array.isArray(req.body.expoPushTokens) ? req.body.expoPushTokens : [req.body.expoPushTokens];

        // Create a new user
        user = new User({
            username: req.body.username,
            email: req.body.email,  // Add this line
            password: hashedPassword,
           
            // ... other fields
        });

        await user.save();

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});







app.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let resetCode;  // Declare it here so it's accessible throughout the function

    try {
        const user = await User.findOne({ email: email.trim() });
        console.log("Found user:", user);

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        resetCode = Math.floor(Math.random() * 9000) + 1000;  // 4-digit code
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 3600000;  // Code expires in 1 hour
        user.email = email.trim();
        await user.save();
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: 'Database error' });
    }

    let resetCodeText = `Your OTP code is: ${resetCode}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'foodieshub53@gmail.com',
            pass: 'vfgd lxmu dnpi hwuf'
        }
    });

    const mailOptions = {
        from: 'foodieshub53@gmail.com',
        to: email,
        subject: 'Resend OTP Code',
        text: resetCodeText
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        } else {
            console.log(`OTP resent to ${email}:`, info.response);
            return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
        }
    });
});

  

app.post('/reset-password', async (req, res) => {
    console.log("Received email for reset:", req.body.email);
    const { email } = req.body;

    let resetCode; // Declare it here so it's accessible throughout the function

    // Fetch all users for debugging
    try {
        const users = await User.find({});
        console.log("All users:", users);
    } catch (error) {
        console.error("Error fetching all users:", error);
    }

    try {
        const user = await User.findOne({ email: email.trim() });
        console.log("Found user:", user);

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        resetCode = Math.floor(Math.random() * 9000) + 1000; // 4-digit code
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 3600000; // Code expires in 1 hour
        user.email = email.trim();
        await user.save();
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: 'Database error' });
    }

    let resetCodeText = `Your password reset code is: ${resetCode}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'foodieshub53@gmail.com',
            pass: 'vfgd lxmu dnpi hwuf'
        }
    });

    const mailOptions = {
        from: 'foodieshub53@gmail.com',
        to: email,
        subject: 'Password Reset Code',
        text: resetCodeText
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        } else {
            console.log(`Email sent to ${email}:`, info.response);
            return res.status(200).json({ success: true, message: 'Email sent' });
        }
    });
});

  app.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (Date.now() > user.resetCodeExpires) {
        return res.status(400).json({ success: false, message: 'Reset code has expired' });
    }

    if (user.resetCode !== code) {
        return res.status(400).json({ success: false, message: 'Invalid reset code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
});

  
app.post('/set-new-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null; // Clear the reset code
    user.resetCodeExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
});


export default router;

app.get('/checkUser/:username', async (req, res) => {
    try {
        console.log('Received request to check user'); // Debugging line
        const username = req.params.username;
        const user = await User.findOne({ username });
        res.json({ exists: !!user });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a review
app.post('/review', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a review
app.put('/review/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
        if (updatedReview) {
            res.json(updatedReview);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a review
app.delete('/review/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (review) {
            res.json({ message: 'Review deleted' });
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/send-notification', async (req, res) => {
    const { title, body, data, recipientEmail } = req.body;
    console.log(req.body);

    try {
        const restaurant = await RestaurantLogin.findOne({ email: recipientEmail });

        if (!restaurant || !restaurant.expoPushTokens || restaurant.expoPushTokens.length === 0) {
            return res.status(404).json({ success: false, message: 'No tokens for restaurant.' });
        }

        // Construct messages for each token
        let messages = restaurant.expoPushTokens.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            data
        }));

        // Batch send the notifications and collect any tickets
        let tickets = [];
        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If there are any receipt IDs in `ticketChunk`, you need to later check for the receipt.
                // Receipts may contain information about failed notifications (e.g., invalid push tokens).
            } catch (error) {
                console.error(error);
            }
        }

        // Here we're assuming restaurant has a notifications field to store sent notifications
        if (!restaurant.notifications) {
            restaurant.notifications = [];
        }
        
        // Push the new notification to the restaurant's array
        restaurant.notifications.push({
            title,
            body,
            data,
            timestamp: new Date()
        });
        
        // Save the updated restaurant document
        await restaurant.save();

        res.status(200).json({ success: true, message: 'Notifications sent successfully!' });
    } catch (error) {
        console.error("Error sending notifications: ", error);
        res.status(500).json({ success: false, message: 'Server error. Could not send notifications.' });
    }
});


app.get('/fetch-notifications', async (req, res) => {
    const userEmail = req.headers['user-email'];

    try {
        const user = await RestaurantLogin.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, notifications: user.notifications });

    } catch (error) {
        console.error("Error fetching notifications: ", error);
        res.status(500).json({ success: false, message: 'Server error. Could not fetch notifications.' });
    }
});



app.get('/get-restaurant-data/:placeId', async (req, res) => {
    const placeId = req.params.placeId;

    try {
        const response = await get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`);
        
        if (response.data.result) {
            res.json(response.data.result);
        } else {
            res.status(400).send("Failed to fetch restaurant data");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});


 connect(config.db,{useNewUrlParser:true, useUnifiedTopology:true})
 .then(()=>{ console.log("connected to db")})
 .catch((error)=>{console.log(error.message)});

// connect('mongodb://localhost:27017/userAuth', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });



app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
