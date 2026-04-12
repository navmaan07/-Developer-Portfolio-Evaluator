import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  name: String,
  bio: String,
  blog: String,
  location: String,
  email: String,
  company: String,
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  publicRepos: {
    type: Number,
    default: 0
  },
  publicGists: {
    type: Number,
    default: 0
  },
  hireable: Boolean,
  createdAt: Date,
  updatedAt: Date,

  // Scoring data
  scores: {
    activity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    codeQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    diversity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    community: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    hiringReady: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    overall: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // Repository data
  topRepos: [{
    name: String,
    fullName: String,
    description: String,
    url: String,
    stars: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    },
    language: String,
    topics: [String],
    hasReadme: Boolean,
    hasLicense: Boolean,
    hasTests: Boolean,
    createdAt: Date,
    updatedAt: Date
  }],

  // Language distribution
  languages: [{
    name: String,
    percentage: Number,
    color: String,
    bytes: Number
  }],

  // Activity data for heatmap
  heatmapData: mongoose.Schema.Types.Mixed,

  // Contribution statistics
  contributions: {
    totalCommits: Number,
    commitsLast90Days: Number,
    longestStreak: Number,
    currentStreak: Number,
    totalPRs: Number,
    totalIssues: Number
  },

  // Shareable URL
  shareUrl: String,

  // Caching metadata
  cachedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    index: { expires: 0 } // TTL index
  }
}, {
  timestamps: true
});

// Create TTL index for automatic expiration after 24 hours
reportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to update shareUrl
reportSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('username')) {
    this.shareUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/report/${this.username}`;
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
