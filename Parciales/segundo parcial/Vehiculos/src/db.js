require('dotenv').config();
const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/logistica';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoCreate: true });
  console.log('MongoDB conectado');
}

module.exports = { connectMongo };
