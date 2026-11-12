import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hamper name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
      index: true,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'Curated artisanal hamper designed for exquisite celebrations and bespoke gifting.',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      index: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Royal Hampers',
          'Gourmet & Truffle',
          'Champagne & Wine',
          'Spa & Wellness',
          'Artisanal Sweets',
          'Corporate Luxe'
        ],
        message: '{VALUE} is not a valid luxury category',
      },
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
      default: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.9,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate unique SKU if omitted
productSchema.pre('save', function (next) {
  if (!this.sku) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const catCode = this.category ? this.category.substring(0, 3).toUpperCase() : 'NLH';
    this.sku = `NLH-${catCode}-${randomHex}`;
  }
  next();
});

// Compound text index for lightning-fast search queries
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
