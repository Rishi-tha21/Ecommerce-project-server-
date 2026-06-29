const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  // WOMEN (1-12)
  { numericId: 1, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Beautiful striped blouse with flutter sleeves and overlap collar.', price: 50, oldPrice: 80.5, category: 'women', brand: 'SHOPPER', rating: 4.5, stock: 120, images: ['/products/product_1.png'], sizes: ['XS','S','M','L','XL'], colors: ['White','Pink'], isFeatured: true },
  { numericId: 2, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Elegant floral wrap dress with v-neckline.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.3, stock: 95, images: ['/products/product_2.png'], sizes: ['S','M','L','XL'], colors: ['Red','Navy'], isFeatured: true },
  { numericId: 3, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Timeless cotton button-down with relaxed fit.', price: 60, oldPrice: 100.5, category: 'women', brand: 'SHOPPER', rating: 4.2, stock: 110, images: ['/products/product_3.png'], sizes: ['S','M','L'], colors: ['White','Blue'] },
  { numericId: 4, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Free-spirited tunic with intricate embroidery.', price: 100, oldPrice: 150, category: 'women', brand: 'SHOPPER', rating: 4.6, stock: 80, images: ['/products/product_4.png'], sizes: ['S','M','L'], colors: ['White','Beige'], isFeatured: true },
  { numericId: 5, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Luxurious silk-blend pleated midi skirt.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.4, stock: 65, images: ['/products/product_5.png'], sizes: ['S','M','L','XL'], colors: ['Gold','Black'] },
  { numericId: 6, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Trendy ribbed knit crop top.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.1, stock: 150, images: ['/products/product_6.png'], sizes: ['XS','S','M','L'], colors: ['Black','Olive'] },
  { numericId: 7, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Delicate camisole with lace trim.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.0, stock: 100, images: ['/products/product_7.png'], sizes: ['XS','S','M'], colors: ['Black','Champagne'] },
  { numericId: 8, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Eye-catching off-shoulder blouse with ruffles.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.5, stock: 75, images: ['/products/product_8.png'], sizes: ['S','M','L','XL'], colors: ['White','Red'], isNewCollection: true },
  { numericId: 9, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Elegant high-waist palazzo pants.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.3, stock: 90, images: ['/products/product_9.png'], sizes: ['S','M','L','XL'], colors: ['Black','Navy'] },
  { numericId: 10, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Charming vintage polka dot dress.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.7, stock: 60, images: ['/products/product_10.png'], sizes: ['XS','S','M','L'], colors: ['Black/White'] },
  { numericId: 11, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Classic denim A-line mini skirt.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.2, stock: 130, images: ['/products/product_11.png'], sizes: ['S','M','L','XL'], colors: ['Light Wash','Dark Wash'] },
  { numericId: 12, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', description: 'Sophisticated satin wrap blouse.', price: 85, oldPrice: 120.5, category: 'women', brand: 'SHOPPER', rating: 4.4, stock: 85, images: ['/products/product_12.png'], sizes: ['S','M','L'], colors: ['Emerald','Black'], isNewCollection: true },
  
  // MEN (13-24)
  { numericId: 13, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Stylish green zip-up bomber jacket.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.5, stock: 100, images: ['/products/product_13.png'], sizes: ['S','M','L','XL','XXL'], colors: ['Green','Black'], isFeatured: true },
  { numericId: 14, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Premium cotton Oxford shirt.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.3, stock: 120, images: ['/products/product_14.png'], sizes: ['S','M','L','XL'], colors: ['White','Blue'], isNewCollection: true },
  { numericId: 15, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Modern slim fit chinos.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.4, stock: 95, images: ['/products/product_15.png'], sizes: ['30','32','34','36'], colors: ['Khaki','Navy'], isNewCollection: true },
  { numericId: 16, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Classic denim jacket in premium wash.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.6, stock: 70, images: ['/products/product_16.png'], sizes: ['S','M','L','XL'], colors: ['Light Wash','Black'] },
  { numericId: 17, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Moisture-wicking performance polo.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.2, stock: 140, images: ['/products/product_17.png'], sizes: ['S','M','L','XL'], colors: ['White','Navy'], isNewCollection: true },
  { numericId: 18, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Sophisticated wool-blend overcoat.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.8, stock: 45, images: ['/products/product_18.png'], sizes: ['S','M','L','XL'], colors: ['Charcoal','Camel'] },
  { numericId: 19, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Soft cotton crew neck with graphic.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.1, stock: 200, images: ['/products/product_19.png'], sizes: ['S','M','L','XL','XXL'], colors: ['White','Black'] },
  { numericId: 20, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Sharply tailored slim fit blazer.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.5, stock: 55, images: ['/products/product_20.png'], sizes: ['S','M','L','XL'], colors: ['Navy','Charcoal'] },
  { numericId: 21, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Genuine leather belt.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.3, stock: 150, images: ['/products/product_21.png'], sizes: ['S','M','L','XL'], colors: ['Brown','Black'] },
  { numericId: 22, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Comfortable cargo shorts.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.0, stock: 110, images: ['/products/product_22.png'], sizes: ['30','32','34','36'], colors: ['Khaki','Olive'] },
  { numericId: 23, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Luxurious merino wool sweater.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.6, stock: 80, images: ['/products/product_23.png'], sizes: ['S','M','L','XL'], colors: ['Navy','Burgundy'] },
  { numericId: 24, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', description: 'Modern jogger pants.', price: 85, oldPrice: 120.5, category: 'men', brand: 'SHOPPER', rating: 4.4, stock: 130, images: ['/products/product_24.png'], sizes: ['S','M','L','XL'], colors: ['Black','Grey'] },
  
  // KID (25-36)
  { numericId: 25, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Vibrant orange colorblocked hoodie for boys.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.5, stock: 100, images: ['/products/product_25.png'], sizes: ['3-4Y','5-6Y','7-8Y','9-10Y'], colors: ['Orange','Blue'], isFeatured: true },
  { numericId: 26, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Classic striped polo for kids.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.2, stock: 120, images: ['/products/product_26.png'], sizes: ['3-4Y','5-6Y','7-8Y'], colors: ['Navy/White'] },
  { numericId: 27, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Delightful floral print summer dress.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.6, stock: 80, images: ['/products/product_27.png'], sizes: ['3-4Y','5-6Y','7-8Y'], colors: ['Pink','Yellow'] },
  { numericId: 28, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Fun and stylish denim dungaree.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.3, stock: 90, images: ['/products/product_28.png'], sizes: ['3-4Y','5-6Y','7-8Y','9-10Y'], colors: ['Light Blue'], isNewCollection: true },
  { numericId: 29, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Cool graphic print hoodie for boys.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.4, stock: 100, images: ['/products/product_29.png'], sizes: ['5-6Y','7-8Y','9-10Y'], colors: ['Grey','Black'] },
  { numericId: 30, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Adorable tutu skirt set.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.7, stock: 60, images: ['/products/product_30.png'], sizes: ['3-4Y','5-6Y','7-8Y'], colors: ['Pink','Purple'] },
  { numericId: 31, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Comfortable track pants and jacket set.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.1, stock: 110, images: ['/products/product_31.png'], sizes: ['5-6Y','7-8Y','9-10Y'], colors: ['Black/Red','Navy/White'] },
  { numericId: 32, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Sweet embroidered cardigan.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.5, stock: 75, images: ['/products/product_32.png'], sizes: ['3-4Y','5-6Y','7-8Y'], colors: ['Cream','Pink'] },
  { numericId: 33, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Rugged camouflage cargo pants.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.2, stock: 95, images: ['/products/product_33.png'], sizes: ['5-6Y','7-8Y','9-10Y'], colors: ['Green Camo'] },
  { numericId: 34, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Bright rainbow stripe t-shirt.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.3, stock: 140, images: ['/products/product_34.png'], sizes: ['3-4Y','5-6Y','7-8Y','9-10Y'], colors: ['Rainbow'] },
  { numericId: 35, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Warm winter puffer jacket.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.6, stock: 55, images: ['/products/product_35.png'], sizes: ['5-6Y','7-8Y','9-10Y'], colors: ['Red','Navy'], isNewCollection: true },
  { numericId: 36, name: 'Boys Orange Colourblocked Hooded Sweatshirt', description: 'Stunning party wear frock.', price: 85, oldPrice: 120.5, category: 'kid', brand: 'SHOPPER Kids', rating: 4.8, stock: 40, images: ['/products/product_36.png'], sizes: ['3-4Y','5-6Y','7-8Y'], colors: ['Gold','Silver'] },
];

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    console.log('Cleared existing products');
    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);
    const adminExists = await User.findOne({ email: 'admin@shopper.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@shopper.com', password: 'admin123', role: 'admin' });
      console.log('Admin user created (admin@shopper.com / admin123)');
    }
    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
