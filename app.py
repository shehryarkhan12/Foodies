from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import pytesseract
from PIL import Image, ImageFilter, ImageEnhance
from io import BytesIO
import googlemaps
import urllib.parse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


app = Flask(__name__)

# Initialize Google Maps client with your API key
gmaps = googlemaps.Client(key='AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U')

def get_restaurant_website(place_id):
    # Fetch place details using Google Places API
    place_details = gmaps.place(place_id=place_id)
    return place_details.get('result', {}).get('website', None)

# List of potential CSS selectors for menu buttons
potential_selectors = [
    "button.menu", "button.menu-button", "a.menu", "nav > ul > li > a","//nav//ul//li//a",
    "nav[role='navigation'] a", "div.menu a", ".navbar a", ".nav-menu a",
    "header nav a", "header a[href*='menu']", "a[href*='menu']","//button[contains(text(), 'See MENU & Order')]",
        "//a[contains(text(), 'See MENU & Order')]",
]


def try_click_menu_button(driver):
    for selector in potential_selectors:
        try:
            # First, try finding the element by CSS selector
            if selector.startswith((".", "#")):  # Assume it's a CSS selector
                menu_element = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                )
            else:  # Assume it's an XPath
                menu_element = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//nav//ul//li//a"))
                )
            menu_element.click()
            print(f"Clicked menu using selector: {selector}")
            return True
        except TimeoutException:
            continue
    return False

def scrape_menu_images_with_selenium(website_url):
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    driver = webdriver.Chrome(options=options)

    driver.get(website_url)

    if not try_click_menu_button(driver):
        print("Could not find a menu button/link with the defined heuristics.")
        # You might choose to return here or attempt other scraping methods

    try:
        # Wait for the page to load the menu images
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "img"))
        )

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        image_tags = soup.find_all('img')

        menu_images = [urllib.parse.urljoin(website_url, img['src']) for img in image_tags]

        for img_url in menu_images:
            print(f"Image URL: {img_url}")
    except TimeoutException:
        print("Timeout while waiting for page elements")
        menu_images = []
    finally:
        driver.quit()

    return menu_images

def preprocess_image(image_url):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))

    # Convert to grayscale
    img = img.convert('L')

    # Enhance the image to make it more readable for Tesseract
    img = img.filter(ImageFilter.SHARPEN)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2)

    # Binarize the image using a threshold
    threshold = 200
    img = img.point(lambda p: p > threshold and 255)

    # Save the processed image locally if you want to inspect it
    # img.save('/path/to/save/preprocessed_image.png')

    return img

def extract_text_from_image_url(image_url):
    img = preprocess_image(image_url)

    # Tesseract configuration - using the default English language
    # You can add more configurations as needed
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(img, config=custom_config)

    return text


@app.route('/get-menu', methods=['POST'])
def get_menu():
    data = request.json
    place_id = data.get("place_id")

    if not place_id:
        return jsonify({"error": "Place ID is required"}), 400

    try:
        website_url = get_restaurant_website(place_id)
        if not website_url:
            return jsonify({"error": "Website URL not found"}), 404

        menu_images = scrape_menu_images_with_selenium(website_url)
        menus = [extract_text_from_image_url(url) for url in menu_images]
        return jsonify({"menus": menus})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
