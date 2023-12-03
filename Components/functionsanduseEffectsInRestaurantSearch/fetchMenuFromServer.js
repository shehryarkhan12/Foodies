import { API_IP_ADDRESS } from "../../api/config";
import axios from "axios";
export const fetchMenuFromServer = async (menuCategory, menuSection = 'All') => {
    try {
      // Include the section in the query string if it is not 'All'
      const sectionQuery = menuSection !== 'All' ? `&section=${menuSection}` : '';
      const response = await axios.get(`http://${API_IP_ADDRESS}/menus?category=${menuCategory}${sectionQuery}`);
      if (response.data) {
        return response.data;
      } else {
        console.warn('No menu data found for the category and section');
        return null;
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      return null;
    }
};