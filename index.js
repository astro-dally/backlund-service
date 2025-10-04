require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ==================== SCHEMAS ====================

// User Schema
const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: String,
  email: { type: String, required: true },
  avatar: String,
  profileUrl: String,
  accessToken: String,
  role: { type: String, enum: ['contributor', 'mentor', 'both'], default: 'contributor' },
  timezone: String,
  preferredLanguage: String,
  phoneNumber: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// GitHub Profile Schema
const githubProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  githubUsername: { type: String, required: true, unique: true },
  githubId: { type: String, required: true, unique: true },
  profileUrl: String,
  bio: String,
  company: String,
  location: String,
  blogUrl: String,
  twitterUsername: String,
  publicRepos: { type: Number, default: 0 },
  publicGists: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  totalStarsReceived: { type: Number, default: 0 },
  totalCommits: { type: Number, default: 0 },
  accountCreatedAt: Date,
  lastSyncedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Mentor Profile Schema
const mentorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: String,
  headline: String,
  hourlyRate: { type: Number, default: 0 },
  yearsOfExperience: Number,
  overallRating: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  completedSessions: { type: Number, default: 0 },
  cancelledSessions: { type: Number, default: 0 },
  clarityRating: { type: Number, default: 0 },
  patienceRating: { type: Number, default: 0 },
  responseTimeRating: { type: Number, default: 0 },
  problemSolvingRating: { type: Number, default: 0 },
  followupRating: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  availableForFreeSession: { type: Boolean, default: false },
  minSessionDuration: { type: Number, default: 30 },
  maxSessionDuration: { type: Number, default: 120 },
  studentSuccessRate: Number,
  repeatStudentRate: Number,
  avgResponseTime: Number,
  teachingStyle: [String],
  studentLevelPreference: [String]
}, { timestamps: true });

// Contributor Profile Schema
const contributorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: String,
  interests: [String],
  currentSkillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  learningGoals: [String],
  workingOnRepos: [String],
  targetCompetitions: [String],
  preferredSessionDuration: { type: Number, default: 60 },
  preferredTeachingStyle: [String],
  budgetPerHour: Number
}, { timestamps: true });

// Mentor Skill Schema
const mentorSkillSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  skillName: { type: String, required: true },
  proficiencyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], required: true },
  yearsOfExperience: Number,
  isPrimarySkill: { type: Boolean, default: false },
  sessionCountForSkill: { type: Number, default: 0 },
  avgRatingForSkill: { type: Number, default: 0 },
  lastTaughtAt: Date
});
mentorSkillSchema.index({ mentorProfileId: 1, skillName: 1 }, { unique: true });

// Mentor Expertise Schema
const mentorExpertiseSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  expertiseArea: { type: String, required: true },
  subExpertise: String,
  proficiencyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  sessionCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 }
});
mentorExpertiseSchema.index({ mentorProfileId: 1, expertiseArea: 1, subExpertise: 1 }, { unique: true });

// Mentor Specialization Schema
const mentorSpecializationSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  specializationType: { type: String, required: true },
  proficiencyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  sessionCount: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 }
});
mentorSpecializationSchema.index({ mentorProfileId: 1, specializationType: 1 }, { unique: true });

// Work Experience Schema
const workExperienceSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  companyName: { type: String, required: true },
  companyTier: { type: String, enum: ['FAANG', 'Unicorn', 'Startup', 'Enterprise', 'OpenSource'] },
  jobTitle: String,
  startDate: Date,
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  technologiesUsed: [String],
  description: String,
  verificationStatus: { type: String, enum: ['verified', 'unverified', 'pending'], default: 'unverified' }
});

// Certification Schema
const certificationSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  certificationName: { type: String, required: true },
  issuingOrganization: String,
  issueDate: Date,
  expirationDate: Date,
  credentialId: String,
  credentialUrl: String,
  isVerified: { type: Boolean, default: false }
});

