import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  repos: [{ name: String, stars: Number, language: String }],
  evaluation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;