// Carbon emission factors based on EPA/DEFRA data (kg CO₂e per unit)
export const EMISSION_FACTORS = {
  transport: {
    car_petrol: { factor: 0.21, unit: 'km', label: 'Car (Petrol)' },
    car_diesel: { factor: 0.27, unit: 'km', label: 'Car (Diesel)' },
    car_electric: { factor: 0.05, unit: 'km', label: 'Electric Car' },
    motorcycle: { factor: 0.11, unit: 'km', label: 'Motorcycle' },
    bus: { factor: 0.089, unit: 'km', label: 'Bus' },
    train: { factor: 0.041, unit: 'km', label: 'Train/Metro' },
    bicycle: { factor: 0, unit: 'km', label: 'Bicycle' },
    walking: { factor: 0, unit: 'km', label: 'Walking' },
    flight_domestic: { factor: 0.255, unit: 'km', label: 'Flight (Domestic)' },
    flight_international: { factor: 0.195, unit: 'km', label: 'Flight (International)' },
  },
  electricity: {
    grid_average: { factor: 0.82, unit: 'kWh', label: 'Grid Electricity' },
    solar: { factor: 0.05, unit: 'kWh', label: 'Solar Power' },
    wind: { factor: 0.01, unit: 'kWh', label: 'Wind Power' },
  },
  water: {
    usage: { factor: 0.344, unit: 'kL', label: 'Water Usage' },
  },
  food: {
    beef: { factor: 27.0, unit: 'kg', label: 'Beef' },
    lamb: { factor: 25.0, unit: 'kg', label: 'Lamb' },
    pork: { factor: 12.0, unit: 'kg', label: 'Pork' },
    chicken: { factor: 6.9, unit: 'kg', label: 'Chicken' },
    fish: { factor: 5.4, unit: 'kg', label: 'Fish' },
    dairy: { factor: 3.2, unit: 'kg', label: 'Dairy Products' },
    vegetables: { factor: 2.0, unit: 'kg', label: 'Vegetables' },
    fruits: { factor: 1.1, unit: 'kg', label: 'Fruits' },
    grains: { factor: 1.4, unit: 'kg', label: 'Grains/Rice' },
    vegan_meal: { factor: 0.7, unit: 'meal', label: 'Vegan Meal' },
    vegetarian_meal: { factor: 1.7, unit: 'meal', label: 'Vegetarian Meal' },
    non_veg_meal: { factor: 3.5, unit: 'meal', label: 'Non-Veg Meal' },
  },
  shopping: {
    clothing: { factor: 15.0, unit: 'item', label: 'New Clothing' },
    electronics: { factor: 50.0, unit: 'item', label: 'Electronics' },
    furniture: { factor: 30.0, unit: 'item', label: 'Furniture' },
    second_hand: { factor: 0.5, unit: 'item', label: 'Second-hand Item' },
  },
  waste: {
    landfill: { factor: 0.58, unit: 'kg', label: 'Landfill Waste' },
    recycled: { factor: 0.02, unit: 'kg', label: 'Recycled Waste' },
    composted: { factor: 0.01, unit: 'kg', label: 'Composted Waste' },
  },
};

// Calculate emissions for a single activity
export function calculateEmission(category, type, amount) {
  const factor = EMISSION_FACTORS[category]?.[type];
  if (!factor) return 0;
  return Math.round(amount * factor.factor * 100) / 100;
}

// Calculate total from a footprint entry
export function calculateTotalFootprint(entry) {
  let total = 0;
  for (const category of Object.keys(entry)) {
    if (category === 'date' || category === 'id') continue;
    const categoryData = entry[category];
    if (typeof categoryData === 'object') {
      for (const [type, amount] of Object.entries(categoryData)) {
        total += calculateEmission(category, type, amount);
      }
    }
  }
  return Math.round(total * 100) / 100;
}

// Get category breakdown
export function getCategoryBreakdown(entry) {
  const breakdown = {};
  for (const category of Object.keys(EMISSION_FACTORS)) {
    let categoryTotal = 0;
    const categoryData = entry[category];
    if (categoryData && typeof categoryData === 'object') {
      for (const [type, amount] of Object.entries(categoryData)) {
        categoryTotal += calculateEmission(category, type, amount);
      }
    }
    breakdown[category] = Math.round(categoryTotal * 100) / 100;
  }
  return breakdown;
}

// Average footprint reference data (kg CO₂/day)
export const BENCHMARKS = {
  world_average: 13.2,
  india_average: 5.2,
  us_average: 44.0,
  eu_average: 18.5,
  target_2030: 6.0,
  excellent: 3.0,
};

// Category colors for charts
export const CATEGORY_COLORS = {
  transport: '#f59e0b',
  electricity: '#3b82f6',
  water: '#06b6d4',
  food: '#ef4444',
  shopping: '#8b5cf6',
  waste: '#64748b',
};

export const CATEGORY_LABELS = {
  transport: 'Transport',
  electricity: 'Electricity',
  water: 'Water',
  food: 'Food & Diet',
  shopping: 'Shopping',
  waste: 'Waste',
};
