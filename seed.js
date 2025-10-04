const mongoose = require('mongoose');

// ==================== SCHEMAS ====================

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

const mentorExpertiseSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  expertiseArea: { type: String, required: true },
  subExpertise: String,
  proficiencyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  sessionCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 }
});
mentorExpertiseSchema.index({ mentorProfileId: 1, expertiseArea: 1, subExpertise: 1 }, { unique: true });

const mentorSpecializationSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  specializationType: { type: String, required: true },
  proficiencyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  sessionCount: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 }
});
mentorSpecializationSchema.index({ mentorProfileId: 1, specializationType: 1 }, { unique: true });

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

const mentorBadgeSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  badgeName: { type: String, required: true },
  badgeType: { type: String, enum: ['achievement', 'skill', 'experience', 'rating'] },
  description: String,
  earnedAt: { type: Date, default: Date.now },
  iconUrl: String
});

const mentorAvailabilitySchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: String,
  isRecurring: { type: Boolean, default: true }
});

const mentorUnavailableDateSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  date: { type: Date, required: true },
  reason: String
});

const githubContributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  commitCount: { type: Number, default: 0 },
  prCount: { type: Number, default: 0 },
  issueCount: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
});
githubContributionSchema.index({ userId: 1, date: 1 }, { unique: true });

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

