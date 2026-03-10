import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import storeDocumentsRoutes from './routes/storeDocumentsRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:5001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Import routes
app.use('/store-transcript', storeDocumentsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
