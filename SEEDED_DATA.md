# Seeded Database Summary

## ✅ Database Successfully Populated

Your MongoDB Atlas database has been populated with comprehensive dummy data for testing and development.

## 📊 Data Summary

### Users (6 total)
1. **MUFFANUJ** (Anuj Kumar Singh) - Role: `both` (mentor + contributor)
   - GitHub: 151390316
   - Email: anujsinghhero292@gmail.com
   - Timezone: Asia/Kolkata

2. **sarahdev** (Sarah Johnson) - Role: `mentor`
   - Company: Google (FAANG)
   - Email: sarah.johnson@example.com
   - Timezone: America/New_York
   - Top-rated mentor (4.9★)

3. **codemaster_raj** (Raj Patel) - Role: `mentor`
   - Company: Microsoft (FAANG)
   - Email: raj.patel@example.com
   - Timezone: Asia/Kolkata
   - GSoC Mentor

4. **maria_frontend** (Maria Garcia) - Role: `mentor`
   - Company: Amazon (FAANG)
   - Email: maria.garcia@example.com
   - Timezone: Europe/Madrid
   - UI/UX Specialist

5. **john_beginner** (John Smith) - Role: `contributor`
   - Email: john.smith@example.com
   - Timezone: America/Los_Angeles
   - Beginner level

6. **alice_learner** (Alice Wong) - Role: `contributor`
   - Email: alice.wong@example.com
   - Timezone: Asia/Singapore
   - Beginner level

### Mentor Profiles (4 total)

#### 1. MUFFANUJ
- **Hourly Rate:** $50
- **Experience:** 2 years
- **Rating:** 4.7★
- **Sessions:** 15 total (13 completed)
- **Specialization:** React, Node.js, Debugging
- **Teaching Style:** hands-on, practical, patient
- **Available:** Yes (including free sessions)

#### 2. Sarah Johnson
- **Hourly Rate:** $150
- **Experience:** 8 years
- **Rating:** 4.9★
- **Sessions:** 87 total (82 completed)
- **Specialization:** System Design, React, TypeScript
- **Teaching Style:** structured, in-depth, professional
- **Work:** Google (Senior Full Stack Engineer)

#### 3. Raj Patel
- **Hourly Rate:** $120
- **Experience:** 6 years
- **Rating:** 4.8★
- **Sessions:** 56 total (53 completed)
- **Specialization:** Node.js, MongoDB, API Design
- **Teaching Style:** example-driven, patient, thorough
- **Work:** Microsoft (Senior Backend Engineer)

#### 4. Maria Garcia
- **Hourly Rate:** $100
- **Experience:** 5 years
- **Rating:** 4.6★
- **Sessions:** 42 total (39 completed)
- **Specialization:** React, Vue.js, CSS, UI/UX
- **Teaching Style:** visual, interactive, creative
- **Work:** Amazon (Senior Frontend Developer)

### Skills & Expertise (40+ entries)

**Popular Skills:**
- React (4 mentors)
- Node.js (2 mentors)
- JavaScript (2 mentors)
- TypeScript (1 mentor)
- System Design (1 mentor)
- MongoDB (2 mentors)
- CSS/UI Design (1 mentor)

### Work Experience (5 entries)
- Google: Sarah Johnson (Current)
- Facebook: Sarah Johnson (Past)
- Microsoft: Raj Patel (Current)
- Uber: Raj Patel (Past)
- Amazon: Maria Garcia (Current)

### Certifications (3 entries)
- AWS Certified Solutions Architect (Sarah)
- MongoDB Certified Developer (Raj)
- Google UX Design Certificate (Maria)

### Competition Experience (4 entries)
- GSoC 2024 Mentor (Raj - Node.js)
- GSoC 2023 Mentor (Sarah - React)
- Hacktoberfest 2024 (Anuj)
- Hacktoberfest 2023 Winner (Maria)

### Open Source Achievements (3 entries)
- facebook/react - Core Contributor (Sarah)
- expressjs/express - Maintainer (Raj)
- vuejs/core - Core Contributor (Maria)

### Badges (9 entries)
- Rising Star, Debugging Master (Anuj)
- FAANG Veteran, Top Rated, Super Mentor (Sarah)
- GSoC Mentor, Backend Expert (Raj)
- UI/UX Specialist, Consistent Performer (Maria)

### Sessions (5 entries)

#### Completed Sessions:
1. **React Hooks debugging** (John → Anuj)
   - Status: Completed, Paid
   - Rating: 5★
   - Problem solved ✅

2. **System Design Interview** (Alice → Sarah)
   - Status: Completed, Paid
   - Rating: 5★
   - 2 hours session

