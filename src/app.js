const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const listaddRoutes = require('./routes/listaddRoutes');
const profileRoutes = require('./routes/profileRoutes');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/listadd', listaddRoutes);

setupSwagger(app);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});