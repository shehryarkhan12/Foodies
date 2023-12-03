export const mapPriceLevelToText = (priceLevel) => {
    switch (priceLevel) {
      case 0:
        return 'Free';
      case 1:
        return '100 - 500 PKR per person';
      case 2:
        return '500 - 1500 PKR';
      case 3:
        return '1500 - 3000 PKR';
      case 4:
        return '3000 PKR and above per person';
      default:
        return '100 - 500 PKR per person';
    }
  };