3. **TypeScript Advanced Types** (Anuj → Sarah)
   - Status: Completed, Paid
   - Rating: 5★

#### Upcoming Sessions:
4. **REST API Best Practices** (John → Raj)
   - Status: Confirmed
   - Scheduled: 3 days from now

5. **CSS Grid and Flexbox** (Alice → Maria)
   - Status: Pending
   - Scheduled: 5 days from now

### Reviews (3 entries)
All reviews are 5-star ratings with positive feedback:
- "Extremely helpful and patient"
- "Amazing mentor with incredible knowledge"
- "Explained complex concepts clearly"

### Testimonials (5 entries)
- Featured testimonials from successful mentoring outcomes
- Specific achievements: job offers, GSoC selection, portfolio awards
- Technologies mentioned: React, System Design, TypeScript, Node.js, CSS

### GitHub Contributions (30 days)
- Daily contribution data for Anuj
- Includes commits, PRs, issues, and reviews

### Availability Schedules (14 slots)
Each mentor has recurring weekly availability:
- Anuj: Mon, Wed, Fri
- Sarah: Tue, Thu, Sat
- Raj: Mon, Wed, Fri, Sat
- Maria: Mon, Tue, Thu, Sun

## 🚀 Testing the API

### Get Top Mentors
```bash
curl http://localhost:3000/api/search/top-mentors?limit=3
```

### Search for React Mentors
```bash
curl -X POST http://localhost:3000/api/search/mentors \
  -H "Content-Type: application/json" \
  -d '{"technologies": ["React"], "minRating": 4.5}'
```

### Get Complete Mentor Profile
```bash
# Sarah's mentor profile ID from database
curl http://localhost:3000/api/mentor/{mentorProfileId}/complete
```

### Get User Sessions
```bash
# John's user ID from database
curl http://localhost:3000/api/sessions/user/{userId}?role=contributor
```

### Get Mentor Reviews
```bash
# Anuj's user ID from database
curl http://localhost:3000/api/sessions/mentor/{mentorId}/reviews?minRating=4
```

## 📝 Sample API Workflow

### 1. GitHub OAuth Callback (Already Populated)
All users are already created with GitHub data populated.

### 2. Search for Mentors
```bash
curl -X POST http://localhost:3000/api/search/mentors \
  -H "Content-Type: application/json" \
  -d '{
    "technologies": ["React"],
    "maxHourlyRate": 100,
    "studentLevel": "beginner"
  }'
```

### 3. View Complete Mentor Profile
Get mentor profile with all skills, experience, certifications, etc.

### 4. Book a Session
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "contributorId": "{john_userId}",
    "mentorId": "{anuj_userId}",
    "scheduledDate": "2025-10-10",
    "scheduledStartTime": "14:00",
    "scheduledEndTime": "15:00",
    "topic": "React debugging help",
    "technologies": ["React"],
    "difficultyLevel": "beginner",
    "agreedRate": 50
  }'
```

### 5. Leave a Review
```bash
curl -X POST http://localhost:3000/api/sessions/{sessionId}/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": "{john_userId}",
    "revieweeId": "{anuj_userId}",
    "reviewerType": "contributor",
    "overallRating": 5,
    "clarityRating": 5,
    "patienceRating": 5,
    "reviewText": "Excellent mentor!"
  }'
```

## 🔐 Database Connection

**MongoDB Atlas URI:**
```
mongodb+srv://anuj:anuj@cluster0.7wwcit2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Database Name:** Default database in connection string

## 📦 Collections Created

1. ✅ users
2. ✅ githubprofiles
3. ✅ mentorprofiles
4. ✅ contributorprofiles
5. ✅ mentorskills
6. ✅ mentorexpertises
7. ✅ mentorspecializations
8. ✅ workexperiences
9. ✅ certifications
10. ✅ competitionexperiences
11. ✅ opensourceachievements
12. ✅ mentorbadges
13. ✅ mentoravailabilities
14. ✅ mentorunavailabledates
15. ✅ githubcontributions
16. ✅ sessions
17. ✅ sessionreviews
18. ✅ testimonials
19. ✅ searchqueries

## 🎯 Next Steps

1. **Start the API:** `npm start`
2. **Test endpoints:** Use the examples above
3. **View in MongoDB Compass:** Connect with your URI
4. **Modify data:** Use the API endpoints to add/update/delete
5. **Re-seed if needed:** `npm run seed` (will clear and repopulate)

## 💡 Tips

- All mentors are available for sessions
- Reviews automatically update mentor ratings
- Search supports multiple filters
- Complete profile endpoints return all related data in one call
- Sessions track status, payments, and outcomes
- GitHub contributions are tracked daily

