import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Sovereign Truffle & Reserve Box',
    sku: 'NLH-GOUR-A101',
    description: 'Imported artisanal truffles, aged balsamic reduction, and gold-leaf almond brittle in an embossed wooden case.',
    price: 6499,
    stock: 14,
    category: 'Gourmet & Truffle',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Imperial Heritage Grand Hamper',
    sku: 'NLH-ROYL-B202',
    description: 'Prestige vintage sparkling beverage, raw honeycomb, organic stoneground wafers, and hand-poured candle.',
    price: 9999,
    stock: 4,
    category: 'Royal Hampers',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    isFeatured: true,
  },
  {
    name: 'Velvet Rose Spa Sanctuary',
    sku: 'NLH-WELL-C303',
    description: 'Mulberry silk eye mask, botanical bath salts, cold-pressed rosehip elixir, and organic aromatherapy mist.',
    price: 3999,
    stock: 0,
    category: 'Spa & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    isFeatured: false,
  },
  {
    name: 'Sommelier Reserve Duo Collection',
    sku: 'NLH-CHMP-D404',
    description: 'Pair of artisanal reserve vintages accompanied by smoked sea salt pecans and dark cacao medallions.',
    price: 8499,
    stock: 8,
    category: 'Champagne & Wine',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Artisan Praline Elegance Case',
    sku: 'NLH-SWET-E505',
    description: 'Twenty-four hand-painted single-origin cacao bonbons infused with Tahitian vanilla and lavender honey.',
    price: 2499,
    stock: 22,
    category: 'Artisanal Sweets',
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    isFeatured: false,
  },
  {
    name: 'Executive Premier Corporate Cask',
    sku: 'NLH-CORP-F606',
    description: 'Curated corporate gifting set with leather tech organizer, vacuum-insulated carafe, and single-estate roast coffee.',
    price: 5499,
    stock: 2,
    category: 'Corporate Luxe',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    isFeatured: false,
  },
  {
    name: 'Golden Radiance Festive Chest',
    sku: 'NLH-ROYL-G707',
    description: 'Handcrafted gilded brass chest filled with saffron shortbread, cold-pressed macadamia butter, and rare flowering teas.',
    price: 12999,
    stock: 6,
    category: 'Royal Hampers',
    imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    isFeatured: true,
  },
  {
    name: 'Royal Saffron Paneer & Kesari Trunk',
    sku: 'NLH-GOUR-H808',
    description: 'Charcoal-grilled saffron paneer tikka, velvety shahi paneer, aromatic kesari pulao, and mint chutney curated in a luxury keepsake trunk.',
    price: 14999,
    stock: 3,
    category: 'Gourmet & Truffle',
    imageUrl: '/veg-hamper.jpg',
    rating: 4.9,
    isFeatured: true,
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    console.log('🧹 Purged existing product database collection.');

    const created = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${created.length} luxury hampers successfully!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();