import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

// import routes
import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';

import seedAdminUser from './utils/seeder.js';

dotenv.config();

// connect to mongodb
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  seedAdminUser();
}

// mount routers
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound); // Handles 404 errors for routes not found
app.use(errorHandler); // Global error handler

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});