import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  profile: {
    name: String,
    avatar: String,
    bio: String,
    location: String,
    company: String,
    website: String,
    email: String,
    experience: String,
    interests: String
  },
  scores: {
    overall: { type: Number, required: true },
    activity: { type: Number, required: true },
    quality: { type: Number, required: true },
    community: { type: Number, required: true },
    hiringReady: { type: Number, required: true }
  },
  repos: [{
    name: String,
    stars: Number,
    language: String,
    description: String
  }],
  languages: [{
    name: String,
    percentage: Number,
    color: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // TTL: 24 hours in seconds
  }
});

// Create TTL index for automatic expiration after 24 hours
reportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