// Competition Experience Schema
const competitionExperienceSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  competitionName: { type: String, required: true },
  year: { type: Number, required: true },
  role: { type: String, enum: ['mentor', 'participant', 'winner', 'organizer'] },
  organization: String,
  projectName: String,
  technologiesUsed: [String],
  achievementLevel: { type: String, enum: ['completed', 'winner', 'finalist', 'participant'] },
  projectUrl: String,
  isVerified: { type: Boolean, default: false }
});

// Open Source Achievement Schema
const openSourceAchievementSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  achievementType: { type: String, enum: ['maintainer', 'core-contributor', 'top-contributor'], required: true },
  repoFullName: { type: String, required: true },
  organizationName: String,
  startedAt: Date,
  endedAt: Date,
  isCurrent: { type: Boolean, default: false },
  contributionCount: Number,
  impactScore: { type: Number, min: 1, max: 100 },
  verificationStatus: { type: String, default: 'unverified' }
}, { timestamps: true });

// Mentor Badge Schema
const mentorBadgeSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  badgeName: { type: String, required: true },
  badgeType: { type: String, enum: ['achievement', 'skill', 'experience', 'rating'] },
  description: String,
  earnedAt: { type: Date, default: Date.now },
  iconUrl: String
});

// Mentor Availability Schema
const mentorAvailabilitySchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: String,
  isRecurring: { type: Boolean, default: true }
});

// Mentor Unavailable Date Schema
const mentorUnavailableDateSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  date: { type: Date, required: true },
  reason: String
});

// GitHub Contribution Schema
const githubContributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  commitCount: { type: Number, default: 0 },
  prCount: { type: Number, default: 0 },
  issueCount: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
});
githubContributionSchema.index({ userId: 1, date: 1 }, { unique: true });

// Session Schema
const sessionSchema = new mongoose.Schema({
  contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledStartTime: { type: String, required: true },
  scheduledEndTime: { type: String, required: true },
  actualStartTime: Date,
  actualEndTime: Date,
  durationMinutes: Number,
  topic: String,
  description: String,
  problemType: String,
  technologies: [String],
  difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  relatedRepo: String,
  relatedCompetition: String,
  prUrl: String,
  issueUrl: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'], default: 'pending' },
  meetingLink: String,
  recordingUrl: String,
  notes: String,
  problemSolved: Boolean,
  prMerged: Boolean,
  followUpNeeded: Boolean,
  followUpSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  agreedRate: Number,
  actualCost: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' }
}, { timestamps: true });

// Session Review Schema
const sessionReviewSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerType: { type: String, enum: ['contributor', 'mentor'], required: true },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  clarityRating: { type: Number, min: 1, max: 5 },
  patienceRating: { type: Number, min: 1, max: 5 },
  responseTimeRating: { type: Number, min: 1, max: 5 },
  problemSolvingRating: { type: Number, min: 1, max: 5 },
  followupRating: { type: Number, min: 1, max: 5 },
  reviewText: String,
  pros: [String],
  cons: [String],
  wouldRecommend: Boolean,
  wouldBookAgain: Boolean,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });
sessionReviewSchema.index({ sessionId: 1, reviewerId: 1 }, { unique: true });

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testimonialText: { type: String, required: true },
  specificAchievement: String,
  technologiesMentioned: [String],
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

// Search Query Schema
const searchQuerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  searchText: String,
  technologies: [String],
  problemType: String,
  targetRepo: String,
  targetCompetition: String,
  difficultyLevel: String,
  minRating: Number,
  maxHourlyRate: Number,
  requiredBadges: [String],
  timezonePreference: String,
  resultsCount: Number,
  topResultMentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// ==================== MODELS ====================

