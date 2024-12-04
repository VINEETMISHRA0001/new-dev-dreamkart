const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/DB');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/ErrorController');

// Import routes
const authRoutes = require('./routes/AuthRoutes');
const profileRoutes = require('./routes/ProfileRoutes');
const addressRoutes = require('./routes/AddressRoutes');
const adminRoutes = require('./routes/ADMIN/AdminRoutes');
const subAdminRoutes = require('./routes/ADMIN/SubadminRoutes');
const categoryRoutes = require('./routes/CATEGORIES/CategoryRoutes');
const subCategoryRoutes = require('./routes/CATEGORIES/SubCategoryRoutes');
const productsRoutes = require('./routes/PRODUCTS/ProductsRoutes');
const cartRoutes = require('./routes/CART/CartRoutes');
const orderRoutes = require('./routes/ORDERS/OrderRoutes');
const feedbackRoutes = require('./routes/FEEDBACKS/FeedbackRoutes');
const wishlistRoutes = require('./routes/WISHLIST/WishlistRoutes');
const bannerRoutes = require('./routes/BANNER/BannerRoutes');
const couponRoutes = require('./routes/COUPONS/CouponRoutes');
const recentRoutes = require('./routes/RECENTLY VIEWED/RecentlyViewedRoutes');
const socials = require('./routes/SocialRoutes');
const bulkImageRoutes = require('./routes/ImageRoutes');
const paymentsRoutes = require('./routes/PaymentRoutes');
const discountRoutes = require('./routes/DiscountRoutes');
const blogRoutes = require('./routes/BLOGS/BlogRoutes');
const invoiceRoutes = require('./routes/InvoiceRoutes');
const pagesRoutes = require('./routes/PageRoutes');
const chatRoutes = require('./routes/CHATS/ChatRoutes');
const thirdCategoryRoutes = require('./routes/CATEGORIES/ThirdCategoryRoutes');
const seoRoutes = require('./routes/Seo');
const User = require('./models/UserSchema');

// Environment configuration
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());

// General middleware
app.use(express.json({ limit: '10mb' })); // Limit JSON body size
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'https://admin.dreamkart.world',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

// Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'public')));

// Rate limiter (optional for security)

// Socket.IO handling

app.get('/', (req, res) => {
  res.send('Backend Requested');
});
// API Routes
app.use('/api/v1/protect/auth', authRoutes);
app.use('/api/v1/user', profileRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/user', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/feedbacks', feedbackRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/recently-viewed', recentRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/popular', socials);
app.use('/api/v1/discount', discountRoutes);
app.use('/api/v1/invoice', invoiceRoutes);
app.use('/api/v1/manage-pages', pagesRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/admin/auth', adminRoutes);
app.use('/api/v1/admin/subadmin', subAdminRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoutes);
app.use('/api/v1/third-category', thirdCategoryRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/images/upload', bulkImageRoutes);
app.use('/api/v1/seo', seoRoutes);

// Announcement email endpoint
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailTemplate = (announcement) => `
  <html>
    <body>
      <h1>Announcement</h1>
      <p>${announcement}</p>
    </body>
  </html>
`;

app.post('/api/v1/send-announcement', async (req, res) => {
  const { announcement } = req.body;
  if (!announcement) {
    return res
      .status(400)
      .json({ message: 'Announcement message is required' });
  }

  try {
    const users = await User.find();
    await Promise.all(
      users.map((user) =>
        transporter.sendMail({
          from: process.env.EMAIL_USERNAME,
          to: user.email,
          subject: 'New Announcement!',
          html: emailTemplate(announcement),
        })
      )
    );
    res.status(200).json({ message: 'Announcement sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send announcement' });
  }
});

// Start the server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
