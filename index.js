const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./config/DB');
const authRoutes = require('./routes/AuthRoutes');
const profileRoutes = require('./routes/ProfileRoutes');
const addressRoutes = require('./routes/AddressRoutes');
const globalErrorHandler = require('./controllers/ErrorController');
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
const AppError = require('./utils/AppError');
const socials = require('./routes/SocialRoutes');
const bulkImageRoutes = require('./routes/ImageBulkRoutes');
const paymentsRoutes = require('./routes/PaymentRoutes');
const discountRoutes = require('./routes/DiscountRoutes');
const blogRoutes = require('./routes/BLOGS/BlogRoutes');
const invoiceRoutes = require('./routes/InvoiceRoutes');
const pagesRoutes = require('./routes/PageRoutes');
const Chat = require('./routes/CHATS/ChatRoutes');
const thirdCategoryRoutes = require('./routes/CATEGORIES/ThirdCategoryRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

// Security middleware
app.use(helmet());

// // Limit request rate
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // Limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit JSON body size
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello vercel' });
});
// Serve the uploads folder as static files
app.use('/uploads', express.static('public')); // Adjust the path as necessary

// USER Routes
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

// chat Routes

app.use('/api/v1/chats', Chat);

io.on('connection', (socket) => {
  console.log('Client connected' + socket.id);

  // handle user messages

  socket.on('userMessage', (data) => {
    console.log('Message from user', data.message);

    const newMessage = new Chat({
      userId: data.userId,
      message: data.message,
      sender: 'user',
    });

    newMessage.save();

    socket.emit('botMessage', {
      message: 'Thanks For your message! we"ll  get back to you soon.',
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// ADMIN ROUTES
app.use('/api/v1/admin/auth', adminRoutes);
app.use('/api/v1/admin/subadmin', subAdminRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoutes);
app.use('/api/v1/third-category', thirdCategoryRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/images/upload', bulkImageRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
