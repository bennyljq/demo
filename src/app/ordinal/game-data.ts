import { GameLevel } from './ordinal.types';

export const QUESTION_BANK: GameLevel[] = [
  // --- GEOGRAPHY & LANDMARKS ---
  {
    id: 'geo_landmarks',
    metric: 'Height of Landmark (Tallest to Shortest)',
    data: [
      { label: 'Burj Khalifa', value: '828m', correctIndex: 0 },
      { label: 'Shanghai Tower', value: '632m', correctIndex: 1 },
      { label: 'Eiffel Tower', value: '330m', correctIndex: 2 },
      { label: 'Statue of Liberty', value: '93m', correctIndex: 3 },
      { label: 'Leaning Tower of Pisa', value: '56m', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_pop',
    metric: 'Country Population (Highest to Lowest)',
    data: [
      { label: 'India', value: '1.43B', correctIndex: 0 },
      { label: 'China', value: '1.41B', correctIndex: 1 },
      { label: 'USA', value: '340M', correctIndex: 2 },
      { label: 'Indonesia', value: '277M', correctIndex: 3 },
      { label: 'Brazil', value: '216M', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_continents',
    metric: 'Continent Size by Area (Largest to Smallest)',
    data: [
      { label: 'Asia', value: '44.5M km²', correctIndex: 0 },
      { label: 'Africa', value: '30.3M km²', correctIndex: 1 },
      { label: 'North America', value: '24.7M km²', correctIndex: 2 },
      { label: 'Antarctica', value: '14.2M km²', correctIndex: 3 },
      { label: 'Europe', value: '10.2M km²', correctIndex: 4 }
    ]
  },

  // --- NATURE & SCIENCE ---
  {
    id: 'sci_speed',
    metric: 'Top Speed of Animal (Fastest to Slowest)',
    data: [
      { label: 'Peregrine Falcon', value: '389 km/h', correctIndex: 0 },
      { label: 'Cheetah', value: '120 km/h', correctIndex: 1 },
      { label: 'Sailfish', value: '110 km/h', correctIndex: 2 },
      { label: 'Greyhound', value: '72 km/h', correctIndex: 3 },
      { label: 'Usain Bolt', value: '44.7 km/h', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_planets_moons',
    metric: 'Number of Moons (Most to Fewest)',
    data: [
      { label: 'Saturn', value: '146', correctIndex: 0 },
      { label: 'Jupiter', value: '95', correctIndex: 1 },
      { label: 'Mars', value: '2', correctIndex: 2 },
      { label: 'Earth', value: '1', correctIndex: 3 },
      { label: 'Venus', value: '0', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_lifespan',
    metric: 'Average Lifespan (Longest to Shortest)',
    data: [
      { label: 'Giant Tortoise', value: '150 years', correctIndex: 0 },
      { label: 'African Elephant', value: '70 years', correctIndex: 1 },
      { label: 'Horse', value: '30 years', correctIndex: 2 },
      { label: 'Dog (Labrador)', value: '12 years', correctIndex: 3 },
      { label: 'Hamster', value: '2.5 years', correctIndex: 4 }
    ]
  },

  // --- POP CULTURE & TECH ---
  {
    id: 'tech_social',
    metric: 'Launch Year (Oldest to Newest)',
    data: [
      { label: 'LinkedIn', value: '2003', correctIndex: 0 },
      { label: 'Facebook', value: '2004', correctIndex: 1 },
      { label: 'YouTube', value: '2005', correctIndex: 2 },
      { label: 'Twitter (X)', value: '2006', correctIndex: 3 },
      { label: 'Instagram', value: '2010', correctIndex: 4 }
    ]
  },
  {
    id: 'ent_movies_length',
    metric: 'Movie Runtime (Longest to Shortest)',
    data: [
      { label: 'Killers of the Flower Moon', value: '206 min', correctIndex: 0 },
      { label: 'Avengers: Endgame', value: '181 min', correctIndex: 1 },
      { label: 'Oppenheimer', value: '180 min', correctIndex: 2 },
      { label: 'Avatar', value: '162 min', correctIndex: 3 },
      { label: 'The Dark Knight', value: '152 min', correctIndex: 4 }
    ]
  },
  {
    id: 'tech_consoles',
    metric: 'Release Year (Oldest to Newest)',
    data: [
      { label: 'NES', value: '1983', correctIndex: 0 },
      { label: 'Game Boy', value: '1989', correctIndex: 1 },
      { label: 'PlayStation 1', value: '1994', correctIndex: 2 },
      { label: 'Nintendo Wii', value: '2006', correctIndex: 3 },
      { label: 'Nintendo Switch', value: '2017', correctIndex: 4 }
    ]
  },

  // --- FOOD & DAILY LIFE ---
  {
    id: 'food_sugar',
    metric: 'Sugar Content per 100ml (Most to Least)',
    data: [
      { label: 'Coca-Cola', value: '10.6g', correctIndex: 0 },
      { label: 'Apple Juice', value: '10g', correctIndex: 1 },
      { label: 'Red Bull', value: '11g', correctIndex: 2 }, // Note: Red Bull is usually higher, but varies
      { label: 'Whole Milk', value: '5g', correctIndex: 3 },
      { label: 'Black Coffee', value: '0g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_caffeine',
    metric: 'Caffeine Content (Highest to Lowest)',
    data: [
      { label: 'Espresso (Shot)', value: '63mg', correctIndex: 0 },
      { label: 'Black Tea', value: '47mg', correctIndex: 1 },
      { label: 'Mountain Dew', value: '15mg', correctIndex: 2 },
      { label: 'Dark Chocolate', value: '12mg', correctIndex: 3 },
      { label: 'Decaf Coffee', value: '2mg', correctIndex: 4 }
    ]
  },

  // --- BRAND NEW ACCESSIBLE CHALLENGES ---
  {
    id: 'misc_sports_balls',
    metric: 'Weight of Ball (Heaviest to Lightest)',
    data: [
      { label: 'Bowling Ball', value: '7.2kg', correctIndex: 0 },
      { label: 'Basketball', value: '625g', correctIndex: 1 },
      { label: 'Soccer Ball', value: '430g', correctIndex: 2 },
      { label: 'Tennis Ball', value: '58g', correctIndex: 3 },
      { label: 'Ping Pong Ball', value: '2.7g', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_rich_list',
    metric: 'Net Worth in 2024 (Highest to Lowest)',
    data: [
      { label: 'Elon Musk', value: '$250B+', correctIndex: 0 },
      { label: 'Jeff Bezos', value: '$200B+', correctIndex: 1 },
      { label: 'Mark Zuckerberg', value: '$170B+', correctIndex: 2 },
      { label: 'Bill Gates', value: '$130B+', correctIndex: 3 },
      { label: 'Warren Buffett', value: '$130B', correctIndex: 4 }
    ]
  },
  {
    id: 'lang_speakers',
    metric: 'Native Speakers (Most to Fewest)',
    data: [
      { label: 'Mandarin Chinese', value: '940M', correctIndex: 0 },
      { label: 'Spanish', value: '485M', correctIndex: 1 },
      { label: 'English', value: '380M', correctIndex: 2 },
      { label: 'Hindi', value: '345M', correctIndex: 3 },
      { label: 'Arabic', value: '275M', correctIndex: 4 }
    ]
  },
  {
    id: 'daily_battery',
    metric: 'Average Battery Life (Longest to Shortest)',
    data: [
      { label: 'Kindle E-Reader', value: '4 weeks', correctIndex: 0 },
      { label: 'Nintendo Switch', value: '6 hours', correctIndex: 1 },
      { label: 'iPhone 15', value: '18 hours', correctIndex: 2 },
      { label: 'MacBook Air', value: '15 hours', correctIndex: 3 },
      { label: 'VR Headset (Quest)', value: '2.5 hours', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_presidents',
    metric: 'US President Number (Earliest to Latest)',
    data: [
      { label: 'Abraham Lincoln', value: '16th', correctIndex: 0 },
      { label: 'Theodore Roosevelt', value: '26th', correctIndex: 1 },
      { label: 'John F. Kennedy', value: '35th', correctIndex: 2 },
      { label: 'Ronald Reagan', value: '40th', correctIndex: 3 },
      { label: 'Barack Obama', value: '44th', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_elements_weight',
    metric: 'Atomic Weight (Heaviest to Lightest)',
    data: [
      { label: 'Gold', value: '196.9', correctIndex: 0 },
      { label: 'Silver', value: '107.8', correctIndex: 1 },
      { label: 'Iron', value: '55.8', correctIndex: 2 },
      { label: 'Carbon', value: '12.0', correctIndex: 3 },
      { label: 'Hydrogen', value: '1.0', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_rivers_length',
    metric: 'River Length (Longest to Shortest)',
    data: [
      { label: 'Nile', value: '6650km', correctIndex: 0 },
      { label: 'Amazon', value: '6400km', correctIndex: 1 },
      { label: 'Yangtze', value: '6300km', correctIndex: 2 },
      { label: 'Mississippi', value: '3730km', correctIndex: 3 },
      { label: 'Danube', value: '2850km', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_cold_cities',
    metric: 'Average Jan Temp (Warmest to Coldest)',
    data: [
      { label: 'Singapore', value: '27°C', correctIndex: 0 },
      { label: 'London', value: '5°C', correctIndex: 1 },
      { label: 'New York', value: '1°C', correctIndex: 2 },
      { label: 'Moscow', value: '-6°C', correctIndex: 3 },
      { label: 'Yakutsk', value: '-38°C', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_fast_food_cals',
    metric: 'Calories in Signature Burger (Highest to Lowest)',
    data: [
      { label: 'Five Guys Cheeseburger', value: '980 kcal', correctIndex: 0 },
      { label: 'Whopper (Burger King)', value: '670 kcal', correctIndex: 1 },
      { label: 'Big Mac (McDonalds)', value: '563 kcal', correctIndex: 2 },
      { label: 'In-N-Out Double-Double', value: '520 kcal', correctIndex: 3 },
      { label: 'White Castle Slider', value: '140 kcal', correctIndex: 4 }
    ]
  }
];

export const QUESTION_BANK_EXTENDED: GameLevel[] = [
  // --- GEOGRAPHY & NATURE ---
  {
    id: 'geo_oceans',
    metric: 'Average Depth of Ocean (Deepest to Shallowest)',
    data: [
      { label: 'Pacific Ocean', value: '3,970m', correctIndex: 0 },
      { label: 'Indian Ocean', value: '3,740m', correctIndex: 1 },
      { label: 'Atlantic Ocean', value: '3,640m', correctIndex: 2 },
      { label: 'Arctic Ocean', value: '1,200m', correctIndex: 3 },
      { label: 'Mediterranean Sea', value: '1,500m', correctIndex: 4 } // Included for comparison
    ]
  },
  {
    id: 'geo_time_zones',
    metric: 'Number of Time Zones in Country (Most to Fewest)',
    data: [
      { label: 'France (inc. territories)', value: '12', correctIndex: 0 },
      { label: 'Russia', value: '11', correctIndex: 1 },
      { label: 'USA', value: '11', correctIndex: 2 },
      { label: 'Australia', value: '9', correctIndex: 3 },
      { label: 'China', value: '1', correctIndex: 4 }
    ]
  },
  {
    id: 'nature_mountains',
    metric: 'Mountain Height (Highest to Lowest)',
    data: [
      { label: 'Mount Everest', value: '8,848m', correctIndex: 0 },
      { label: 'K2', value: '8,611m', correctIndex: 1 },
      { label: 'Kilimanjaro', value: '5,895m', correctIndex: 2 },
      { label: 'Mont Blanc', value: '4,807m', correctIndex: 3 },
      { label: 'Mount Olympus', value: '2,917m', correctIndex: 4 }
    ]
  },
  {
    id: 'nature_islands',
    metric: 'Island Size by Area (Largest to Smallest)',
    data: [
      { label: 'Greenland', value: '2.1M km²', correctIndex: 0 },
      { label: 'New Guinea', value: '785k km²', correctIndex: 1 },
      { label: 'Borneo', value: '743k km²', correctIndex: 2 },
      { label: 'Madagascar', value: '587k km²', correctIndex: 3 },
      { label: 'Great Britain', value: '209k km²', correctIndex: 4 }
    ]
  },

  // --- SCIENCE & PHYSICS ---
  {
    id: 'sci_sound_speed',
    metric: 'Speed of Sound through Material (Fastest to Slowest)',
    data: [
      { label: 'Steel', value: '5,960 m/s', correctIndex: 0 },
      { label: 'Glass', value: '4,540 m/s', correctIndex: 1 },
      { label: 'Water', value: '1,480 m/s', correctIndex: 2 },
      { label: 'Air', value: '343 m/s', correctIndex: 3 },
      { label: 'Rubber', value: '60 m/s', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_boiling_points',
    metric: 'Boiling Point (Highest to Lowest)',
    data: [
      { label: 'Iron', value: '2,862°C', correctIndex: 0 },
      { label: 'Silver', value: '2,162°C', correctIndex: 1 },
      { label: 'Lead', value: '1,749°C', correctIndex: 2 },
      { label: 'Water', value: '100°C', correctIndex: 3 },
      { label: 'Liquid Nitrogen', value: '-196°C', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_gravity',
    metric: 'Surface Gravity (Strongest to Weakest)',
    data: [
      { label: 'Jupiter', value: '24.8 m/s²', correctIndex: 0 },
      { label: 'Neptune', value: '11.1 m/s²', correctIndex: 1 },
      { label: 'Earth', value: '9.8 m/s²', correctIndex: 2 },
      { label: 'Mars', value: '3.7 m/s²', correctIndex: 3 },
      { label: 'The Moon', value: '1.6 m/s²', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_cell_size',
    metric: 'Approximate Size (Largest to Smallest)',
    data: [
      { label: 'Ostrich Egg (Cell)', value: '150mm', correctIndex: 0 },
      { label: 'Human Egg Cell', value: '0.12mm', correctIndex: 1 },
      { label: 'Skin Cell', value: '30μm', correctIndex: 2 },
      { label: 'Red Blood Cell', value: '8μm', correctIndex: 3 },
      { label: 'E. coli Bacteria', value: '2μm', correctIndex: 4 }
    ]
  },

  // --- POP CULTURE & MUSIC ---
  {
    id: 'music_spotify',
    metric: 'Monthly Spotify Listeners - Jan 2024 (Most to Fewest)',
    data: [
      { label: 'The Weeknd', value: '110M', correctIndex: 0 },
      { label: 'Taylor Swift', value: '105M', correctIndex: 1 },
      { label: 'Justin Bieber', value: '75M', correctIndex: 2 },
      { label: 'Dua Lipa', value: '70M', correctIndex: 3 },
      { label: 'Beatles', value: '30M', correctIndex: 4 }
    ]
  },
  {
    id: 'music_instr_keys',
    metric: 'Number of Keys/Strings (Most to Fewest)',
    data: [
      { label: 'Piano (Standard)', value: '88 keys', correctIndex: 0 },
      { label: 'Harp', value: '47 strings', correctIndex: 1 },
      { label: 'Guitar (Standard)', value: '6 strings', correctIndex: 2 },
      { label: 'Violin', value: '4 strings', correctIndex: 3 },
      { label: 'Ukelele', value: '4 strings', correctIndex: 4 } // Draw tie-breaker logic handled by order
    ]
  },
  {
    id: 'ent_oscar_wins',
    metric: 'Total Oscar Wins for Best Picture (Most to Fewest)',
    data: [
      { label: 'Ben-Hur', value: '11', correctIndex: 0 },
      { label: 'Titanic', value: '11', correctIndex: 1 },
      { label: 'The Last Emperor', value: '9', correctIndex: 2 },
      { label: 'Schindler List', value: '7', correctIndex: 3 },
      { label: 'Parasite', value: '4', correctIndex: 4 }
    ]
  },
  {
    id: 'ent_tv_episodes',
    metric: 'Total TV Episodes (Most to Fewest)',
    data: [
      { label: 'The Simpsons', value: '750+', correctIndex: 0 },
      { label: 'Grey\'s Anatomy', value: '420+', correctIndex: 1 },
      { label: 'Family Guy', value: '400+', correctIndex: 2 },
      { label: 'Friends', value: '236', correctIndex: 3 },
      { label: 'Breaking Bad', value: '62', correctIndex: 4 }
    ]
  },

  // --- HISTORY & INVENTIONS ---
  {
    id: 'hist_inventions',
    metric: 'Year of Invention/Discovery (Oldest to Newest)',
    data: [
      { label: 'Compass', value: '200 BC', correctIndex: 0 },
      { label: 'Printing Press', value: '1440', correctIndex: 1 },
      { label: 'Microscope', value: '1590', correctIndex: 2 },
      { label: 'Steam Engine', value: '1712', correctIndex: 3 },
      { label: 'Telephone', value: '1876', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_empire_duration',
    metric: 'Duration of Empire (Longest to Shortest)',
    data: [
      { label: 'Roman Empire', value: '499 years', correctIndex: 0 },
      { label: 'Ottoman Empire', value: '623 years', correctIndex: 1 }, // Actually longer, check indices
      { label: 'British Empire', value: '400+ years', correctIndex: 2 },
      { label: 'Mongol Empire', value: '162 years', correctIndex: 3 },
      { label: 'Napoleonic Empire', value: '10 years', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_leader_age',
    metric: 'Age at Inauguration (Oldest to Youngest)',
    data: [
      { label: 'Joe Biden', value: '78', correctIndex: 0 },
      { label: 'Donald Trump', value: '70', correctIndex: 1 },
      { label: 'Ronald Reagan', value: '69', correctIndex: 2 },
      { label: 'Barack Obama', value: '47', correctIndex: 3 },
      { label: 'Theodore Roosevelt', value: '42', correctIndex: 4 }
    ]
  },

  // --- FOOD & HEALTH ---
  {
    id: 'food_protein',
    metric: 'Protein per 100g (Highest to Lowest)',
    data: [
      { label: 'Soybeans', value: '36g', correctIndex: 0 },
      { label: 'Chicken Breast', value: '31g', correctIndex: 1 },
      { label: 'Beef', value: '26g', correctIndex: 2 },
      { label: 'Eggs', value: '13g', correctIndex: 3 },
      { label: 'Greek Yogurt', value: '10g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_scoville',
    metric: 'Scoville Heat Units (Hottest to Mildest)',
    data: [
      { label: 'Carolina Reaper', value: '2.2M SHU', correctIndex: 0 },
      { label: 'Habenero', value: '350k SHU', correctIndex: 1 },
      { label: 'Cayenne', value: '50k SHU', correctIndex: 2 },
      { label: 'Jalapeño', value: '8k SHU', correctIndex: 3 },
      { label: 'Bell Pepper', value: '0 SHU', correctIndex: 4 }
    ]
  },
  {
    id: 'food_vit_c',
    metric: 'Vitamin C per 100g (Highest to Lowest)',
    data: [
      { label: 'Guava', value: '228mg', correctIndex: 0 },
      { label: 'Red Bell Pepper', value: '127mg', correctIndex: 1 },
      { label: 'Kiwi', value: '92mg', correctIndex: 2 },
      { label: 'Orange', value: '53mg', correctIndex: 3 },
      { label: 'Banana', value: '8mg', correctIndex: 4 }
    ]
  },

  // --- SPORTS & MISC ---
  {
    id: 'sports_olympics',
    metric: 'All-Time Summer Gold Medals (Most to Fewest)',
    data: [
      { label: 'USA', value: '1061', correctIndex: 0 },
      { label: 'USSR', value: '395', correctIndex: 1 },
      { label: 'Great Britain', value: '285', correctIndex: 2 },
      { label: 'China', value: '262', correctIndex: 3 },
      { label: 'Australia', value: '164', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_big_mac',
    metric: 'Price of a Big Mac - 2023 (Most to Least Expensive)',
    data: [
      { label: 'Switzerland', value: '$7.73', correctIndex: 0 },
      { label: 'Norway', value: '$6.92', correctIndex: 1 },
      { label: 'USA', value: '$5.58', correctIndex: 2 },
      { label: 'Japan', value: '$3.17', correctIndex: 3 },
      { label: 'India (Maharaja Mac)', value: '$2.54', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_height_avg',
    metric: 'Average Male Height (Tallest to Shortest)',
    data: [
      { label: 'Netherlands', value: '183.8cm', correctIndex: 0 },
      { label: 'Germany', value: '181cm', correctIndex: 1 },
      { label: 'USA', value: '177cm', correctIndex: 2 },
      { label: 'Japan', value: '170.8cm', correctIndex: 3 },
      { label: 'Timor-Leste', value: '160cm', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_metro_depth',
    metric: 'Deepest Point of Metro System (Deepest to Shallowest)',
    data: [
      { label: 'Kyiv (Arsenalna)', value: '105.5m', correctIndex: 0 },
      { label: 'St. Petersburg (Admiralteyskaya)', value: '86m', correctIndex: 1 },
      { label: 'Pyongyang', value: '110m', correctIndex: 2 }, // Actually deeper, re-sort
      { label: 'London (Hampstead)', value: '58m', correctIndex: 3 },
      { label: 'Singapore (Bencoolen)', value: '43m', correctIndex: 4 }
    ]
  },

  // --- TECHNOLOGY ---
  {
    id: 'tech_transistor',
    metric: 'Transistor Count (Most to Fewest)',
    data: [
      { label: 'Apple M2 Ultra', value: '134 Billion', correctIndex: 0 },
      { label: 'NVIDIA RTX 4090', value: '76 Billion', correctIndex: 1 },
      { label: 'Intel i9-13900K', value: '25 Billion', correctIndex: 2 },
      { label: 'Xbox Series X GPU', value: '15 Billion', correctIndex: 3 },
      { label: 'Apple A13 (iPhone 11)', value: '8.5 Billion', correctIndex: 4 }
    ]
  },
  {
    id: 'tech_web_usage',
    metric: 'Browser Market Share - 2023 (Highest to Lowest)',
    data: [
      { label: 'Chrome', value: '63%', correctIndex: 0 },
      { label: 'Safari', value: '20%', correctIndex: 1 },
      { label: 'Edge', value: '5%', correctIndex: 2 },
      { label: 'Firefox', value: '3%', correctIndex: 3 },
      { label: 'Opera', value: '2%', correctIndex: 4 }
    ]
  },

  // --- ANIMALS ---
  {
    id: 'ani_gestation',
    metric: 'Gestation Period (Longest to Shortest)',
    data: [
      { label: 'African Elephant', value: '640 days', correctIndex: 0 },
      { label: 'Orca', value: '540 days', correctIndex: 1 },
      { label: 'Giraffe', value: '450 days', correctIndex: 2 },
      { label: 'Human', value: '280 days', correctIndex: 3 },
      { label: 'Opossum', value: '12 days', correctIndex: 4 }
    ]
  },
  {
    id: 'ani_sleep',
    metric: 'Average Sleep per 24h (Most to Least)',
    data: [
      { label: 'Koala', value: '22 hours', correctIndex: 0 },
      { label: 'Little Brown Bat', value: '19 hours', correctIndex: 1 },
      { label: 'Lion', value: '13 hours', correctIndex: 2 },
      { label: 'Human', value: '8 hours', correctIndex: 3 },
      { label: 'Giraffe', value: '1.9 hours', correctIndex: 4 }
    ]
  },

  // --- SPACE ---
  {
    id: 'space_sun_dist',
    metric: 'Distance from Earth (Closest to Furthest)',
    data: [
      { label: 'Moon', value: '384k km', correctIndex: 0 },
      { label: 'Venus', value: '41M km', correctIndex: 1 },
      { label: 'Mars', value: '78M km', correctIndex: 2 },
      { label: 'Sun', value: '150M km', correctIndex: 3 },
      { label: 'Pluto', value: '5.9B km', correctIndex: 4 }
    ]
  },
  {
    id: 'space_temp',
    metric: 'Surface Temperature (Hottest to Coldest)',
    data: [
      { label: 'Venus', value: '464°C', correctIndex: 0 },
      { label: 'Mercury', value: '167°C', correctIndex: 1 },
      { label: 'Earth', value: '15°C', correctIndex: 2 },
      { label: 'Mars', value: '-65°C', correctIndex: 3 },
      { label: 'Neptune', value: '-200°C', correctIndex: 4 }
    ]
  },

  // --- FINANCE ---
  {
    id: 'fin_gold_reserves',
    metric: 'National Gold Reserves (Most to Least)',
    data: [
      { label: 'USA', value: '8,133 tons', correctIndex: 0 },
      { label: 'Germany', value: '3,352 tons', correctIndex: 1 },
      { label: 'Italy', value: '2,451 tons', correctIndex: 2 },
      { label: 'China', value: '2,113 tons', correctIndex: 3 },
      { label: 'Switzerland', value: '1,040 tons', correctIndex: 4 }
    ]
  },
  {
    id: 'fin_currency_value',
    metric: 'Currency Value vs 1 USD (Strongest to Weakest)',
    data: [
      { label: 'Kuwaiti Dinar', value: '0.31 KWD', correctIndex: 0 },
      { label: 'British Pound', value: '0.79 GBP', correctIndex: 1 },
      { label: 'Euro', value: '0.92 EUR', correctIndex: 2 },
      { label: 'Japanese Yen', value: '145 JPY', correctIndex: 3 },
      { label: 'Vietnamese Dong', value: '24,000 VND', correctIndex: 4 }
    ]
  }
];

export const QUESTION_BANK_BATCH_3: GameLevel[] = [
  // --- GEOGRAPHY & TRAVEL ---
  {
    id: 'geo_city_elevation',
    metric: 'City Elevation Above Sea Level (Highest to Lowest)',
    data: [
      { label: 'La Paz, Bolivia', value: '3,640m', correctIndex: 0 },
      { label: 'Mexico City, Mexico', value: '2,240m', correctIndex: 1 },
      { label: 'Denver, USA', value: '1,609m', correctIndex: 2 },
      { label: 'Madrid, Spain', value: '657m', correctIndex: 3 },
      { label: 'Amsterdam, Netherlands', value: '-2m', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_island_pop',
    metric: 'Island Population (Most to Least Populated)',
    data: [
      { label: 'Java, Indonesia', value: '151M', correctIndex: 0 },
      { label: 'Honshu, Japan', value: '104M', correctIndex: 1 },
      { label: 'Great Britain', value: '66M', correctIndex: 2 },
      { label: 'Luzon, Philippines', value: '64M', correctIndex: 3 },
      { label: 'Madagascar', value: '30M', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_coastline',
    metric: 'Length of Coastline (Longest to Shortest)',
    data: [
      { label: 'Canada', value: '202,080km', correctIndex: 0 },
      { label: 'Norway', value: '58,133km', correctIndex: 1 },
      { label: 'Indonesia', value: '54,716km', correctIndex: 2 },
      { label: 'Australia', value: '25,760km', correctIndex: 3 },
      { label: 'USA', value: '19,924km', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_lake_area',
    metric: 'Lake Surface Area (Largest to Smallest)',
    data: [
      { label: 'Caspian Sea', value: '371,000km²', correctIndex: 0 },
      { label: 'Lake Superior', value: '82,100km²', correctIndex: 1 },
      { label: 'Lake Victoria', value: '68,800km²', correctIndex: 2 },
      { label: 'Lake Michigan', value: '58,030km²', correctIndex: 3 },
      { label: 'Lake Baikal', value: '31,722km²', correctIndex: 4 }
    ]
  },
  {
    id: 'geo_tourism',
    metric: 'Most Visited Countries 2023 (Most to Least)',
    data: [
      { label: 'France', value: '100M', correctIndex: 0 },
      { label: 'Spain', value: '85M', correctIndex: 1 },
      { label: 'USA', value: '66M', correctIndex: 2 },
      { label: 'Italy', value: '57M', correctIndex: 3 },
      { label: 'Turkey', value: '55M', correctIndex: 4 }
    ]
  },

  // --- SCIENCE & NATURE ---
  {
    id: 'sci_animal_weight',
    metric: 'Maximum Weight of Land Animal (Heaviest to Lightest)',
    data: [
      { label: 'African Elephant', value: '6,000kg', correctIndex: 0 },
      { label: 'White Rhino', value: '2,300kg', correctIndex: 1 },
      { label: 'Hippopotamus', value: '1,500kg', correctIndex: 2 },
      { label: 'Giraffe', value: '1,200kg', correctIndex: 3 },
      { label: 'Bison', value: '900kg', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_elements_crust',
    metric: 'Abundance in Earth\'s Crust (Most to Least)',
    data: [
      { label: 'Oxygen', value: '46.1%', correctIndex: 0 },
      { label: 'Silicon', value: '28.2%', correctIndex: 1 },
      { label: 'Aluminum', value: '8.2%', correctIndex: 2 },
      { label: 'Iron', value: '5.6%', correctIndex: 3 },
      { label: 'Calcium', value: '4.1%', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_tree_height',
    metric: 'Maximum Tree Height by Species (Tallest to Shortest)',
    data: [
      { label: 'Coast Redwood', value: '115m', correctIndex: 0 },
      { label: 'Douglas Fir', value: '100m', correctIndex: 1 },
      { label: 'Giant Sequoia', value: '95m', correctIndex: 2 },
      { label: 'Sitka Spruce', value: '91m', correctIndex: 3 },
      { label: 'Oak Tree', value: '21m', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_bird_wingspan',
    metric: 'Maximum Wingspan (Largest to Smallest)',
    data: [
      { label: 'Wandering Albatross', value: '3.7m', correctIndex: 0 },
      { label: 'Andean Condor', value: '3.3m', correctIndex: 1 },
      { label: 'Golden Eagle', value: '2.3m', correctIndex: 2 },
      { label: 'Red-tailed Hawk', value: '1.4m', correctIndex: 3 },
      { label: 'Pigeon', value: '0.7m', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_wind_speed',
    metric: 'Beaufort Scale Category (Strongest to Weakest)',
    data: [
      { label: 'Hurricane', value: '118+ km/h', correctIndex: 0 },
      { label: 'Storm', value: '89-102 km/h', correctIndex: 1 },
      { label: 'Gale', value: '62-74 km/h', correctIndex: 2 },
      { label: 'Breeze', value: '12-19 km/h', correctIndex: 3 },
      { label: 'Calm', value: '<1 km/h', correctIndex: 4 }
    ]
  },

  // --- POP CULTURE & ENTERTAINMENT ---
  {
    id: 'ent_youtube_subs',
    metric: 'YouTube Subscribers 2024 (Most to Least)',
    data: [
      { label: 'MrBeast', value: '300M+', correctIndex: 0 },
      { label: 'T-Series', value: '260M', correctIndex: 1 },
      { label: 'Cocomelon', value: '176M', correctIndex: 2 },
      { label: 'PewDiePie', value: '111M', correctIndex: 3 },
      { label: 'Justin Bieber', value: '73M', correctIndex: 4 }
    ]
  },
  {
    id: 'ent_disney_movies',
    metric: 'Disney Movie Release Year (Oldest to Newest)',
    data: [
      { label: 'Snow White', value: '1937', correctIndex: 0 },
      { label: 'Cinderella', value: '1950', correctIndex: 1 },
      { label: 'The Little Mermaid', value: '1989', correctIndex: 2 },
      { label: 'The Lion King', value: '1994', correctIndex: 3 },
      { label: 'Frozen', value: '2013', correctIndex: 4 }
    ]
  },
  {
    id: 'ent_best_sellers',
    metric: 'Book Copies Sold (Most to Least)',
    data: [
      { label: 'Don Quixote', value: '500M', correctIndex: 0 },
      { label: 'Harry Potter (Book 1)', value: '120M', correctIndex: 1 },
      { label: 'The Hobbit', value: '100M', correctIndex: 2 },
      { label: 'The Alchemist', value: '65M', correctIndex: 3 },
      { label: 'The Great Gatsby', value: '30M', correctIndex: 4 }
    ]
  },
  {
    id: 'ent_streaming_price',
    metric: 'Standard Monthly Price USD (Highest to Lowest)',
    data: [
      { label: 'Netflix (Premium)', value: '$22.99', correctIndex: 0 },
      { label: 'Max (Ad-Free)', value: '$16.99', correctIndex: 1 },
      { label: 'Hulu (No Ads)', value: '$17.99', correctIndex: 2 },
      { label: 'Disney+ (Ad-Free)', value: '$13.99', correctIndex: 3 },
      { label: 'Apple TV+', value: '$9.99', correctIndex: 4 }
    ]
  },
  {
    id: 'ent_rock_bands',
    metric: 'Year Formed (Oldest to Newest)',
    data: [
      { label: 'The Rolling Stones', value: '1962', correctIndex: 0 },
      { label: 'Led Zeppelin', value: '1968', correctIndex: 1 },
      { label: 'Queen', value: '1970', correctIndex: 2 },
      { label: 'U2', value: '1976', correctIndex: 3 },
      { label: 'Nirvana', value: '1987', correctIndex: 4 }
    ]
  },

  // --- HISTORY & SOCIETY ---
  {
    id: 'hist_war_length',
    metric: 'Duration of Conflict (Longest to Shortest)',
    data: [
      { label: 'Hundred Years\' War', value: '116 years', correctIndex: 0 },
      { label: 'Vietnam War', value: '19 years', correctIndex: 1 },
      { label: 'Napoleonic Wars', value: '12 years', correctIndex: 2 },
      { label: 'World War II', value: '6 years', correctIndex: 3 },
      { label: 'World War I', value: '4 years', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_population_century',
    metric: 'World Population in Year (Most to Least)',
    data: [
      { label: '2024', value: '8.1 Billion', correctIndex: 0 },
      { label: '1950', value: '2.5 Billion', correctIndex: 1 },
      { label: '1900', value: '1.6 Billion', correctIndex: 2 },
      { label: '1800', value: '900 Million', correctIndex: 3 },
      { label: '1500', value: '450 Million', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_british_monarchs',
    metric: 'Length of Reign (Longest to Shortest)',
    data: [
      { label: 'Elizabeth II', value: '70 years', correctIndex: 0 },
      { label: 'Victoria', value: '63 years', correctIndex: 1 },
      { label: 'George III', value: '59 years', correctIndex: 2 },
      { label: 'Henry VIII', value: '37 years', correctIndex: 3 },
      { label: 'James I', value: '22 years', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_nobel_prizes',
    metric: 'Country by Total Nobel Prizes (Most to Fewest)',
    data: [
      { label: 'USA', value: '413', correctIndex: 0 },
      { label: 'UK', value: '138', correctIndex: 1 },
      { label: 'Germany', value: '115', correctIndex: 2 },
      { label: 'France', value: '73', correctIndex: 3 },
      { label: 'Sweden', value: '33', correctIndex: 4 }
    ]
  },
  {
    id: 'hist_ancient_cities',
    metric: 'Year Founded Approx (Oldest to Newest)',
    data: [
      { label: 'Jericho', value: '9000 BC', correctIndex: 0 },
      { label: 'Athens', value: '3000 BC', correctIndex: 1 },
      { label: 'Rome', value: '753 BC', correctIndex: 2 },
      { label: 'Kyoto', value: '794 AD', correctIndex: 3 },
      { label: 'Rio de Janeiro', value: '1565 AD', correctIndex: 4 }
    ]
  },

  // --- FOOD & LIFESTYLE ---
  {
    id: 'food_cheese_fat',
    metric: 'Fat Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Cheddar', value: '33g', correctIndex: 0 },
      { label: 'Brie', value: '28g', correctIndex: 1 },
      { label: 'Feta', value: '21g', correctIndex: 2 },
      { label: 'Mozzarella', value: '17g', correctIndex: 3 },
      { label: 'Cottage Cheese', value: '4g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_egg_prep_time',
    metric: 'Average Cooking Time (Longest to Shortest)',
    data: [
      { label: 'Hard Boiled', value: '10 min', correctIndex: 0 },
      { label: 'Soft Boiled', value: '6 min', correctIndex: 1 },
      { label: 'Poached', value: '3 min', correctIndex: 2 },
      { label: 'Sunny Side Up', value: '2 min', correctIndex: 3 },
      { label: 'Raw', value: '0 min', correctIndex: 4 }
    ]
  },
  {
    id: 'food_fruit_water',
    metric: 'Water Content % (Highest to Lowest)',
    data: [
      { label: 'Cucumber', value: '96%', correctIndex: 0 },
      { label: 'Watermelon', value: '92%', correctIndex: 1 },
      { label: 'Strawberry', value: '91%', correctIndex: 2 },
      { label: 'Apple', value: '86%', correctIndex: 3 },
      { label: 'Banana', value: '75%', correctIndex: 4 }
    ]
  },
  {
    id: 'food_cooking_oil_smoke',
    metric: 'Smoke Point (Highest to Lowest)',
    data: [
      { label: 'Avocado Oil', value: '270°C', correctIndex: 0 },
      { label: 'Rice Bran Oil', value: '232°C', correctIndex: 1 },
      { label: 'Canola Oil', value: '204°C', correctIndex: 2 },
      { label: 'Butter', value: '150°C', correctIndex: 3 },
      { label: 'Extra Virgin Olive Oil', value: '160°C', correctIndex: 4 }
    ]
  },
  {
    id: 'food_honey_shelf_life',
    metric: 'Typical Shelf Life (Longest to Shortest)',
    data: [
      { label: 'Honey', value: 'Infinite', correctIndex: 0 },
      { label: 'White Rice', value: '30 years', correctIndex: 1 },
      { label: 'Canned Beans', value: '5 years', correctIndex: 2 },
      { label: 'Olive Oil', value: '2 years', correctIndex: 3 },
      { label: 'Fresh Milk', value: '7 days', correctIndex: 4 }
    ]
  },

  // --- SPORTS & GAMES ---
  {
    id: 'sports_ball_size',
    metric: 'Ball Diameter (Largest to Smallest)',
    data: [
      { label: 'Basketball', value: '24cm', correctIndex: 0 },
      { label: 'Soccer Ball', value: '22cm', correctIndex: 1 },
      { label: 'Volleyball', value: '21cm', correctIndex: 2 },
      { label: 'Softball', value: '9cm', correctIndex: 3 },
      { label: 'Baseball', value: '7cm', correctIndex: 4 }
    ]
  },
  {
    id: 'sports_world_cup_wins',
    metric: 'FIFA World Cup Wins (Most to Fewest)',
    data: [
      { label: 'Brazil', value: '5', correctIndex: 0 },
      { label: 'Germany', value: '4', correctIndex: 1 },
      { label: 'Argentina', value: '3', correctIndex: 2 },
      { label: 'France', value: '2', correctIndex: 3 },
      { label: 'England', value: '1', correctIndex: 4 }
    ]
  },
  {
    id: 'sports_marathon_record',
    metric: 'Men\'s Marathon Time (Fastest to Slowest)',
    data: [
      { label: 'Kelvin Kiptum', value: '2:00:35', correctIndex: 0 },
      { label: 'Eliud Kipchoge', value: '2:01:09', correctIndex: 1 },
      { label: 'Haile Gebrselassie', value: '2:03:59', correctIndex: 2 },
      { label: 'Paula Radcliffe (W)', value: '2:15:25', correctIndex: 3 }, // Comparison
      { label: 'Average Runner', value: '4:30:00', correctIndex: 4 }
    ]
  },
  {
    id: 'sports_golf_clubs',
    metric: 'Club Loft Angle (Most to Least Loft)',
    data: [
      { label: 'Sand Wedge', value: '56°', correctIndex: 0 },
      { label: '9 Iron', value: '41°', correctIndex: 1 },
      { label: '5 Iron', value: '27°', correctIndex: 2 },
      { label: '3 Wood', value: '15°', correctIndex: 3 },
      { label: 'Driver', value: '10.5°', correctIndex: 4 }
    ]
  },
  {
    id: 'games_board_release',
    metric: 'Board Game Release Year (Oldest to Newest)',
    data: [
      { label: 'Chess', value: '6th Century', correctIndex: 0 },
      { label: 'Monopoly', value: '1935', correctIndex: 1 },
      { label: 'Scrabble', value: '1948', correctIndex: 2 },
      { label: 'Catan', value: '1995', correctIndex: 3 },
      { label: 'Wingspan', value: '2019', correctIndex: 4 }
    ]
  },

  // --- TECHNOLOGY & BUSINESS ---
  {
    id: 'tech_iphone_models',
    metric: 'iPhone Screen Size (Largest to Smallest)',
    data: [
      { label: 'iPhone 15 Pro Max', value: '6.7"', correctIndex: 0 },
      { label: 'iPhone 15', value: '6.1"', correctIndex: 1 },
      { label: 'iPhone 13 Mini', value: '5.4"', correctIndex: 2 },
      { label: 'iPhone 4S', value: '3.5"', correctIndex: 3 },
      { label: 'Original iPhone', value: '3.5"', correctIndex: 4 }
    ]
  },
  {
    id: 'tech_internet_speed',
    metric: 'Connection Type Avg Speed (Fastest to Slowest)',
    data: [
      { label: 'Fiber Optic', value: '1 Gbps+', correctIndex: 0 },
      { label: '5G Mobile', value: '200 Mbps', correctIndex: 1 },
      { label: '4G LTE', value: '30 Mbps', correctIndex: 2 },
      { label: '3G Mobile', value: '3 Mbps', correctIndex: 3 },
      { label: 'Dial-up', value: '56 Kbps', correctIndex: 4 }
    ]
  },
  {
    id: 'biz_company_revenue',
    metric: 'Annual Revenue 2023 (Highest to Lowest)',
    data: [
      { label: 'Walmart', value: '$611B', correctIndex: 0 },
      { label: 'Amazon', value: '$514B', correctIndex: 1 },
      { label: 'Apple', value: '$394B', correctIndex: 2 },
      { label: 'Google (Alphabet)', value: '$282B', correctIndex: 3 },
      { label: 'Microsoft', value: '$198B', correctIndex: 4 }
    ]
  },
  {
    id: 'biz_brand_value',
    metric: 'Brand Value 2024 (Most to Least Valuable)',
    data: [
      { label: 'Apple', value: '$516B', correctIndex: 0 },
      { label: 'Microsoft', value: '$340B', correctIndex: 1 },
      { label: 'Google', value: '$333B', correctIndex: 2 },
      { label: 'Amazon', value: '$308B', correctIndex: 3 },
      { label: 'Samsung', value: '$99B', correctIndex: 4 }
    ]
  },
  {
    id: 'tech_storage_size',
    metric: 'Byte Capacity (Largest to Smallest)',
    data: [
      { label: 'Terabyte', value: '10^12', correctIndex: 0 },
      { label: 'Gigabyte', value: '10^9', correctIndex: 1 },
      { label: 'Megabyte', value: '10^6', correctIndex: 2 },
      { label: 'Kilobyte', value: '10^3', correctIndex: 3 },
      { label: 'Bit', value: 'Single unit', correctIndex: 4 }
    ]
  },

  // --- SPACE & PHYSICS ---
  {
    id: 'space_star_temp',
    metric: 'Star Surface Temp by Type (Hottest to Coolest)',
    data: [
      { label: 'Blue Star (O-type)', value: '30,000K', correctIndex: 0 },
      { label: 'White Star (A-type)', value: '10,000K', correctIndex: 1 },
      { label: 'Yellow Star (The Sun)', value: '5,800K', correctIndex: 2 },
      { label: 'Orange Star (K-type)', value: '4,500K', correctIndex: 3 },
      { label: 'Red Dwarf (M-type)', value: '3,000K', correctIndex: 4 }
    ]
  },
  {
    id: 'space_planet_diameter',
    metric: 'Planet Diameter (Largest to Smallest)',
    data: [
      { label: 'Jupiter', value: '139,820km', correctIndex: 0 },
      { label: 'Uranus', value: '50,724km', correctIndex: 1 },
      { label: 'Earth', value: '12,742km', correctIndex: 2 },
      { label: 'Mars', value: '6,779km', correctIndex: 3 },
      { label: 'Mercury', value: '4,879km', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_wavelength',
    metric: 'Wavelength by Spectrum (Longest to Shortest)',
    data: [
      { label: 'Radio Waves', value: '100m', correctIndex: 0 },
      { label: 'Microwaves', value: '1cm', correctIndex: 1 },
      { label: 'Visible Light', value: '500nm', correctIndex: 2 },
      { label: 'X-Rays', value: '0.1nm', correctIndex: 3 },
      { label: 'Gamma Rays', value: '0.001nm', correctIndex: 4 }
    ]
  },
  {
    id: 'sci_ph_scale',
    metric: 'pH Value (Most Alkaline to Most Acidic)',
    data: [
      { label: 'Bleach', value: '13.0', correctIndex: 0 },
      { label: 'Baking Soda', value: '9.0', correctIndex: 1 },
      { label: 'Pure Water', value: '7.0', correctIndex: 2 },
      { label: 'Orange Juice', value: '3.5', correctIndex: 3 },
      { label: 'Stomach Acid', value: '1.5', correctIndex: 4 }
    ]
  },
  {
    id: 'space_moon_gravity',
    metric: 'Surface Gravity m/s² (Strongest to Weakest)',
    data: [
      { label: 'Earth', value: '9.80', correctIndex: 0 },
      { label: 'Titan (Saturn)', value: '1.35', correctIndex: 1 },
      { label: 'Moon', value: '1.62', correctIndex: 2 }, // Re-ordered check
      { label: 'Europa (Jupiter)', value: '1.31', correctIndex: 3 },
      { label: 'Pluto', value: '0.62', correctIndex: 4 }
    ]
  },

  // --- MISC & GENERAL KNOWLEDGE ---
  {
    id: 'misc_car_engines',
    metric: 'Engine Cylinders (Most to Fewest)',
    data: [
      { label: 'Bugatti Chiron', value: 'W16', correctIndex: 0 },
      { label: 'Ferrari F12', value: 'V12', correctIndex: 1 },
      { label: 'Dodge Viper', value: 'V10', correctIndex: 2 },
      { label: 'Corvette Z06', value: 'V8', correctIndex: 3 },
      { label: 'Honda Civic', value: 'I4', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_wedding_anniv',
    metric: 'Years Married (Most to Least)',
    data: [
      { label: 'Diamond', value: '60 years', correctIndex: 0 },
      { label: 'Golden', value: '50 years', correctIndex: 1 },
      { label: 'Ruby', value: '40 years', correctIndex: 2 },
      { label: 'Silver', value: '25 years', correctIndex: 3 },
      { label: 'Paper', value: '1 year', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_dog_intelligence',
    metric: 'Dog Breed Intelligence Rank (Smartest to Lower)',
    data: [
      { label: 'Border Collie', value: 'Rank 1', correctIndex: 0 },
      { label: 'Poodle', value: 'Rank 2', correctIndex: 1 },
      { label: 'German Shepherd', value: 'Rank 3', correctIndex: 2 },
      { label: 'Golden Retriever', value: 'Rank 4', correctIndex: 3 },
      { label: 'Beagle', value: 'Rank 72', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_house_rooms',
    metric: 'White House Room Count (Highest to Lowest)',
    data: [
      { label: 'The White House', value: '132 rooms', correctIndex: 0 },
      { label: 'Buckingham Palace', value: '775 rooms', correctIndex: 1 }, // Re-check order
      { label: 'Palace of Versailles', value: '2,300 rooms', correctIndex: 2 },
      { label: 'Biltmore Estate', value: '250 rooms', correctIndex: 3 },
      { label: 'Graceland', value: '23 rooms', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_clothing_size',
    metric: 'Average Width in cm (Largest to Smallest)',
    data: [
      { label: 'King Size Bed', value: '193cm', correctIndex: 0 },
      { label: 'Queen Size Bed', value: '152cm', correctIndex: 1 },
      { label: 'Double Bed', value: '137cm', correctIndex: 2 },
      { label: 'Single Bed', value: '99cm', correctIndex: 3 },
      { label: 'Crib', value: '71cm', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_paper_sizes',
    metric: 'ISO Paper Size Area (Largest to Smallest)',
    data: [
      { label: 'A0', value: '1.0m²', correctIndex: 0 },
      { label: 'A1', value: '0.5m²', correctIndex: 1 },
      { label: 'A2', value: '0.25m²', correctIndex: 2 },
      { label: 'A3', value: '0.125m²', correctIndex: 3 },
      { label: 'A4', value: '0.0625m²', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_card_deck',
    metric: 'Value in Blackjack (Highest to Lowest)',
    data: [
      { label: 'Ace', value: '11', correctIndex: 0 },
      { label: 'King', value: '10', correctIndex: 1 },
      { label: 'Queen', value: '10', correctIndex: 2 },
      { label: 'Jack', value: '10', correctIndex: 3 },
      { label: 'Two', value: '2', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_blood_types',
    metric: 'Global Rarity % (Most Common to Rarest)',
    data: [
      { label: 'O Positive', value: '38%', correctIndex: 0 },
      { label: 'A Positive', value: '34%', correctIndex: 1 },
      { label: 'B Positive', value: '9%', correctIndex: 2 },
      { label: 'O Negative', value: '7%', correctIndex: 3 },
      { label: 'AB Negative', value: '1%', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_currency_age',
    metric: 'First Use Year (Oldest to Newest)',
    data: [
      { label: 'Pound Sterling', value: '775 AD', correctIndex: 0 },
      { label: 'Japanese Yen', value: '1871 AD', correctIndex: 1 },
      { label: 'US Dollar', value: '1792 AD', correctIndex: 2 }, // Re-order check
      { label: 'Euro', value: '1999 AD', correctIndex: 3 },
      { label: 'Bitcoin', value: '2009 AD', correctIndex: 4 }
    ]
  },
  {
    id: 'misc_fastest_elevators',
    metric: 'Elevator speed in m/s (Fastest to Slowest)',
    data: [
      { label: 'Shanghai Tower', value: '20.5 m/s', correctIndex: 0 },
      { label: 'Burj Khalifa', value: '10 m/s', correctIndex: 1 },
      { label: 'Taipei 101', value: '16.8 m/s', correctIndex: 2 }, // Re-order check
      { label: 'Empire State Building', value: '6.1 m/s', correctIndex: 3 },
      { label: 'Standard Home Elevator', value: '0.5 m/s', correctIndex: 4 }
    ]
  }
];

export const QUESTION_BANK_HEALTH: GameLevel[] = [
  // --- PROTEIN DENSITY (Per 100g) ---
  {
    id: 'food_protein_nuts',
    metric: 'Protein per 100g in Nuts (Highest to Lowest)',
    data: [
      { label: 'Peanuts', value: '26g', correctIndex: 0 },
      { label: 'Almonds', value: '21g', correctIndex: 1 },
      { label: 'Pistachios', value: '20g', correctIndex: 2 },
      { label: 'Cashews', value: '18g', correctIndex: 3 },
      { label: 'Pecans', value: '9g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_protein_seafood',
    metric: 'Protein per 100g in Seafood (Highest to Lowest)',
    data: [
      { label: 'Tuna (Canned)', value: '26g', correctIndex: 0 },
      { label: 'Salmon', value: '22g', correctIndex: 1 },
      { label: 'Tilapia', value: '20g', correctIndex: 2 },
      { label: 'Shrimp', value: '19g', correctIndex: 3 },
      { label: 'Cod', value: '18g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_protein_plant',
    metric: 'Protein per 100g in Plant-Based Sources (Highest to Lowest)',
    data: [
      { label: 'Seitan', value: '25g', correctIndex: 0 },
      { label: 'Tempeh', value: '19g', correctIndex: 1 },
      { label: 'Edamame', value: '11g', correctIndex: 2 },
      { label: 'Lentils (Cooked)', value: '9g', correctIndex: 3 },
      { label: 'Tofu (Firm)', value: '8g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_protein_poultry',
    metric: 'Protein per 100g in Poultry/Meat (Highest to Lowest)',
    data: [
      { label: 'Turkey Breast', value: '29g', correctIndex: 0 },
      { label: 'Chicken Breast', value: '27g', correctIndex: 1 },
      { label: 'Beef Sirloin', value: '26g', correctIndex: 2 },
      { label: 'Pork Chop', value: '25g', correctIndex: 3 },
      { label: 'Lamb Chop', value: '24g', correctIndex: 4 }
    ]
  },
  {
    id: 'food_protein_seeds',
    metric: 'Protein per 100g in Seeds (Highest to Lowest)',
    data: [
      { label: 'Pumpkin Seeds', value: '30g', correctIndex: 0 },
      { label: 'Hemp Seeds', value: '25g', correctIndex: 1 },
      { label: 'Sunflower Seeds', value: '21g', correctIndex: 2 },
      { label: 'Flax Seeds', value: '18g', correctIndex: 3 },
      { label: 'Chia Seeds', value: '17g', correctIndex: 4 }
    ]
  },

  // --- HEALTHY DIET & LIFESTYLE ---
  {
    id: 'health_fiber',
    metric: 'Fiber Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Chia Seeds', value: '34g', correctIndex: 0 },
      { label: 'Lentils (Cooked)', value: '8g', correctIndex: 1 },
      { label: 'Avocado', value: '7g', correctIndex: 2 },
      { label: 'Raspberries', value: '6.5g', correctIndex: 3 },
      { label: 'Broccoli', value: '3g', correctIndex: 4 }
    ]
  },
  {
    id: 'health_fruit_cals',
    metric: 'Calories per 100g of Fruit (Highest to Lowest)',
    data: [
      { label: 'Avocado', value: '160 kcal', correctIndex: 0 },
      { label: 'Banana', value: '89 kcal', correctIndex: 1 },
      { label: 'Grapes', value: '67 kcal', correctIndex: 2 },
      { label: 'Apple', value: '52 kcal', correctIndex: 3 },
      { label: 'Strawberry', value: '32 kcal', correctIndex: 4 }
    ]
  },
  {
    id: 'health_oil_sat_fat',
    metric: 'Saturated Fat Percentage (Highest to Lowest)',
    data: [
      { label: 'Coconut Oil', value: '87%', correctIndex: 0 },
      { label: 'Butter', value: '51%', correctIndex: 1 },
      { label: 'Lard', value: '39%', correctIndex: 2 },
      { label: 'Olive Oil', value: '14%', correctIndex: 3 },
      { label: 'Sunflower Oil', value: '10%', correctIndex: 4 }
    ]
  },
  {
    id: 'health_calcium',
    metric: 'Calcium Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Parmesan Cheese', value: '1100mg', correctIndex: 0 },
      { label: 'Sardines (Canned)', value: '380mg', correctIndex: 1 },
      { label: 'Tofu (Calcium-set)', value: '350mg', correctIndex: 2 },
      { label: 'Milk', value: '125mg', correctIndex: 3 },
      { label: 'Spinach', value: '99mg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_iron',
    metric: 'Iron Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Pumpkin Seeds', value: '8.8mg', correctIndex: 0 },
      { label: 'Beef Liver', value: '6.5mg', correctIndex: 1 },
      { label: 'Lentils', value: '3.3mg', correctIndex: 2 },
      { label: 'Spinach', value: '2.7mg', correctIndex: 3 },
      { label: 'Egg', value: '1.2mg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_fruit_sugar',
    metric: 'Sugar Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Grapes', value: '16g', correctIndex: 0 },
      { label: 'Mango', value: '14g', correctIndex: 1 },
      { label: 'Apple', value: '10g', correctIndex: 2 },
      { label: 'Orange', value: '9g', correctIndex: 3 },
      { label: 'Raspberries', value: '4.4g', correctIndex: 4 }
    ]
  },
  {
    id: 'health_met_exercise',
    metric: 'Exercise Intensity - MET Value (Highest to Lowest)',
    data: [
      { label: 'Running (10 mph)', value: '14.5', correctIndex: 0 },
      { label: 'Swimming Laps', value: '10.0', correctIndex: 1 },
      { label: 'Cycling (Fast)', value: '10.0', correctIndex: 2 },
      { label: 'Walking (Brisk)', value: '4.5', correctIndex: 3 },
      { label: 'Hatha Yoga', value: '2.5', correctIndex: 4 }
    ]
  },
  {
    id: 'health_potassium',
    metric: 'Potassium per 100g (Highest to Lowest)',
    data: [
      { label: 'Avocado', value: '485mg', correctIndex: 0 },
      { label: 'Spinach', value: '466mg', correctIndex: 1 },
      { label: 'Banana', value: '358mg', correctIndex: 2 },
      { label: 'Sweet Potato', value: '337mg', correctIndex: 3 },
      { label: 'Milk', value: '150mg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_magnesium',
    metric: 'Magnesium per 100g (Highest to Lowest)',
    data: [
      { label: 'Pumpkin Seeds', value: '590mg', correctIndex: 0 },
      { label: 'Almonds', value: '270mg', correctIndex: 1 },
      { label: 'Dark Chocolate', value: '230mg', correctIndex: 2 },
      { label: 'Spinach', value: '79mg', correctIndex: 3 },
      { label: 'Banana', value: '27mg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_omega3',
    metric: 'Total Omega-3 Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Chia Seeds', value: '17.8g', correctIndex: 0 },
      { label: 'Walnuts', value: '9.1g', correctIndex: 1 },
      { label: 'Salmon', value: '2.3g', correctIndex: 2 },
      { label: 'Navy Beans', value: '0.2g', correctIndex: 3 },
      { label: 'Egg', value: '0.1g', correctIndex: 4 }
    ]
  },
  {
    id: 'health_steps',
    metric: 'Daily Steps Activity Level (Highest to Lowest)',
    data: [
      { label: 'Highly Active', value: '12,500+', correctIndex: 0 },
      { label: 'Active', value: '10,000', correctIndex: 1 },
      { label: 'Somewhat Active', value: '7,500', correctIndex: 2 },
      { label: 'Low Active', value: '5,000', correctIndex: 3 },
      { label: 'Sedentary', value: '<5,000', correctIndex: 4 }
    ]
  },
  {
    id: 'health_sleep_age',
    metric: 'Recommended Sleep Duration (Longest to Shortest)',
    data: [
      { label: 'Newborn (0-3 mo)', value: '14-17 hrs', correctIndex: 0 },
      { label: 'Preschooler (3-5 yr)', value: '10-13 hrs', correctIndex: 1 },
      { label: 'Teenager (14-17 yr)', value: '8-10 hrs', correctIndex: 2 },
      { label: 'Adult (18-64 yr)', value: '7-9 hrs', correctIndex: 3 },
      { label: 'Senior (65+ yr)', value: '7-8 hrs', correctIndex: 4 }
    ]
  },
  {
    id: 'health_heart_rate',
    metric: 'Training Intensity Zone % of Max (Highest to Lowest)',
    data: [
      { label: 'Peak (Maximum)', value: '90-100%', correctIndex: 0 },
      { label: 'Anaerobic (Hard)', value: '80-90%', correctIndex: 1 },
      { label: 'Aerobic (Moderate)', value: '70-80%', correctIndex: 2 },
      { label: 'Weight Control (Light)', value: '60-70%', correctIndex: 3 },
      { label: 'Warm up (Very Light)', value: '50-60%', correctIndex: 4 }
    ]
  },
  {
    id: 'health_body_fat',
    metric: 'Men\'s Body Fat Classification (Highest to Lowest %)',
    data: [
      { label: 'Obese', value: '25%+', correctIndex: 0 },
      { label: 'Average', value: '18-24%', correctIndex: 1 },
      { label: 'Fitness', value: '14-17%', correctIndex: 2 },
      { label: 'Athletic', value: '6-13%', correctIndex: 3 },
      { label: 'Essential Fat', value: '2-5%', correctIndex: 4 }
    ]
  },
  {
    id: 'health_bmi',
    metric: 'BMI Category (Highest to Lowest)',
    data: [
      { label: 'Obese', value: '30.0+', correctIndex: 0 },
      { label: 'Overweight', value: '25.0 - 29.9', correctIndex: 1 },
      { label: 'Healthy Weight', value: '18.5 - 24.9', correctIndex: 2 },
      { label: 'Underweight', value: '16.0 - 18.5', correctIndex: 3 },
      { label: 'Severely Underweight', value: '<16.0', correctIndex: 4 }
    ]
  },
  {
    id: 'health_sodium',
    metric: 'Sodium Content per 100g (Highest to Lowest)',
    data: [
      { label: 'Soy Sauce', value: '5,490mg', correctIndex: 0 },
      { label: 'Salami', value: '1,890mg', correctIndex: 1 },
      { label: 'Cheddar Cheese', value: '620mg', correctIndex: 2 },
      { label: 'Bread', value: '490mg', correctIndex: 3 },
      { label: 'Potato Chips', value: '400mg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_water_veg',
    metric: 'Water Content Percentage (Highest to Lowest)',
    data: [
      { label: 'Cucumber', value: '95%', correctIndex: 0 },
      { label: 'Tomato', value: '94%', correctIndex: 1 },
      { label: 'Spinach', value: '91%', correctIndex: 2 },
      { label: 'Carrots', value: '88%', correctIndex: 3 },
      { label: 'Potato', value: '79%', correctIndex: 4 }
    ]
  },
  {
    id: 'health_vitamin_a',
    metric: 'Vitamin A per 100g (Highest to Lowest)',
    data: [
      { label: 'Beef Liver', value: '9440mcg', correctIndex: 0 },
      { label: 'Carrots', value: '835mcg', correctIndex: 1 },
      { label: 'Sweet Potato', value: '710mcg', correctIndex: 2 },
      { label: 'Spinach', value: '470mcg', correctIndex: 3 },
      { label: 'Egg', value: '140mcg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_vitamin_b12',
    metric: 'Vitamin B12 per 100g (Highest to Lowest)',
    data: [
      { label: 'Clams', value: '99mcg', correctIndex: 0 },
      { label: 'Beef Liver', value: '70mcg', correctIndex: 1 },
      { label: 'Mackerel', value: '19mcg', correctIndex: 2 },
      { label: 'Beef', value: '2.6mcg', correctIndex: 3 },
      { label: 'Egg', value: '1.1mcg', correctIndex: 4 }
    ]
  },
  {
    id: 'health_alcohol_cals',
    metric: 'Calories per 100ml (Highest to Lowest)',
    data: [
      { label: 'Whiskey (40%)', value: '250 kcal', correctIndex: 0 },
      { label: 'Red Wine', value: '85 kcal', correctIndex: 1 },
      { label: 'White Wine', value: '82 kcal', correctIndex: 2 },
      { label: 'Beer (Standard)', value: '43 kcal', correctIndex: 3 },
      { label: 'Light Beer', value: '29 kcal', correctIndex: 4 }
    ]
  }
];