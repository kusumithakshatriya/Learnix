# Learnix API Contract - Phase 1

This document outlines the API contract between the Learnix backend and mobile application.

## Base URL
`/api` (for all routes except `/health`)

---

## Health Check

### GET `/health`
Check if the API is running.

**Auth Required:** No

**Response (200 OK):**
```json
{
  "status": "ok",
  "app": "Learnix"
}
```

---

## Authentication

### POST `/api/auth/signup`
Register a new student.

**Auth Required:** No

**Request:**
```json
{
  "email": "student@example.com",
  "password": "password",
  "name": "Student"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "student@example.com",
  "is_active": true,
  "created_at": "2023-10-27T10:00:00Z"
}
```
**Errors:**
- `409 Conflict`: Email already registered
- `422 Unprocessable Entity`: Invalid request data

### POST `/api/auth/login`
Authenticate and get a JWT token.

**Auth Required:** No

**Request:**
```json
{
  "email": "student@example.com",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```
**Errors:**
- `401 Unauthorized`: Incorrect email or password

---

## Profile

### GET `/api/profile`
Get the current student's profile.

**Auth Required:** Yes (Bearer Token)

**Response (200 OK):**
```json
{
  "name": "Student",
  "phone": "1234567890",
  "student_type": "btech",
  "id": 1,
  "user_id": 1,
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z"
}
```
**Errors:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Profile not found

### PUT `/api/profile`
Update the current student's profile.

**Auth Required:** Yes (Bearer Token)

**Request:**
```json
{
  "name": "Updated Name",
  "phone": "0987654321",
  "student_type": "graduate"
}
```

**Response (200 OK):**
```json
{
  "name": "Updated Name",
  "phone": "0987654321",
  "student_type": "graduate",
  "id": 1,
  "user_id": 1,
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:05:00Z"
}
```

---

## Education

### POST `/api/education`
Add an education record.

**Auth Required:** Yes (Bearer Token)

**Request:**
```json
{
  "education_level": "Undergraduate",
  "branch": "Computer Science",
  "group_name": "CS",
  "year": 3,
  "semester": 5,
  "institution": "University of Tech"
}
```

**Response (201 Created):**
```json
{
  "education_level": "Undergraduate",
  "branch": "Computer Science",
  "group_name": "CS",
  "year": 3,
  "semester": 5,
  "institution": "University of Tech",
  "id": 1,
  "user_id": 1,
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z"
}
```

### GET `/api/education`
Get current student's education records.

**Auth Required:** Yes (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "education_level": "Undergraduate",
    "branch": "Computer Science",
    "group_name": "CS",
    "year": 3,
    "semester": 5,
    "institution": "University of Tech",
    "id": 1,
    "user_id": 1,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  }
]
```

---

## Skills

### POST `/api/skills`
Add a new skill.

**Auth Required:** Yes (Bearer Token)

**Request:**
```json
{
  "skill_name": "Python",
  "skill_level": 80
}
```

**Response (201 Created):**
```json
{
  "skill_name": "Python",
  "skill_level": 80,
  "id": 1,
  "user_id": 1,
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z"
}
```

### GET `/api/skills`
Get current student's skills.

**Auth Required:** Yes (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "skill_name": "Python",
    "skill_level": 80,
    "id": 1,
    "user_id": 1,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  }
]
```

---

## Goals

### POST `/api/goals`
Add a new career goal.

**Auth Required:** Yes (Bearer Token)

**Request:**
```json
{
  "career_goal": "Software Engineer",
  "target_date": "2024-05-01"
}
```

**Response (201 Created):**
```json
{
  "career_goal": "Software Engineer",
  "target_date": "2024-05-01",
  "id": 1,
  "user_id": 1,
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z"
}
```

### GET `/api/goals`
Get current student's career goals.

**Auth Required:** Yes (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "career_goal": "Software Engineer",
    "target_date": "2024-05-01",
    "id": 1,
    "user_id": 1,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  }
]
```


---

## Student DNA

### GET /api/student-dna
Get the current student's aggregated DNA and profile completion.
**Auth Required:** Yes (Bearer Token)

### PUT /api/student-dna
Update learning preferences.
**Auth Required:** Yes (Bearer Token)

---

## Interests

### GET /api/interests
List interests.
**Auth Required:** Yes

### POST /api/interests
Add an interest.
**Auth Required:** Yes

### DELETE /api/interests/{interest_id}
Delete an interest.
**Auth Required:** Yes
