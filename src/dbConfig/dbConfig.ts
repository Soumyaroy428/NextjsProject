import mongoose, { connection } from "mongoose";

export async function connect() {
    try {
        if (!process.env.MONGO_URI) {
            console.log('MONGO_URI not found in environment variables');
            return;
        }

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB Connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error:', err.message);
        })

    } catch (error) {
        console.log('Database connection error:', error);
        throw error;
    }
}