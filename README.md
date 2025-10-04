# Backlund Service - Mentor/Contributor Platform API

Complete Express.js + Mongoose REST API for a mentor-contributor matching platform with GitHub integration.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **Run the server:**
   ```bash
   npm start       # Production
   npm run dev     # Development with nodemon
   ```

## API Endpoints

### Authentication & Initial Setup
- `POST /api/auth/github-callback` - GitHub OAuth callback, creates User + GithubProfile + ContributorProfile

### User Profile Management
- `GET /api/profile/complete/:userId` - Get complete user profile
- `PATCH /api/profile/user/:userId` - Update user profile
- `POST /api/profile/mentor/:userId` - Create mentor profile
- `PATCH /api/profile/mentor/:userId` - Update mentor profile
- `PATCH /api/profile/contributor/:userId` - Update contributor profile

### GitHub Data
- `GET /api/github/profile/:userId` - Get GitHub profile
- `POST /api/github/sync-contributions` - Sync contribution data

### Mentor Skills & Expertise
- `POST /api/mentor/:mentorProfileId/skills` - Add skills
- `GET /api/mentor/:mentorProfileId/skills` - Get skills
- `DELETE /api/mentor/:mentorProfileId/skills/:skillId` - Delete skill
- `POST /api/mentor/:mentorProfileId/expertise` - Add expertise areas
- `GET /api/mentor/:mentorProfileId/expertise` - Get expertise
- `POST /api/mentor/:mentorProfileId/specializations` - Add specializations
- `GET /api/mentor/:mentorProfileId/specializations` - Get specializations

### Work Experience & Credentials
- `POST /api/mentor/:mentorProfileId/experience` - Add work experience
- `GET /api/mentor/:mentorProfileId/experience` - Get experiences
- `PATCH /api/mentor/:mentorProfileId/experience/:experienceId` - Update experience
- `DELETE /api/mentor/:mentorProfileId/experience/:experienceId` - Delete experience
- `POST /api/mentor/:mentorProfileId/certifications` - Add certification
- `GET /api/mentor/:mentorProfileId/certifications` - Get certifications
- `DELETE /api/mentor/:mentorProfileId/certifications/:certId` - Delete certification
- `POST /api/mentor/:mentorProfileId/competitions` - Add competition experience
- `GET /api/mentor/:mentorProfileId/competitions` - Get competitions
- `PATCH /api/mentor/:mentorProfileId/competitions/:compId` - Update competition
- `DELETE /api/mentor/:mentorProfileId/competitions/:compId` - Delete competition
- `POST /api/mentor/:mentorProfileId/opensource` - Add open source achievement
- `GET /api/mentor/:mentorProfileId/opensource` - Get achievements

### Badges & Availability
- `POST /api/mentor/:mentorProfileId/badges` - Add badge
- `GET /api/mentor/:mentorProfileId/badges` - Get badges
- `POST /api/mentor/:mentorProfileId/availability` - Set availability schedule
- `GET /api/mentor/:mentorProfileId/availability` - Get availability
- `POST /api/mentor/:mentorProfileId/unavailable` - Mark unavailable dates
- `GET /api/mentor/:mentorProfileId/unavailable` - Get unavailable dates

### Complete Mentor Profile
- `GET /api/mentor/:mentorProfileId/complete` - Get complete mentor profile with all related data

### Sessions
- `POST /api/sessions` - Book new session
- `GET /api/sessions/:sessionId` - Get session details
- `GET /api/sessions/user/:userId?role=mentor&status=completed` - Get user sessions
- `PATCH /api/sessions/:sessionId/status` - Update session status
- `PATCH /api/sessions/:sessionId/outcome` - Update session outcome
- `GET /api/sessions/stats/:userId?role=mentor` - Get session statistics

### Reviews
- `POST /api/sessions/:sessionId/reviews` - Create review
- `GET /api/sessions/:sessionId/reviews` - Get session reviews
- `GET /api/sessions/mentor/:mentorId/reviews?minRating=4&limit=10` - Get mentor reviews

### Search & Matching
- `POST /api/search/mentors` - Search mentors with filters
- `GET /api/search/top-mentors?technology=React&limit=10` - Get top mentors

### Testimonials
- `POST /api/testimonials` - Create testimonial
- `GET /api/testimonials/mentor/:mentorProfileId?featured=true` - Get testimonials

## Data Flow Example