const User = mongoose.model('User', userSchema);
const GithubProfile = mongoose.model('GithubProfile', githubProfileSchema);
const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);
const ContributorProfile = mongoose.model('ContributorProfile', contributorProfileSchema);
const MentorSkill = mongoose.model('MentorSkill', mentorSkillSchema);
const MentorExpertise = mongoose.model('MentorExpertise', mentorExpertiseSchema);
const MentorSpecialization = mongoose.model('MentorSpecialization', mentorSpecializationSchema);
const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);
const Certification = mongoose.model('Certification', certificationSchema);
const CompetitionExperience = mongoose.model('CompetitionExperience', competitionExperienceSchema);
const OpenSourceAchievement = mongoose.model('OpenSourceAchievement', openSourceAchievementSchema);
const MentorBadge = mongoose.model('MentorBadge', mentorBadgeSchema);
const MentorAvailability = mongoose.model('MentorAvailability', mentorAvailabilitySchema);
const MentorUnavailableDate = mongoose.model('MentorUnavailableDate', mentorUnavailableDateSchema);
const GithubContribution = mongoose.model('GithubContribution', githubContributionSchema);
const Session = mongoose.model('Session', sessionSchema);
const SessionReview = mongoose.model('SessionReview', sessionReviewSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const SearchQuery = mongoose.model('SearchQuery', searchQuerySchema);

// ==================== HELPER FUNCTIONS ====================

function mapGithubDataToUser(githubData) {
  return {
    githubId: githubData.githubId,
    username: githubData.username,
    displayName: githubData.displayName,
    email: githubData.email,
    avatar: githubData.avatar,
    profileUrl: githubData.profileUrl,
    accessToken: githubData.accessToken
  };
}

function mapGithubDataToProfile(userId, githubData) {
  const profile = githubData.githubData?.profile || {};
  const summary = githubData.githubData?.summary || {};
  return {
    userId,
    githubUsername: githubData.username,
    githubId: githubData.githubId,
    profileUrl: githubData.profileUrl || null,
    bio: profile.bio || null,
    company: profile.company || null,
    location: profile.location || null,
    blogUrl: profile.websiteUrl || null,
    twitterUsername: profile.twitterUsername || null,
    publicRepos: summary.totalRepositories ?? 0,
    publicGists: summary.gists ?? 0,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    totalStarsReceived: summary.totalStars ?? 0,
    totalCommits: summary.totalCommits ?? 0,
    accountCreatedAt: profile.createdAt ? new Date(profile.createdAt) : null,
    lastSyncedAt: githubData.githubData?.lastFetched ? new Date(githubData.githubData.lastFetched) : new Date()
  };
}

function identifyMissingFields(user, githubProfile) {
  const missing = [];
  
  // User fields
  if (!user.timezone) missing.push('timezone');
  if (!user.phoneNumber) missing.push('phone_number');
  if (!user.preferredLanguage) missing.push('preferredLanguage');
  
  // GitHub profile fields that might be useful
  if (!githubProfile.bio) missing.push('bio');
  if (!githubProfile.company) missing.push('company');
  if (!githubProfile.location) missing.push('location');
  if (!githubProfile.blogUrl) missing.push('blogUrl');
  
  return missing;
}

async function updateMentorRatings(mentorProfileId) {
  const reviews = await SessionReview.find({ revieweeId: mentorProfileId, reviewerType: 'contributor' });
  if (reviews.length === 0) return;

  const totals = reviews.reduce((acc, r) => ({
    overall: acc.overall + r.overallRating,
    clarity: acc.clarity + (r.clarityRating || 0),
    patience: acc.patience + (r.patienceRating || 0),
    responseTime: acc.responseTime + (r.responseTimeRating || 0),
    problemSolving: acc.problemSolving + (r.problemSolvingRating || 0),
    followup: acc.followup + (r.followupRating || 0)
  }), { overall: 0, clarity: 0, patience: 0, responseTime: 0, problemSolving: 0, followup: 0 });

  await MentorProfile.findByIdAndUpdate(mentorProfileId, {
    overallRating: totals.overall / reviews.length,
    clarityRating: totals.clarity / reviews.length,
    patienceRating: totals.patience / reviews.length,
    responseTimeRating: totals.responseTime / reviews.length,
    problemSolvingRating: totals.problemSolving / reviews.length,
    followupRating: totals.followup / reviews.length
  });
}

// ==================== ROUTES ====================

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ==================== AUTH & INITIAL SETUP ====================

app.post('/api/auth/github-callback', async (req, res) => {
  try {
    const { githubData } = req.body;
    
    if (!githubData || !githubData.githubId || !githubData.username || !githubData.email) {
      return res.status(400).json({ success: false, message: 'Invalid GitHub data' });
    }

    let user = await User.findOne({ githubId: githubData.githubId });
    
    if (!user) {
      const userData = mapGithubDataToUser(githubData);
      user = await User.create(userData);
    } else {
      await User.findByIdAndUpdate(user._id, mapGithubDataToUser(githubData));
    }

    let githubProfile = await GithubProfile.findOne({ userId: user._id });
    const profileData = mapGithubDataToProfile(user._id, githubData);
    
    if (!githubProfile) {
      githubProfile = await GithubProfile.create(profileData);
    } else {
      await GithubProfile.findByIdAndUpdate(githubProfile._id, profileData);
    }

    let contributorProfile = await ContributorProfile.findOne({ userId: user._id });
    if (!contributorProfile) {
      contributorProfile = await ContributorProfile.create({ userId: user._id });
    }

    const missingFields = identifyMissingFields(user, githubProfile);

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        githubProfileId: githubProfile._id
      },
      missingFields
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== USER PROFILE MANAGEMENT ====================

app.get('/api/profile/complete/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const githubProfile = await GithubProfile.findOne({ userId: user._id });
    const contributorProfile = await ContributorProfile.findOne({ userId: user._id });
    const mentorProfile = await MentorProfile.findOne({ userId: user._id });

    return res.json({
      user,
      githubProfile,
      contributorProfile,
      mentorProfile
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/profile/user/:userId', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/profile/mentor/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let mentorProfile = await MentorProfile.findOne({ userId: user._id });
    if (mentorProfile) return res.status(409).json({ message: 'Mentor profile already exists' });

    mentorProfile = await MentorProfile.create({ userId: user._id, ...req.body });
    
    await User.findByIdAndUpdate(user._id, { role: user.role === 'contributor' ? 'both' : 'mentor' });

    return res.status(201).json(mentorProfile);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/profile/mentor/:userId', async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
    if (!mentorProfile) return res.status(404).json({ message: 'Mentor profile not found' });
    return res.json(mentorProfile);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/profile/contributor/:userId', async (req, res) => {
  try {
    const contributorProfile = await ContributorProfile.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
    if (!contributorProfile) return res.status(404).json({ message: 'Contributor profile not found' });
    return res.json(contributorProfile);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== GITHUB DATA ====================

app.get('/api/github/profile/:userId', async (req, res) => {
  try {
    const profile = await GithubProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'GitHub profile not found' });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/github/sync-contributions', async (req, res) => {
  try {
    const { userId, contributions } = req.body;
    if (!userId || !Array.isArray(contributions)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const results = await Promise.all(contributions.map(c => 
      GithubContribution.findOneAndUpdate(
        { userId, date: new Date(c.date) },
        { ...c, userId },
        { upsert: true, new: true }
      )
    ));

    return res.json({ success: true, count: results.length });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== MENTOR SKILLS ====================

app.post('/api/mentor/:mentorProfileId/skills', async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) return res.status(400).json({ message: 'Skills must be an array' });

    const created = await Promise.all(skills.map(s => 
      MentorSkill.findOneAndUpdate(
        { mentorProfileId: req.params.mentorProfileId, skillName: s.skillName },
        { ...s, mentorProfileId: req.params.mentorProfileId },
        { upsert: true, new: true }
      )
    ));

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/skills', async (req, res) => {
  try {
    const skills = await MentorSkill.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/mentor/:mentorProfileId/skills/:skillId', async (req, res) => {
  try {
    await MentorSkill.findByIdAndDelete(req.params.skillId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== MENTOR EXPERTISE ====================

app.post('/api/mentor/:mentorProfileId/expertise', async (req, res) => {
  try {
    const { expertiseAreas } = req.body;
    if (!Array.isArray(expertiseAreas)) return res.status(400).json({ message: 'Expertise areas must be an array' });

    const created = await Promise.all(expertiseAreas.map(e => 
      MentorExpertise.findOneAndUpdate(
        { 
          mentorProfileId: req.params.mentorProfileId, 
          expertiseArea: e.expertiseArea,
          subExpertise: e.subExpertise 
        },
        { ...e, mentorProfileId: req.params.mentorProfileId },
        { upsert: true, new: true }
      )
    ));

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/expertise', async (req, res) => {
  try {
    const expertise = await MentorExpertise.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(expertise);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== MENTOR SPECIALIZATIONS ====================

app.post('/api/mentor/:mentorProfileId/specializations', async (req, res) => {
  try {
    const { specializations } = req.body;
    if (!Array.isArray(specializations)) return res.status(400).json({ message: 'Specializations must be an array' });

    const created = await Promise.all(specializations.map(s => 
      MentorSpecialization.findOneAndUpdate(
        { 
          mentorProfileId: req.params.mentorProfileId, 
          specializationType: s.specializationType 
        },
        { ...s, mentorProfileId: req.params.mentorProfileId },
        { upsert: true, new: true }
      )
    ));

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/specializations', async (req, res) => {
  try {
    const specializations = await MentorSpecialization.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(specializations);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== WORK EXPERIENCE ====================

app.post('/api/mentor/:mentorProfileId/experience', async (req, res) => {
  try {
    const experience = await WorkExperience.create({ ...req.body, mentorProfileId: req.params.mentorProfileId });
    return res.status(201).json(experience);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/experience', async (req, res) => {
  try {
    const experiences = await WorkExperience.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(experiences);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/mentor/:mentorProfileId/experience/:experienceId', async (req, res) => {
  try {
    const updated = await WorkExperience.findByIdAndUpdate(req.params.experienceId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Experience not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/mentor/:mentorProfileId/experience/:experienceId', async (req, res) => {
  try {
    await WorkExperience.findByIdAndDelete(req.params.experienceId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== CERTIFICATIONS ====================

app.post('/api/mentor/:mentorProfileId/certifications', async (req, res) => {
  try {
    const cert = await Certification.create({ ...req.body, mentorProfileId: req.params.mentorProfileId });
    return res.status(201).json(cert);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/certifications', async (req, res) => {
  try {
    const certs = await Certification.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(certs);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/mentor/:mentorProfileId/certifications/:certId', async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.certId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== COMPETITIONS ====================

app.post('/api/mentor/:mentorProfileId/competitions', async (req, res) => {
  try {
    const comp = await CompetitionExperience.create({ ...req.body, mentorProfileId: req.params.mentorProfileId });
    return res.status(201).json(comp);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/competitions', async (req, res) => {
  try {
    const comps = await CompetitionExperience.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(comps);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/mentor/:mentorProfileId/competitions/:compId', async (req, res) => {
  try {
    const updated = await CompetitionExperience.findByIdAndUpdate(req.params.compId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Competition not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/mentor/:mentorProfileId/competitions/:compId', async (req, res) => {
  try {
    await CompetitionExperience.findByIdAndDelete(req.params.compId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== OPEN SOURCE ACHIEVEMENTS ====================

app.post('/api/mentor/:mentorProfileId/opensource', async (req, res) => {
  try {
    const achievement = await OpenSourceAchievement.create({ ...req.body, mentorProfileId: req.params.mentorProfileId });
    return res.status(201).json(achievement);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/opensource', async (req, res) => {
  try {
    const achievements = await OpenSourceAchievement.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(achievements);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== BADGES ====================

app.post('/api/mentor/:mentorProfileId/badges', async (req, res) => {
  try {
    const badge = await MentorBadge.create({ ...req.body, mentorProfileId: req.params.mentorProfileId });
    return res.status(201).json(badge);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/badges', async (req, res) => {
  try {
    const badges = await MentorBadge.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(badges);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== AVAILABILITY ====================

app.post('/api/mentor/:mentorProfileId/availability', async (req, res) => {
  try {
    const { schedule } = req.body;
    if (!Array.isArray(schedule)) return res.status(400).json({ message: 'Schedule must be an array' });

    await MentorAvailability.deleteMany({ mentorProfileId: req.params.mentorProfileId });

    const created = await MentorAvailability.insertMany(
      schedule.map(s => ({ ...s, mentorProfileId: req.params.mentorProfileId }))
    );

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/availability', async (req, res) => {
  try {
    const availability = await MentorAvailability.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(availability);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/mentor/:mentorProfileId/unavailable', async (req, res) => {
  try {
    const unavailable = await MentorUnavailableDate.create({ ...req.body, mentorProfileId: req.params.mentorProfileId });
    return res.status(201).json(unavailable);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/mentor/:mentorProfileId/unavailable', async (req, res) => {
  try {
    const unavailable = await MentorUnavailableDate.find({ mentorProfileId: req.params.mentorProfileId });
    return res.json(unavailable);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== COMPLETE MENTOR PROFILE ====================

app.get('/api/mentor/:mentorProfileId/complete', async (req, res) => {
  try {
    const profile = await MentorProfile.findById(req.params.mentorProfileId);
    if (!profile) return res.status(404).json({ message: 'Mentor profile not found' });

    const [skills, expertise, specializations, experience, certifications, competitions, opensource, badges, availability] = await Promise.all([
      MentorSkill.find({ mentorProfileId: profile._id }),
      MentorExpertise.find({ mentorProfileId: profile._id }),
      MentorSpecialization.find({ mentorProfileId: profile._id }),
      WorkExperience.find({ mentorProfileId: profile._id }),
      Certification.find({ mentorProfileId: profile._id }),
      CompetitionExperience.find({ mentorProfileId: profile._id }),
      OpenSourceAchievement.find({ mentorProfileId: profile._id }),
      MentorBadge.find({ mentorProfileId: profile._id }),
      MentorAvailability.find({ mentorProfileId: profile._id })
    ]);

    return res.json({
      profile,
      skills,
      expertise,
      specializations,
      experience,
      certifications,
      competitions,
      opensource,
      badges,
      availability
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SESSIONS ====================

app.post('/api/sessions', async (req, res) => {
  try {
    const session = await Session.create(req.body);
    
    const mentor = await MentorProfile.findOne({ userId: req.body.mentorId });
    if (mentor) {
      await MentorProfile.findByIdAndUpdate(mentor._id, { $inc: { totalSessions: 1 } });
    }

    return res.status(201).json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('contributorId', 'username displayName avatar')
      .populate('mentorId', 'username displayName avatar');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/sessions/user/:userId', async (req, res) => {
  try {
    const { role, status } = req.query;
    const query = {};
    
    if (role === 'mentor') query.mentorId = req.params.userId;
    else if (role === 'contributor') query.contributorId = req.params.userId;
    else {
      query.$or = [{ mentorId: req.params.userId }, { contributorId: req.params.userId }];
    }

    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate('contributorId', 'username displayName avatar')
      .populate('mentorId', 'username displayName avatar')
      .sort({ scheduledDate: -1 });

    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/sessions/:sessionId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findByIdAndUpdate(req.params.sessionId, { status }, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const mentor = await MentorProfile.findOne({ userId: session.mentorId });
    if (mentor) {
      if (status === 'completed') {
        await MentorProfile.findByIdAndUpdate(mentor._id, { $inc: { completedSessions: 1 } });
      } else if (status === 'cancelled') {
        await MentorProfile.findByIdAndUpdate(mentor._id, { $inc: { cancelledSessions: 1 } });
      }
    }

    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/sessions/:sessionId/outcome', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.sessionId, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    return res.json(session);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/sessions/stats/:userId', async (req, res) => {
  try {
    const { role } = req.query;
    const query = role === 'mentor' ? { mentorId: req.params.userId } : { contributorId: req.params.userId };

    const sessions = await Session.find(query);
    const stats = {
      total: sessions.length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
      pending: sessions.filter(s => s.status === 'pending').length,
      totalMinutes: sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
    };

    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== REVIEWS ====================

app.post('/api/sessions/:sessionId/reviews', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const review = await SessionReview.create({ ...req.body, sessionId: session._id });

    if (req.body.reviewerType === 'contributor') {
      const mentor = await MentorProfile.findOne({ userId: req.body.revieweeId });
      if (mentor) {
        await updateMentorRatings(mentor._id);
      }
    }

    return res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Review already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/sessions/:sessionId/reviews', async (req, res) => {
  try {
    const reviews = await SessionReview.find({ sessionId: req.params.sessionId })
      .populate('reviewerId', 'username displayName avatar')
      .populate('revieweeId', 'username displayName avatar');
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/sessions/mentor/:mentorId/reviews', async (req, res) => {
  try {
    const { minRating, limit } = req.query;
    const query = { revieweeId: req.params.mentorId, reviewerType: 'contributor' };
    
    if (minRating) query.overallRating = { $gte: parseFloat(minRating) };

    const reviews = await SessionReview.find(query)
      .populate('reviewerId', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 100);

    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SEARCH & MATCHING ====================

app.post('/api/search/mentors', async (req, res) => {
  try {
    const { technologies, minRating, maxHourlyRate, studentLevel, teachingStyle, timezone } = req.body;

    const query = { isAvailable: true };
    if (minRating) query.overallRating = { $gte: minRating };
    if (maxHourlyRate) query.hourlyRate = { $lte: maxHourlyRate };
    if (studentLevel) query.studentLevelPreference = studentLevel;
    if (teachingStyle) query.teachingStyle = { $in: Array.isArray(teachingStyle) ? teachingStyle : [teachingStyle] };

    let mentors = await MentorProfile.find(query).populate('userId', 'username displayName avatar timezone');

    if (technologies && Array.isArray(technologies) && technologies.length > 0) {
      const mentorIds = mentors.map(m => m._id);
      const skills = await MentorSkill.find({ 
        mentorProfileId: { $in: mentorIds },
        skillName: { $in: technologies }
      });

      const mentorSkillMap = {};
      skills.forEach(s => {
        if (!mentorSkillMap[s.mentorProfileId]) mentorSkillMap[s.mentorProfileId] = [];
        mentorSkillMap[s.mentorProfileId].push(s);
      });

      mentors = mentors.filter(m => mentorSkillMap[m._id]).map(m => ({
        ...m.toObject(),
        matchingSkills: mentorSkillMap[m._id]
      }));
    }

    if (req.body.userId) {
      await SearchQuery.create({
        userId: req.body.userId,
        ...req.body,
        resultsCount: mentors.length,
        topResultMentorId: mentors[0]?.userId
      });
    }

    return res.json({ count: mentors.length, mentors });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/search/top-mentors', async (req, res) => {
  try {
    const { technology, limit } = req.query;
    const limitNum = limit ? parseInt(limit) : 10;

    let mentors = await MentorProfile.find({ isAvailable: true })
      .populate('userId', 'username displayName avatar')
      .sort({ overallRating: -1, completedSessions: -1 })
      .limit(limitNum);

    if (technology) {
      const mentorIds = mentors.map(m => m._id);
      const skills = await MentorSkill.find({ 
        mentorProfileId: { $in: mentorIds },
        skillName: technology
      }).sort({ avgRatingForSkill: -1 });

      const skillMap = {};
      skills.forEach(s => { skillMap[s.mentorProfileId.toString()] = s; });

      mentors = mentors
        .filter(m => skillMap[m._id.toString()])
        .map(m => ({ ...m.toObject(), technologySkill: skillMap[m._id.toString()] }));
    }

    return res.json(mentors);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== TESTIMONIALS ====================

app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    return res.status(201).json(testimonial);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/testimonials/mentor/:mentorProfileId', async (req, res) => {
  try {
    const { featured } = req.query;
    const query = { mentorProfileId: req.params.mentorProfileId };
    if (featured === 'true') query.isFeatured = true;

    const testimonials = await Testimonial.find(query)
      .populate('contributorId', 'username displayName avatar')
      .sort({ createdAt: -1 });

    return res.json(testimonials);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SERVER START ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/backlund';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 API listening on :${PORT}`);
    console.log(`📦 Connected to MongoDB`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
