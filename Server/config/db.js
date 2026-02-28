import mongoose from 'mongoose';

export default async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
}