### 1. GitHub OAuth Callback
```bash
POST /api/auth/github-callback
```
```json
{
  "githubData": {
    "githubId": "151390316",
    "username": "MUFFANUJ",
    "displayName": "ANUJ KUMAR SINGH",
    "email": "anujsinghhero292@gmail.com",
    "avatar": "https://avatars.githubusercontent.com/u/151390316?v=4",
    "profileUrl": "https://github.com/MUFFANUJ",
    "accessToken": "gho...",
    "githubData": {
      "profile": {
        "bio": "Probably Debugging now ;)",
        "company": "",
        "location": "Earth",
        "websiteUrl": "",
        "twitterUsername": "",
        "createdAt": "2023-11-18T16:25:40.000Z",
        "followers": 8,
        "following": 1,
        "starredRepositories": 1,
        "watching": 58
      },
      "summary": {
        "totalCommits": 139,
        "totalPRs": 28,
        "mergedPRs": 18,
        "totalIssues": 1,
        "totalRepositories": 77,
        "totalStars": 0,
        "totalForks": 5,
        "followers": 8,
        "following": 1,
        "organizations": 1,
        "discussions": 0,
        "gists": 0,
        "accountAge": 686
      },
      "lastFetched": "2025-10-04T19:24:54.513Z"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "MUFFANUJ",
    "email": "anujsinghhero292@gmail.com",
    "role": "contributor",
    "githubProfileId": "507f1f77bcf86cd799439012"
  },
  "missingFields": ["timezone", "phone_number", "preferredLanguage"]
}
```

### 2. Complete Basic Profile
```bash
PATCH /api/profile/user/507f1f77bcf86cd799439011
```
```json
{
  "timezone": "Asia/Kolkata",
  "preferredLanguage": "English"
}
```

### 3. Create Mentor Profile
```bash
POST /api/profile/mentor/507f1f77bcf86cd799439011
```
```json
{
  "bio": "Experienced React developer with 5 years...",
  "headline": "Senior React Developer | GSoC Mentor",
  "hourlyRate": 50,
  "yearsOfExperience": 5,
  "teachingStyle": ["hands-on", "practical"],
  "studentLevelPreference": ["beginner", "intermediate"]
}
```

### 4. Add Skills
```bash
POST /api/mentor/{mentorProfileId}/skills
```
```json
{
  "skills": [
    {
      "skillName": "React",
      "proficiencyLevel": "expert",
      "yearsOfExperience": 5,
      "isPrimarySkill": true
    },
    {
      "skillName": "Node.js",
      "proficiencyLevel": "advanced",
      "yearsOfExperience": 4
    }
  ]
}
```

### 5. Add Expertise Areas
```bash
POST /api/mentor/{mentorProfileId}/expertise
```
```json
{
  "expertiseAreas": [
    {
      "expertiseArea": "Frontend",
      "subExpertise": "React",
      "proficiencyLevel": "expert"
    },
    {
      "expertiseArea": "Backend",
      "subExpertise": "Node.js",
      "proficiencyLevel": "advanced"
    }
  ]
}
```

### 6. Set Availability
```bash
POST /api/mentor/{mentorProfileId}/availability
```
```json
{
  "schedule": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "timezone": "Asia/Kolkata"
    },
    {
      "dayOfWeek": 3,
      "startTime": "14:00",
      "endTime": "20:00",
      "timezone": "Asia/Kolkata"
    }
  ]
}
```

## Models

- **User** - Core user account
- **GithubProfile** - GitHub data sync
- **MentorProfile** - Mentor-specific data
- **ContributorProfile** - Contributor-specific data
- **MentorSkill** - Mentor skills with proficiency
- **MentorExpertise** - Expertise areas
- **MentorSpecialization** - Specializations
- **WorkExperience** - Work history
- **Certification** - Certifications
- **CompetitionExperience** - Competition participation
- **OpenSourceAchievement** - Open source contributions
- **MentorBadge** - Earned badges
- **MentorAvailability** - Weekly schedule
- **MentorUnavailableDate** - Blocked dates
- **GithubContribution** - Daily contributions
- **Session** - Mentoring sessions
- **SessionReview** - Session reviews/ratings
- **Testimonial** - Mentor testimonials
- **SearchQuery** - Search history

## Features

✅ **Auto-populated from GitHub:**
- User info (email, name, avatar)
- GitHub profile (username, bio, location, company)
- Repository stats (commits, stars, PRs, repos)
- Account metrics (followers, following, gists)

✅ **Manual entry required:**
- Role selection
- Timezone & language
- Mentor bio & rates
- Skills & expertise
- Work experience
- Certifications
- Availability schedule

✅ **Auto-calculated:**
- Mentor ratings (from reviews)
- Session statistics
- Success metrics

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/backlund
```

## Tech Stack

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **MongoDB** - Database

## License

ISC