const testimonialSchema = new mongoose.Schema({
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile', required: true },
  contributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testimonialText: { type: String, required: true },
  specificAchievement: String,
  technologiesMentioned: [String],
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

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

// ==================== SEED DATA ====================

async function seedDatabase() {
  try {
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      GithubProfile.deleteMany({}),
      MentorProfile.deleteMany({}),
      ContributorProfile.deleteMany({}),
      MentorSkill.deleteMany({}),
      MentorExpertise.deleteMany({}),
      MentorSpecialization.deleteMany({}),
      WorkExperience.deleteMany({}),
      Certification.deleteMany({}),
      CompetitionExperience.deleteMany({}),
      OpenSourceAchievement.deleteMany({}),
      MentorBadge.deleteMany({}),
      MentorAvailability.deleteMany({}),
      MentorUnavailableDate.deleteMany({}),
      GithubContribution.deleteMany({}),
      Session.deleteMany({}),
      SessionReview.deleteMany({}),
      Testimonial.deleteMany({}),
      SearchQuery.deleteMany({})
    ]);

    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        githubId: '151390316',
        username: 'MUFFANUJ',
        displayName: 'ANUJ KUMAR SINGH',
        email: 'anujsinghhero292@gmail.com',
        avatar: 'https://avatars.githubusercontent.com/u/151390316?v=4',
        profileUrl: 'https://github.com/MUFFANUJ',
        role: 'both',
        timezone: 'Asia/Kolkata',
        preferredLanguage: 'English',
        phoneNumber: '+91-9876543210',
        isActive: true
      },
      {
        githubId: '1234567',
        username: 'sarahdev',
        displayName: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/1234567?v=4',
        profileUrl: 'https://github.com/sarahdev',
        role: 'mentor',
        timezone: 'America/New_York',
        preferredLanguage: 'English',
        phoneNumber: '+1-555-0101',
        isActive: true
      },
      {
        githubId: '2345678',
        username: 'codemaster_raj',
        displayName: 'Raj Patel',
        email: 'raj.patel@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/2345678?v=4',
        profileUrl: 'https://github.com/codemaster_raj',
        role: 'mentor',
        timezone: 'Asia/Kolkata',
        preferredLanguage: 'English',
        phoneNumber: '+91-9876543211',
        isActive: true
      },
      {
        githubId: '3456789',
        username: 'maria_frontend',
        displayName: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/3456789?v=4',
        profileUrl: 'https://github.com/maria_frontend',
        role: 'mentor',
        timezone: 'Europe/Madrid',
        preferredLanguage: 'Spanish',
        phoneNumber: '+34-612-345-678',
        isActive: true
      },
      {
        githubId: '4567890',
        username: 'john_beginner',
        displayName: 'John Smith',
        email: 'john.smith@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/4567890?v=4',
        profileUrl: 'https://github.com/john_beginner',
        role: 'contributor',
        timezone: 'America/Los_Angeles',
        preferredLanguage: 'English',
        phoneNumber: '+1-555-0102',
        isActive: true
      },
      {
        githubId: '5678901',
        username: 'alice_learner',
        displayName: 'Alice Wong',
        email: 'alice.wong@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/5678901?v=4',
        profileUrl: 'https://github.com/alice_learner',
        role: 'contributor',
        timezone: 'Asia/Singapore',
        preferredLanguage: 'English',
        phoneNumber: '+65-8123-4567',
        isActive: true
      }
    ]);

    console.log('📊 Creating GitHub profiles...');
    const githubProfiles = await GithubProfile.insertMany([
      {
        userId: users[0]._id,
        githubUsername: 'MUFFANUJ',
        githubId: '151390316',
        profileUrl: 'https://github.com/MUFFANUJ',
        bio: 'Probably Debugging now ;)',
        company: null,
        location: 'Earth',
        blogUrl: null,
        twitterUsername: null,
        publicRepos: 77,
        publicGists: 0,
        followers: 8,
        following: 1,
        totalStarsReceived: 0,
        totalCommits: 139,
        accountCreatedAt: new Date('2023-11-18T16:25:40.000Z'),
        lastSyncedAt: new Date('2025-10-04T19:24:54.513Z')
      },
      {
        userId: users[1]._id,
        githubUsername: 'sarahdev',
        githubId: '1234567',
        profileUrl: 'https://github.com/sarahdev',
        bio: 'Senior Full Stack Developer | Open Source Contributor',
        company: 'Google',
        location: 'New York, USA',
        blogUrl: 'https://sarahdev.blog',
        twitterUsername: 'sarahdev',
        publicRepos: 145,
        publicGists: 23,
        followers: 1250,
        following: 89,
        totalStarsReceived: 3500,
        totalCommits: 2847,
        accountCreatedAt: new Date('2018-03-15T10:30:00.000Z'),
        lastSyncedAt: new Date()
      },
      {
        userId: users[2]._id,
        githubUsername: 'codemaster_raj',
        githubId: '2345678',
        profileUrl: 'https://github.com/codemaster_raj',
        bio: 'Backend enthusiast | Node.js expert | GSoC Mentor',
        company: 'Microsoft',
        location: 'Bangalore, India',
        blogUrl: 'https://rajcodes.dev',
        twitterUsername: 'rajcodes',
        publicRepos: 98,
        publicGists: 15,
        followers: 892,
        following: 45,
        totalStarsReceived: 2100,
        totalCommits: 1956,
        accountCreatedAt: new Date('2019-06-20T08:15:00.000Z'),
        lastSyncedAt: new Date()
      },
      {
        userId: users[3]._id,
        githubUsername: 'maria_frontend',
        githubId: '3456789',
        profileUrl: 'https://github.com/maria_frontend',
        bio: 'React & Vue specialist | UI/UX lover',
        company: 'Amazon',
        location: 'Madrid, Spain',
        blogUrl: null,
        twitterUsername: 'maria_codes',
        publicRepos: 67,
        publicGists: 8,
        followers: 567,
        following: 123,
        totalStarsReceived: 1200,
        totalCommits: 1234,
        accountCreatedAt: new Date('2020-01-10T14:20:00.000Z'),
        lastSyncedAt: new Date()
      },
      {
        userId: users[4]._id,
        githubUsername: 'john_beginner',
        githubId: '4567890',
        profileUrl: 'https://github.com/john_beginner',
        bio: 'Learning to code | Open source enthusiast',
        company: null,
        location: 'San Francisco, USA',
        blogUrl: null,
        twitterUsername: null,
        publicRepos: 12,
        publicGists: 2,
        followers: 15,
        following: 45,
        totalStarsReceived: 5,
        totalCommits: 156,
        accountCreatedAt: new Date('2024-01-15T09:00:00.000Z'),
        lastSyncedAt: new Date()
      },
      {
        userId: users[5]._id,
        githubUsername: 'alice_learner',
        githubId: '5678901',
        profileUrl: 'https://github.com/alice_learner',
        bio: 'Computer Science student | Aspiring developer',
        company: null,
        location: 'Singapore',
        blogUrl: null,
        twitterUsername: 'alice_learns',
        publicRepos: 8,
        publicGists: 1,
        followers: 23,
        following: 67,
        totalStarsReceived: 3,
        totalCommits: 89,
        accountCreatedAt: new Date('2024-03-20T11:30:00.000Z'),
        lastSyncedAt: new Date()
      }
    ]);

    console.log('🎓 Creating mentor profiles...');
    const mentorProfiles = await MentorProfile.insertMany([
      {
        userId: users[0]._id,
        bio: 'Passionate about helping developers grow. Experienced in React, Node.js, and debugging complex systems.',
        headline: 'Full Stack Developer | Open Source Contributor',
        hourlyRate: 50,
        yearsOfExperience: 2,
        overallRating: 4.7,
        totalSessions: 15,
        completedSessions: 13,
        cancelledSessions: 2,
        clarityRating: 4.8,
        patienceRating: 4.6,
        responseTimeRating: 4.7,
        problemSolvingRating: 4.9,
        followupRating: 4.5,
        isAvailable: true,
        availableForFreeSession: true,
        minSessionDuration: 30,
        maxSessionDuration: 120,
        studentSuccessRate: 87.5,
        repeatStudentRate: 45.2,
        avgResponseTime: 2.5,
        teachingStyle: ['hands-on', 'practical', 'patient'],
        studentLevelPreference: ['beginner', 'intermediate']
      },
      {
        userId: users[1]._id,
        bio: 'Senior engineer with 8+ years at FAANG. Specialized in system design, scalability, and mentoring junior devs.',
        headline: 'Senior Full Stack Engineer @ Google | System Design Expert',
        hourlyRate: 150,
        yearsOfExperience: 8,
        overallRating: 4.9,
        totalSessions: 87,
        completedSessions: 82,
        cancelledSessions: 5,
        clarityRating: 4.9,
        patienceRating: 5.0,
        responseTimeRating: 4.8,
        problemSolvingRating: 5.0,
        followupRating: 4.7,
        isAvailable: true,
        availableForFreeSession: false,
        minSessionDuration: 60,
        maxSessionDuration: 180,
        studentSuccessRate: 94.2,
        repeatStudentRate: 68.5,
        avgResponseTime: 1.2,
        teachingStyle: ['structured', 'in-depth', 'professional'],
        studentLevelPreference: ['intermediate', 'advanced']
      },
      {
        userId: users[2]._id,
        bio: 'Backend wizard and GSoC mentor. Love teaching Node.js, databases, and API design.',
        headline: 'Backend Architect @ Microsoft | GSoC Mentor',
        hourlyRate: 120,
        yearsOfExperience: 6,
        overallRating: 4.8,
        totalSessions: 56,
        completedSessions: 53,
        cancelledSessions: 3,
        clarityRating: 4.7,
        patienceRating: 4.9,
        responseTimeRating: 4.8,
        problemSolvingRating: 4.9,
        followupRating: 4.6,
        isAvailable: true,
        availableForFreeSession: false,
        minSessionDuration: 45,
        maxSessionDuration: 150,
        studentSuccessRate: 91.8,
        repeatStudentRate: 58.3,
        avgResponseTime: 1.8,
        teachingStyle: ['example-driven', 'patient', 'thorough'],
        studentLevelPreference: ['beginner', 'intermediate', 'advanced']
      },
      {
        userId: users[3]._id,
        bio: 'Frontend specialist passionate about creating beautiful UIs. React, Vue, and modern CSS expert.',
        headline: 'Senior Frontend Developer @ Amazon | UI/UX Enthusiast',
        hourlyRate: 100,
        yearsOfExperience: 5,
        overallRating: 4.6,
        totalSessions: 42,
        completedSessions: 39,
        cancelledSessions: 3,
        clarityRating: 4.7,
        patienceRating: 4.5,
        responseTimeRating: 4.6,
        problemSolvingRating: 4.7,
        followupRating: 4.4,
        isAvailable: true,
        availableForFreeSession: true,
        minSessionDuration: 30,
        maxSessionDuration: 120,
        studentSuccessRate: 88.9,
        repeatStudentRate: 52.1,
        avgResponseTime: 2.1,
        teachingStyle: ['visual', 'interactive', 'creative'],
        studentLevelPreference: ['beginner', 'intermediate']
      }
    ]);

    console.log('📚 Creating contributor profiles...');
    await ContributorProfile.insertMany([
      {
        userId: users[0]._id,
        bio: 'Learning new technologies and contributing to open source',
        interests: ['React', 'Node.js', 'GraphQL'],
        currentSkillLevel: 'intermediate',
        learningGoals: ['Master TypeScript', 'Learn system design', 'Contribute to major OSS'],
        workingOnRepos: ['facebook/react', 'microsoft/typescript'],
        targetCompetitions: ['GSoC 2026', 'Hacktoberfest 2025'],
        preferredSessionDuration: 60,
        preferredTeachingStyle: ['hands-on', 'practical'],
        budgetPerHour: 60
      },
      {
        userId: users[4]._id,
        bio: 'Career switcher learning web development',
        interests: ['JavaScript', 'React', 'HTML/CSS'],
        currentSkillLevel: 'beginner',
        learningGoals: ['Build a portfolio website', 'Learn React fundamentals', 'Get first dev job'],
        workingOnRepos: ['freeCodeCamp/freeCodeCamp'],
        targetCompetitions: ['Hacktoberfest 2025'],
        preferredSessionDuration: 90,
        preferredTeachingStyle: ['patient', 'step-by-step'],
        budgetPerHour: 40
      },
      {
        userId: users[5]._id,
        bio: 'CS student passionate about backend development',
        interests: ['Python', 'Node.js', 'Databases', 'APIs'],
        currentSkillLevel: 'beginner',
        learningGoals: ['Master REST APIs', 'Learn database design', 'Contribute to Django'],
        workingOnRepos: ['django/django', 'expressjs/express'],
        targetCompetitions: ['GSoC 2026'],
        preferredSessionDuration: 60,
        preferredTeachingStyle: ['structured', 'example-driven'],
        budgetPerHour: 50
      }
    ]);

    console.log('💡 Creating mentor skills...');
    await MentorSkill.insertMany([
      // ANUJ's skills
      { mentorProfileId: mentorProfiles[0]._id, skillName: 'React', proficiencyLevel: 'advanced', yearsOfExperience: 2, isPrimarySkill: true, sessionCountForSkill: 8, avgRatingForSkill: 4.7, lastTaughtAt: new Date() },
      { mentorProfileId: mentorProfiles[0]._id, skillName: 'Node.js', proficiencyLevel: 'advanced', yearsOfExperience: 2, isPrimarySkill: false, sessionCountForSkill: 5, avgRatingForSkill: 4.6 },
      { mentorProfileId: mentorProfiles[0]._id, skillName: 'JavaScript', proficiencyLevel: 'expert', yearsOfExperience: 3, isPrimarySkill: true, sessionCountForSkill: 10, avgRatingForSkill: 4.8 },
      { mentorProfileId: mentorProfiles[0]._id, skillName: 'MongoDB', proficiencyLevel: 'intermediate', yearsOfExperience: 1, isPrimarySkill: false, sessionCountForSkill: 3, avgRatingForSkill: 4.5 },
      
      // Sarah's skills
      { mentorProfileId: mentorProfiles[1]._id, skillName: 'System Design', proficiencyLevel: 'expert', yearsOfExperience: 8, isPrimarySkill: true, sessionCountForSkill: 35, avgRatingForSkill: 4.9 },
      { mentorProfileId: mentorProfiles[1]._id, skillName: 'React', proficiencyLevel: 'expert', yearsOfExperience: 7, isPrimarySkill: true, sessionCountForSkill: 28, avgRatingForSkill: 4.8 },
      { mentorProfileId: mentorProfiles[1]._id, skillName: 'TypeScript', proficiencyLevel: 'expert', yearsOfExperience: 6, isPrimarySkill: true, sessionCountForSkill: 22, avgRatingForSkill: 4.9 },
      { mentorProfileId: mentorProfiles[1]._id, skillName: 'Python', proficiencyLevel: 'advanced', yearsOfExperience: 8, isPrimarySkill: false, sessionCountForSkill: 15, avgRatingForSkill: 4.7 },
      { mentorProfileId: mentorProfiles[1]._id, skillName: 'GraphQL', proficiencyLevel: 'expert', yearsOfExperience: 5, isPrimarySkill: false, sessionCountForSkill: 12, avgRatingForSkill: 4.8 },
      
      // Raj's skills
      { mentorProfileId: mentorProfiles[2]._id, skillName: 'Node.js', proficiencyLevel: 'expert', yearsOfExperience: 6, isPrimarySkill: true, sessionCountForSkill: 30, avgRatingForSkill: 4.9 },
      { mentorProfileId: mentorProfiles[2]._id, skillName: 'Express.js', proficiencyLevel: 'expert', yearsOfExperience: 6, isPrimarySkill: true, sessionCountForSkill: 25, avgRatingForSkill: 4.8 },
      { mentorProfileId: mentorProfiles[2]._id, skillName: 'MongoDB', proficiencyLevel: 'expert', yearsOfExperience: 5, isPrimarySkill: true, sessionCountForSkill: 20, avgRatingForSkill: 4.7 },
      { mentorProfileId: mentorProfiles[2]._id, skillName: 'PostgreSQL', proficiencyLevel: 'advanced', yearsOfExperience: 4, isPrimarySkill: false, sessionCountForSkill: 15, avgRatingForSkill: 4.6 },
      { mentorProfileId: mentorProfiles[2]._id, skillName: 'Docker', proficiencyLevel: 'advanced', yearsOfExperience: 4, isPrimarySkill: false, sessionCountForSkill: 10, avgRatingForSkill: 4.7 },
      
      // Maria's skills
      { mentorProfileId: mentorProfiles[3]._id, skillName: 'React', proficiencyLevel: 'expert', yearsOfExperience: 5, isPrimarySkill: true, sessionCountForSkill: 25, avgRatingForSkill: 4.7 },
      { mentorProfileId: mentorProfiles[3]._id, skillName: 'Vue.js', proficiencyLevel: 'expert', yearsOfExperience: 4, isPrimarySkill: true, sessionCountForSkill: 18, avgRatingForSkill: 4.6 },
      { mentorProfileId: mentorProfiles[3]._id, skillName: 'CSS', proficiencyLevel: 'expert', yearsOfExperience: 5, isPrimarySkill: true, sessionCountForSkill: 20, avgRatingForSkill: 4.8 },
      { mentorProfileId: mentorProfiles[3]._id, skillName: 'Tailwind CSS', proficiencyLevel: 'advanced', yearsOfExperience: 3, isPrimarySkill: false, sessionCountForSkill: 12, avgRatingForSkill: 4.5 },
      { mentorProfileId: mentorProfiles[3]._id, skillName: 'JavaScript', proficiencyLevel: 'expert', yearsOfExperience: 5, isPrimarySkill: false, sessionCountForSkill: 15, avgRatingForSkill: 4.7 }
    ]);

    console.log('🎯 Creating mentor expertise...');
    await MentorExpertise.insertMany([
      // ANUJ
      { mentorProfileId: mentorProfiles[0]._id, expertiseArea: 'Frontend', subExpertise: 'React', proficiencyLevel: 'advanced', sessionCount: 8, avgRating: 4.7 },
      { mentorProfileId: mentorProfiles[0]._id, expertiseArea: 'Backend', subExpertise: 'Node.js', proficiencyLevel: 'advanced', sessionCount: 5, avgRating: 4.6 },
      
      // Sarah
      { mentorProfileId: mentorProfiles[1]._id, expertiseArea: 'System Design', subExpertise: 'Scalability', proficiencyLevel: 'expert', sessionCount: 25, avgRating: 4.9 },
      { mentorProfileId: mentorProfiles[1]._id, expertiseArea: 'Frontend', subExpertise: 'React', proficiencyLevel: 'expert', sessionCount: 20, avgRating: 4.8 },
      { mentorProfileId: mentorProfiles[1]._id, expertiseArea: 'Backend', subExpertise: 'Python', proficiencyLevel: 'advanced', sessionCount: 15, avgRating: 4.7 },
      
      // Raj
      { mentorProfileId: mentorProfiles[2]._id, expertiseArea: 'Backend', subExpertise: 'Node.js', proficiencyLevel: 'expert', sessionCount: 30, avgRating: 4.9 },
      { mentorProfileId: mentorProfiles[2]._id, expertiseArea: 'Database', subExpertise: 'MongoDB', proficiencyLevel: 'expert', sessionCount: 20, avgRating: 4.7 },
      { mentorProfileId: mentorProfiles[2]._id, expertiseArea: 'DevOps', subExpertise: 'Docker', proficiencyLevel: 'advanced', sessionCount: 10, avgRating: 4.7 },
      
      // Maria
      { mentorProfileId: mentorProfiles[3]._id, expertiseArea: 'Frontend', subExpertise: 'React', proficiencyLevel: 'expert', sessionCount: 25, avgRating: 4.7 },
      { mentorProfileId: mentorProfiles[3]._id, expertiseArea: 'Frontend', subExpertise: 'Vue.js', proficiencyLevel: 'expert', sessionCount: 18, avgRating: 4.6 },
      { mentorProfileId: mentorProfiles[3]._id, expertiseArea: 'UI/UX', subExpertise: 'CSS', proficiencyLevel: 'expert', sessionCount: 20, avgRating: 4.8 }
    ]);

    console.log('🔧 Creating specializations...');
    await MentorSpecialization.insertMany([
      // ANUJ
      { mentorProfileId: mentorProfiles[0]._id, specializationType: 'Debugging', proficiencyLevel: 'expert', sessionCount: 7, successRate: 92.5 },
      { mentorProfileId: mentorProfiles[0]._id, specializationType: 'Code Review', proficiencyLevel: 'advanced', sessionCount: 5, successRate: 88.0 },
      
      // Sarah
      { mentorProfileId: mentorProfiles[1]._id, specializationType: 'System Design', proficiencyLevel: 'expert', sessionCount: 35, successRate: 95.2 },
      { mentorProfileId: mentorProfiles[1]._id, specializationType: 'Code Review', proficiencyLevel: 'expert', sessionCount: 28, successRate: 94.1 },
      { mentorProfileId: mentorProfiles[1]._id, specializationType: 'Career Guidance', proficiencyLevel: 'expert', sessionCount: 22, successRate: 96.5 },
      
      // Raj
      { mentorProfileId: mentorProfiles[2]._id, specializationType: 'API Development', proficiencyLevel: 'expert', sessionCount: 30, successRate: 93.8 },
      { mentorProfileId: mentorProfiles[2]._id, specializationType: 'Database Design', proficiencyLevel: 'expert', sessionCount: 20, successRate: 91.2 },
      { mentorProfileId: mentorProfiles[2]._id, specializationType: 'Performance Optimization', proficiencyLevel: 'advanced', sessionCount: 15, successRate: 89.5 },
      
      // Maria
      { mentorProfileId: mentorProfiles[3]._id, specializationType: 'UI Design', proficiencyLevel: 'expert', sessionCount: 25, successRate: 90.5 },
      { mentorProfileId: mentorProfiles[3]._id, specializationType: 'Component Architecture', proficiencyLevel: 'advanced', sessionCount: 18, successRate: 88.2 }
    ]);

    console.log('💼 Creating work experiences...');
    await WorkExperience.insertMany([
      // Sarah
      {
        mentorProfileId: mentorProfiles[1]._id,
        companyName: 'Google',
        companyTier: 'FAANG',
        jobTitle: 'Senior Software Engineer',
        startDate: new Date('2019-06-01'),
        isCurrent: true,
        technologiesUsed: ['React', 'TypeScript', 'Python', 'Go', 'Kubernetes'],
        description: 'Leading frontend architecture for Google Cloud Console. Mentoring junior engineers.',
        verificationStatus: 'verified'
      },
      {
        mentorProfileId: mentorProfiles[1]._id,
        companyName: 'Facebook',
        companyTier: 'FAANG',
        jobTitle: 'Software Engineer',
        startDate: new Date('2017-03-01'),
        endDate: new Date('2019-05-31'),
        isCurrent: false,
        technologiesUsed: ['React', 'GraphQL', 'Flow', 'Node.js'],
        description: 'Built features for Facebook News Feed. Contributed to React open source.',
        verificationStatus: 'verified'
      },
      
      // Raj
      {
        mentorProfileId: mentorProfiles[2]._id,
        companyName: 'Microsoft',
        companyTier: 'FAANG',
        jobTitle: 'Senior Backend Engineer',
        startDate: new Date('2020-08-01'),
        isCurrent: true,
        technologiesUsed: ['Node.js', 'TypeScript', 'Azure', 'PostgreSQL', 'Redis'],
        description: 'Building scalable APIs for Azure services. Leading backend architecture initiatives.',
        verificationStatus: 'verified'
      },
      {
        mentorProfileId: mentorProfiles[2]._id,
        companyName: 'Uber',
        companyTier: 'Unicorn',
        jobTitle: 'Backend Engineer',
        startDate: new Date('2018-01-01'),
        endDate: new Date('2020-07-31'),
        isCurrent: false,
        technologiesUsed: ['Node.js', 'Go', 'Cassandra', 'Kafka'],
        description: 'Worked on rider experience APIs. Optimized payment processing systems.',
        verificationStatus: 'verified'
      },
      
      // Maria
      {
        mentorProfileId: mentorProfiles[3]._id,
        companyName: 'Amazon',
        companyTier: 'FAANG',
        jobTitle: 'Senior Frontend Developer',
        startDate: new Date('2021-02-01'),
        isCurrent: true,
        technologiesUsed: ['React', 'Vue.js', 'TypeScript', 'AWS'],
        description: 'Leading UI development for Amazon Prime Video. Focus on accessibility and performance.',
        verificationStatus: 'verified'
      }
    ]);

    console.log('📜 Creating certifications...');
    await Certification.insertMany([
      {
        mentorProfileId: mentorProfiles[1]._id,
        certificationName: 'AWS Certified Solutions Architect',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date('2021-05-15'),
        expirationDate: new Date('2024-05-15'),
        credentialId: 'AWS-CSA-2021-12345',
        credentialUrl: 'https://aws.amazon.com/verification/AWS-CSA-2021-12345',
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[2]._id,
        certificationName: 'MongoDB Certified Developer',
        issuingOrganization: 'MongoDB Inc.',
        issueDate: new Date('2020-08-20'),
        credentialId: 'MONGO-DEV-2020-67890',
        credentialUrl: 'https://university.mongodb.com/cert/67890',
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[3]._id,
        certificationName: 'Google UX Design Certificate',
        issuingOrganization: 'Google',
        issueDate: new Date('2022-03-10'),
        credentialId: 'GOOGLE-UX-2022-11223',
        credentialUrl: 'https://grow.google/certificates/ux-design',
        isVerified: true
      }
    ]);

    console.log('🏆 Creating competition experiences...');
    await CompetitionExperience.insertMany([
      {
        mentorProfileId: mentorProfiles[0]._id,
        competitionName: 'Hacktoberfest',
        year: 2024,
        role: 'participant',
        organization: 'DigitalOcean',
        projectName: 'Various open source contributions',
        technologiesUsed: ['JavaScript', 'React', 'Node.js'],
        achievementLevel: 'completed',
        projectUrl: 'https://github.com/MUFFANUJ',
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[1]._id,
        competitionName: 'Google Summer of Code',
        year: 2023,
        role: 'mentor',
        organization: 'React',
        projectName: 'React DevTools improvements',
        technologiesUsed: ['React', 'TypeScript', 'Chrome Extensions'],
        achievementLevel: 'completed',
        projectUrl: 'https://summerofcode.withgoogle.com/archive/2023/projects/react-devtools',
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[2]._id,
        competitionName: 'Google Summer of Code',
        year: 2024,
        role: 'mentor',
        organization: 'Node.js',
        projectName: 'Performance monitoring tools',
        technologiesUsed: ['Node.js', 'C++', 'V8'],
        achievementLevel: 'completed',
        projectUrl: 'https://summerofcode.withgoogle.com/archive/2024/projects/nodejs',
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[3]._id,
        competitionName: 'Hacktoberfest',
        year: 2023,
        role: 'participant',
        organization: 'DigitalOcean',
        projectName: 'Vue.js documentation improvements',
        technologiesUsed: ['Vue.js', 'Markdown', 'VitePress'],
        achievementLevel: 'winner',
        projectUrl: 'https://github.com/vuejs/docs',
        isVerified: true
      }
    ]);

    console.log('🌟 Creating open source achievements...');
    await OpenSourceAchievement.insertMany([
      {
        mentorProfileId: mentorProfiles[1]._id,
        achievementType: 'core-contributor',
        repoFullName: 'facebook/react',
        organizationName: 'Facebook',
        startedAt: new Date('2018-01-01'),
        isCurrent: true,
        contributionCount: 145,
        impactScore: 95,
        verificationStatus: 'verified'
      },
      {
        mentorProfileId: mentorProfiles[2]._id,
        achievementType: 'maintainer',
        repoFullName: 'expressjs/express',
        organizationName: 'Express.js',
        startedAt: new Date('2020-06-01'),
        isCurrent: true,
        contributionCount: 89,
        impactScore: 92,
        verificationStatus: 'verified'
      },
      {
        mentorProfileId: mentorProfiles[3]._id,
        achievementType: 'core-contributor',
        repoFullName: 'vuejs/core',
        organizationName: 'Vue.js',
        startedAt: new Date('2021-03-01'),
        isCurrent: true,
        contributionCount: 67,
        impactScore: 88,
        verificationStatus: 'verified'
      }
    ]);

    console.log('🎖️ Creating badges...');
    await MentorBadge.insertMany([
      { mentorProfileId: mentorProfiles[0]._id, badgeName: 'Rising Star', badgeType: 'achievement', description: 'Completed first 10 sessions', earnedAt: new Date('2024-08-15'), iconUrl: 'https://example.com/badges/rising-star.png' },
      { mentorProfileId: mentorProfiles[0]._id, badgeName: 'Debugging Master', badgeType: 'skill', description: 'Expert in debugging complex issues', earnedAt: new Date('2024-09-01'), iconUrl: 'https://example.com/badges/debug-master.png' },
      
      { mentorProfileId: mentorProfiles[1]._id, badgeName: 'FAANG Veteran', badgeType: 'experience', description: '5+ years at FAANG companies', earnedAt: new Date('2022-03-01'), iconUrl: 'https://example.com/badges/faang.png' },
      { mentorProfileId: mentorProfiles[1]._id, badgeName: 'Top Rated', badgeType: 'rating', description: '4.9+ average rating', earnedAt: new Date('2023-06-15'), iconUrl: 'https://example.com/badges/top-rated.png' },
      { mentorProfileId: mentorProfiles[1]._id, badgeName: 'Super Mentor', badgeType: 'achievement', description: '50+ completed sessions', earnedAt: new Date('2024-01-20'), iconUrl: 'https://example.com/badges/super-mentor.png' },
      
      { mentorProfileId: mentorProfiles[2]._id, badgeName: 'GSoC Mentor', badgeType: 'achievement', description: 'Official GSoC mentor', earnedAt: new Date('2024-03-01'), iconUrl: 'https://example.com/badges/gsoc.png' },
      { mentorProfileId: mentorProfiles[2]._id, badgeName: 'Backend Expert', badgeType: 'skill', description: 'Expert in backend technologies', earnedAt: new Date('2023-08-10'), iconUrl: 'https://example.com/badges/backend-expert.png' },
      
      { mentorProfileId: mentorProfiles[3]._id, badgeName: 'UI/UX Specialist', badgeType: 'skill', description: 'Expert in UI/UX design', earnedAt: new Date('2023-11-05'), iconUrl: 'https://example.com/badges/uiux.png' },
      { mentorProfileId: mentorProfiles[3]._id, badgeName: 'Consistent Performer', badgeType: 'achievement', description: '30+ sessions with 4.5+ rating', earnedAt: new Date('2024-05-12'), iconUrl: 'https://example.com/badges/consistent.png' }
    ]);

    console.log('📅 Creating availability...');
    await MentorAvailability.insertMany([
      // ANUJ - Monday, Wednesday, Friday
      { mentorProfileId: mentorProfiles[0]._id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata', isRecurring: true },
      { mentorProfileId: mentorProfiles[0]._id, dayOfWeek: 3, startTime: '14:00', endTime: '20:00', timezone: 'Asia/Kolkata', isRecurring: true },
      { mentorProfileId: mentorProfiles[0]._id, dayOfWeek: 5, startTime: '10:00', endTime: '18:00', timezone: 'Asia/Kolkata', isRecurring: true },
      
      // Sarah - Tuesday, Thursday, Saturday
      { mentorProfileId: mentorProfiles[1]._id, dayOfWeek: 2, startTime: '18:00', endTime: '22:00', timezone: 'America/New_York', isRecurring: true },
      { mentorProfileId: mentorProfiles[1]._id, dayOfWeek: 4, startTime: '18:00', endTime: '22:00', timezone: 'America/New_York', isRecurring: true },
      { mentorProfileId: mentorProfiles[1]._id, dayOfWeek: 6, startTime: '10:00', endTime: '18:00', timezone: 'America/New_York', isRecurring: true },
      
      // Raj - Monday, Wednesday, Friday, Saturday
      { mentorProfileId: mentorProfiles[2]._id, dayOfWeek: 1, startTime: '19:00', endTime: '22:00', timezone: 'Asia/Kolkata', isRecurring: true },
      { mentorProfileId: mentorProfiles[2]._id, dayOfWeek: 3, startTime: '19:00', endTime: '22:00', timezone: 'Asia/Kolkata', isRecurring: true },
      { mentorProfileId: mentorProfiles[2]._id, dayOfWeek: 5, startTime: '19:00', endTime: '22:00', timezone: 'Asia/Kolkata', isRecurring: true },
      { mentorProfileId: mentorProfiles[2]._id, dayOfWeek: 6, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata', isRecurring: true },
      
      // Maria - Monday, Tuesday, Thursday, Sunday
      { mentorProfileId: mentorProfiles[3]._id, dayOfWeek: 1, startTime: '17:00', endTime: '21:00', timezone: 'Europe/Madrid', isRecurring: true },
      { mentorProfileId: mentorProfiles[3]._id, dayOfWeek: 2, startTime: '17:00', endTime: '21:00', timezone: 'Europe/Madrid', isRecurring: true },
      { mentorProfileId: mentorProfiles[3]._id, dayOfWeek: 4, startTime: '17:00', endTime: '21:00', timezone: 'Europe/Madrid', isRecurring: true },
      { mentorProfileId: mentorProfiles[3]._id, dayOfWeek: 0, startTime: '10:00', endTime: '16:00', timezone: 'Europe/Madrid', isRecurring: true }
    ]);

    console.log('🚫 Creating unavailable dates...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await MentorUnavailableDate.insertMany([
      { mentorProfileId: mentorProfiles[0]._id, date: tomorrow, reason: 'Personal commitment' },
      { mentorProfileId: mentorProfiles[1]._id, date: nextWeek, reason: 'Conference attendance' }
    ]);

    console.log('📊 Creating GitHub contributions...');
    const contributions = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      contributions.push({
        userId: users[0]._id,
        date,
        commitCount: Math.floor(Math.random() * 10),
        prCount: Math.floor(Math.random() * 3),
        issueCount: Math.floor(Math.random() * 2),
        reviewCount: Math.floor(Math.random() * 2)
      });
    }
    await GithubContribution.insertMany(contributions);

    console.log('🤝 Creating sessions...');
    const pastDate1 = new Date();
    pastDate1.setDate(pastDate1.getDate() - 7);
    const pastDate2 = new Date();
    pastDate2.setDate(pastDate2.getDate() - 14);
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 3);
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 5);

    const sessions = await Session.insertMany([
      {
        contributorId: users[4]._id,
        mentorId: users[0]._id,
        scheduledDate: pastDate1,
        scheduledStartTime: '14:00',
        scheduledEndTime: '15:00',
        actualStartTime: new Date(pastDate1.getTime() + 14 * 60 * 60 * 1000),
        actualEndTime: new Date(pastDate1.getTime() + 15 * 60 * 60 * 1000),
        durationMinutes: 60,
        topic: 'React Hooks debugging',
        description: 'Help with useEffect infinite loop issue',
        problemType: 'debugging',
        technologies: ['React', 'JavaScript'],
        difficultyLevel: 'beginner',
        relatedRepo: 'john_beginner/portfolio',
        status: 'completed',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Fixed the issue by adding proper dependency array',
        problemSolved: true,
        followUpNeeded: false,
        agreedRate: 50,
        actualCost: 50,
        paymentStatus: 'paid'
      },
      {
        contributorId: users[5]._id,
        mentorId: users[1]._id,
        scheduledDate: pastDate2,
        scheduledStartTime: '18:00',
        scheduledEndTime: '20:00',
        actualStartTime: new Date(pastDate2.getTime() + 18 * 60 * 60 * 1000),
        actualEndTime: new Date(pastDate2.getTime() + 20 * 60 * 60 * 1000),
        durationMinutes: 120,
        topic: 'System Design Interview Prep',
        description: 'Mock interview for system design',
        problemType: 'concept_learning',
        technologies: ['System Design', 'Scalability'],
        difficultyLevel: 'advanced',
        status: 'completed',
        meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
        notes: 'Covered designing a URL shortener. Great progress!',
        problemSolved: true,
        followUpNeeded: true,
        agreedRate: 150,
        actualCost: 300,
        paymentStatus: 'paid'
      },
      {
        contributorId: users[4]._id,
        mentorId: users[2]._id,
        scheduledDate: futureDate1,
        scheduledStartTime: '19:00',
        scheduledEndTime: '20:30',
        topic: 'REST API best practices',
        description: 'Learn how to design RESTful APIs',
        problemType: 'concept_learning',
        technologies: ['Node.js', 'Express.js', 'REST API'],
        difficultyLevel: 'intermediate',
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/qrs-tuv-wxy',
        agreedRate: 120,
        paymentStatus: 'pending'
      },
      {
        contributorId: users[5]._id,
        mentorId: users[3]._id,
        scheduledDate: futureDate2,
        scheduledStartTime: '17:00',
        scheduledEndTime: '18:00',
        topic: 'CSS Grid and Flexbox',
        description: 'Understanding modern CSS layouts',
        problemType: 'concept_learning',
        technologies: ['CSS', 'HTML'],
        difficultyLevel: 'beginner',
        status: 'pending',
        agreedRate: 100,
        paymentStatus: 'pending'
      },
      {
        contributorId: users[0]._id,
        mentorId: users[1]._id,
        scheduledDate: pastDate1,
        scheduledStartTime: '19:00',
        scheduledEndTime: '20:00',
        actualStartTime: new Date(pastDate1.getTime() + 19 * 60 * 60 * 1000),
        actualEndTime: new Date(pastDate1.getTime() + 20 * 60 * 60 * 1000),
        durationMinutes: 60,
        topic: 'TypeScript advanced types',
        description: 'Understanding generics and utility types',
        problemType: 'concept_learning',
        technologies: ['TypeScript'],
        difficultyLevel: 'intermediate',
        status: 'completed',
        meetingLink: 'https://meet.google.com/lmn-opq-rst',
        notes: 'Covered conditional types and mapped types',
        problemSolved: true,
        followUpNeeded: false,
        agreedRate: 150,
        actualCost: 150,
        paymentStatus: 'paid'
      }
    ]);

    console.log('⭐ Creating reviews...');
    await SessionReview.insertMany([
      {
        sessionId: sessions[0]._id,
        reviewerId: users[4]._id,
        revieweeId: users[0]._id,
        reviewerType: 'contributor',
        overallRating: 5,
        clarityRating: 5,
        patienceRating: 5,
        responseTimeRating: 4,
        problemSolvingRating: 5,
        followupRating: 4,
        reviewText: 'Anuj was extremely helpful! He quickly identified the issue and explained it clearly. Highly recommend!',
        pros: ['Very patient', 'Clear explanations', 'Quick problem solving'],
        cons: [],
        wouldRecommend: true,
        wouldBookAgain: true,
        isVerified: true
      },
      {
        sessionId: sessions[1]._id,
        reviewerId: users[5]._id,
        revieweeId: users[1]._id,
        reviewerType: 'contributor',
        overallRating: 5,
        clarityRating: 5,
        patienceRating: 5,
        responseTimeRating: 5,
        problemSolvingRating: 5,
        followupRating: 5,
        reviewText: 'Sarah is an amazing mentor! Her system design knowledge is incredible. Worth every penny.',
        pros: ['Deep expertise', 'Structured approach', 'Real-world examples'],
        cons: [],
        wouldRecommend: true,
        wouldBookAgain: true,
        isVerified: true
      },
      {
        sessionId: sessions[4]._id,
        reviewerId: users[0]._id,
        revieweeId: users[1]._id,
        reviewerType: 'contributor',
        overallRating: 5,
        clarityRating: 5,
        patienceRating: 5,
        responseTimeRating: 5,
        problemSolvingRating: 5,
        followupRating: 4,
        reviewText: 'Excellent session on TypeScript! Sarah explained complex concepts in an easy-to-understand way.',
        pros: ['Expert knowledge', 'Great examples', 'Patient teaching'],
        cons: ['Could use more practice exercises'],
        wouldRecommend: true,
        wouldBookAgain: true,
        isVerified: true
      }
    ]);

    console.log('💬 Creating testimonials...');
    await Testimonial.insertMany([
      {
        mentorProfileId: mentorProfiles[0]._id,
        contributorId: users[4]._id,
        testimonialText: 'Anuj helped me fix a critical bug in my React app before my interview. His debugging skills are top-notch!',
        specificAchievement: 'Fixed production bug, got the job',
        technologiesMentioned: ['React', 'JavaScript'],
        isFeatured: true,
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[1]._id,
        contributorId: users[5]._id,
        testimonialText: 'Sarah\'s system design mentorship helped me crack interviews at 3 FAANG companies. She\'s simply the best!',
        specificAchievement: 'Got offers from Google, Amazon, and Meta',
        technologiesMentioned: ['System Design', 'Scalability'],
        isFeatured: true,
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[1]._id,
        contributorId: users[0]._id,
        testimonialText: 'As a fellow developer, I learned so much from Sarah about TypeScript best practices. Highly recommended!',
        specificAchievement: 'Improved code quality significantly',
        technologiesMentioned: ['TypeScript', 'React'],
        isFeatured: true,
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[2]._id,
        testimonialText: 'Raj\'s Node.js and API design expertise is unmatched. His GSoC mentorship helped me contribute to major projects.',
        specificAchievement: 'Selected for GSoC, became core contributor',
        technologiesMentioned: ['Node.js', 'API Design'],
        isFeatured: true,
        isVerified: true
      },
      {
        mentorProfileId: mentorProfiles[3]._id,
        contributorId: users[4]._id,
        testimonialText: 'Maria taught me modern CSS techniques that transformed my portfolio. Her UI/UX insights are invaluable.',
        specificAchievement: 'Built award-winning portfolio',
        technologiesMentioned: ['CSS', 'UI/UX', 'React'],
        isFeatured: false,
        isVerified: true
      }
    ]);

    console.log('🔍 Creating search queries...');
    await SearchQuery.insertMany([
      {
        userId: users[4]._id,
        searchText: 'React expert',
        technologies: ['React'],
        minRating: 4.5,
        maxHourlyRate: 100,
        resultsCount: 3,
        topResultMentorId: users[0]._id
      },
      {
        userId: users[5]._id,
        searchText: 'System design mentor',
        technologies: ['System Design'],
        minRating: 4.8,
        resultsCount: 2,
        topResultMentorId: users[1]._id
      },
      {
        userId: users[4]._id,
        technologies: ['Node.js', 'Backend'],
        problemType: 'concept_learning',
        difficultyLevel: 'intermediate',
        maxHourlyRate: 150,
        resultsCount: 2,
        topResultMentorId: users[2]._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${users.length} Users`);
    console.log(`   - ${githubProfiles.length} GitHub Profiles`);
    console.log(`   - ${mentorProfiles.length} Mentor Profiles`);
    console.log(`   - 3 Contributor Profiles`);
    console.log(`   - 19 Mentor Skills`);
    console.log(`   - 11 Expertise Areas`);
    console.log(`   - 10 Specializations`);
    console.log(`   - 5 Work Experiences`);
    console.log(`   - 3 Certifications`);
    console.log(`   - 4 Competition Experiences`);
    console.log(`   - 3 Open Source Achievements`);
    console.log(`   - 9 Badges`);
    console.log(`   - 14 Availability Slots`);
    console.log(`   - 2 Unavailable Dates`);
    console.log(`   - 30 GitHub Contributions`);
    console.log(`   - ${sessions.length} Sessions`);
    console.log(`   - 3 Reviews`);
    console.log(`   - 5 Testimonials`);
    console.log(`   - 3 Search Queries`);
    console.log('\n🚀 Ready to use!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// ==================== MAIN ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anuj:anuj@cluster0.7wwcit2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    return seedDatabase();
  })
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });

