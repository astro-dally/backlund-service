# Field Mapping & Missing Data Handling

## How Missing Fields Are Handled

### String Fields
**Empty strings (`''`) are treated as falsy and converted to `null`**

| Field | Source | Missing Value | Note |
|-------|--------|---------------|------|
| `bio` | `githubData.profile.bio` | `null` | Empty string → null |
| `company` | `githubData.profile.company` | `null` | Empty string → null |
| `location` | `githubData.profile.location` | `null` | Your payload has "Earth" ✅ |
| `blogUrl` | `githubData.profile.websiteUrl` | `null` | Empty string → null |
| `twitterUsername` | `githubData.profile.twitterUsername` | `null` | Empty string → null |
| `profileUrl` | `githubData.profileUrl` | `null` | Your payload has it ✅ |

### Number Fields
**Missing numbers default to `0` using nullish coalescing (`??`)**

| Field | Source | Missing Value | Your Payload |
|-------|--------|---------------|--------------|
| `publicRepos` | `summary.totalRepositories` | `0` | `77` ✅ |
| `publicGists` | `summary.gists` | `0` | `0` ✅ |
| `followers` | `profile.followers` | `0` | `8` ✅ |
| `following` | `profile.following` | `0` | `1` ✅ |
| `totalStarsReceived` | `summary.totalStars` | `0` | `0` ✅ |
| `totalCommits` | `summary.totalCommits` | `0` | `139` ✅ |

**Note:** Using `??` (nullish coalescing) means:
- `0` is kept as `0` (not converted to default)
- `null` or `undefined` becomes `0`
- `false` stays `false`

### Date Fields

| Field | Source | Missing Value | Your Payload |
|-------|--------|---------------|--------------|
| `accountCreatedAt` | `profile.createdAt` | `null` | `2023-11-18T16:25:40.000Z` ✅ |
| `lastSyncedAt` | `githubData.lastFetched` | `new Date()` (current time) | `2025-10-04T19:24:54.513Z` ✅ |

## Your Specific Payload Analysis

### ✅ Fields That Will Be Populated

```javascript
{
  userId: ObjectId("..."),
  githubUsername: "MUFFANUJ",
  githubId: "151390316",
  profileUrl: "https://github.com/MUFFANUJ",
  bio: "Probably Debugging now ;)",  // ✅ Has value
  company: null,                      // Empty string → null
  location: "Earth",                  // ✅ Has value
  blogUrl: null,                      // Empty string → null
  twitterUsername: null,              // Empty string → null
  publicRepos: 77,                    // ✅ From summary.totalRepositories
  publicGists: 0,                     // ✅ From summary.gists
  followers: 8,                       // ✅ From profile.followers
  following: 1,                       // ✅ From profile.following
  totalStarsReceived: 0,              // ✅ From summary.totalStars
  totalCommits: 139,                  // ✅ From summary.totalCommits
  accountCreatedAt: "2023-11-18T16:25:40.000Z", // ✅ From profile.createdAt
  lastSyncedAt: "2025-10-04T19:24:54.513Z"      // ✅ From githubData.lastFetched
}
```

### ⚠️ Missing Fields Reported

The API will return in `missingFields` array:

```json
{
  "missingFields": [
    "timezone",           // Not in GitHub data - user must provide
    "phone_number",       // Not in GitHub data - user must provide
    "preferredLanguage",  // Not in GitHub data - user must provide
    "company",            // In payload but empty string
    "blogUrl",            // In payload but empty string (websiteUrl)
    "twitterUsername"     // In payload but empty string
  ]
}
```

## Field Handling Strategy

### 1. **String Fields with Empty Values**
```javascript
// Before (would save undefined):
bio: profile.bio  // undefined if missing

// After (saves null):
bio: profile.bio || null  // null if missing/empty
```

### 2. **Number Fields**
```javascript
// Using nullish coalescing to preserve 0:
publicRepos: summary.totalRepositories ?? 0
// This means:
// - undefined → 0
// - null → 0
// - 0 → 0 (preserved!)
// - 77 → 77
```

### 3. **Date Fields**
```javascript
// accountCreatedAt: null if missing, Date object if present
accountCreatedAt: profile.createdAt ? new Date(profile.createdAt) : null

// lastSyncedAt: defaults to current time
lastSyncedAt: githubData.githubData?.lastFetched 
  ? new Date(githubData.githubData.lastFetched) 
  : new Date()
```

## Database Storage

### Mongoose Behavior with `null`:
- Fields explicitly set to `null` will be stored as `null` in MongoDB
- Fields set to `undefined` will be **omitted** from the document
- Fields with default values in schema will use those defaults

### Example Document in MongoDB:

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  githubUsername: "MUFFANUJ",
  githubId: "151390316",
  profileUrl: "https://github.com/MUFFANUJ",
  bio: "Probably Debugging now ;)",
  company: null,        // Stored as null
  location: "Earth",
  blogUrl: null,        // Stored as null
  twitterUsername: null, // Stored as null
  publicRepos: 77,
  publicGists: 0,       // Stored as 0 (valid value)
  followers: 8,
  following: 1,
  totalStarsReceived: 0, // Stored as 0 (valid value)
  totalCommits: 139,
  accountCreatedAt: ISODate("2023-11-18T16:25:40.000Z"),
  lastSyncedAt: ISODate("2025-10-04T19:24:54.513Z"),
  createdAt: ISODate("2025-10-04T..."),
  updatedAt: ISODate("2025-10-04T..."),
  __v: 0
}
```

## API Response with Missing Fields

```javascript
POST /api/auth/github-callback

Response:
{
  "success": true,
  "data": {
    "userId": "68e1747f7e02dfc9f2f9e655",
    "username": "MUFFANUJ",
    "email": "anujsinghhero292@gmail.com",
    "role": "contributor",
    "githubProfileId": "..."
  },
  "missingFields": [
    "timezone",          // ⚠️ Required for scheduling
    "phone_number",      // ⚠️ Optional contact info
    "preferredLanguage", // ⚠️ Required for UX
    "company",           // ℹ️ Optional profile info
    "blogUrl",           // ℹ️ Optional profile info
    "twitterUsername"    // ℹ️ Optional social link
  ]
}
```

## Best Practices

### Frontend Should Handle:
1. ✅ Show users which fields are missing
2. ✅ Prompt users to complete required fields (timezone, language)
3. ✅ Allow users to optionally add company, blog, twitter
4. ✅ Treat `null` as "not provided" in UI

### API Guarantees:
1. ✅ All numeric stats will be `0` or valid number (never null/undefined)
2. ✅ String fields will be `string` or `null` (never undefined)
3. ✅ Date fields will be `Date` or `null`
4. ✅ Required fields (userId, githubUsername, githubId) will always exist

### Query Considerations:
```javascript
// To find users with missing company:
GithubProfile.find({ company: null })

// To find users with bio:
GithubProfile.find({ bio: { $ne: null } })

// To find users with commits:
GithubProfile.find({ totalCommits: { $gt: 0 } })
```

