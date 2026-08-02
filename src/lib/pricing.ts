export function getPricingForCountry(countryCode: string | null) {
  if (countryCode === 'IN') {
    return {
      price: "₹99",
      interval: "month"
    };
  }
  return {
    price: "$5 USD",
    interval: "month"
  };
}
