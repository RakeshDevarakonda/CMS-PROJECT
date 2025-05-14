# CMS Project

A scalable Content Management System (CMS) built with **React** and **Node.js** featuring role-based access (Creator, Admin, Moderator), JWT authentication, and various optimizations for performance and security.


## LiveUrl:-

- Note:- it may take 1-2 minutes to load initially.....please wait
- https://cms-project-qghq.onrender.com

ASDFGHJKL;'


## Technologies Used

- **Frontend**: React, React Query
- **Backend**: Node.js, Express
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Frontend Caching, React Query
- **Security**: Helmet, RateLimit, Data Encryption
- **Database**: monngodb
## Features

- **Role-Based Access Control**: Supports Creator, Admin, and Moderator roles for managing content.
- **JWT Authentication**: Secure user authentication with JWT for role-based access control.
- **Data Encryption**: Encrypts sensitive user information such as passwords to ensure data security.
- **Frontend Caching**: Uses React Query and caching mechanisms to minimize unnecessary API calls and enhance performance.
- **API Rate Limiting**: Implemented RateLimit to prevent abuse and ensure fair usage of APIs.
- **Security Enhancements**: Utilized Helmet to secure HTTP headers and improve overall app security.

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or above)
- npm or yarn (for package management)
- MongoDB (if you're using MongoDB)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/RakeshDevarakonda/CMS-PROJECT

# Install frontend dependencies
```
cd frontend
npm install
```

# Install backend dependencies

```
cd backend
npm install
```



Create a .env file in the root of your backend directory and add the following:
```

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

PORT

MONGODB_URL=

FRONTEND_URL1=
FRONTEND_URL2=

JWT_SECRET=

COOKIE_SECURE=
COOKIE_SAMESITE=

Replace the values with your own configuration.
```

Start the application:
```
cd frontend
npm run dev 
```


Run the client:
```
nodemon index.js
The application should now be live
```

# Key Features
```
Role-Based Access Control (RBAC)
Creator: Can create and manage their content.

Admin: Full access to all content, user management, and settings.

Moderator: Can review and moderate content created by others.

JWT Authentication
User authentication is managed via JWT tokens, ensuring secure, token-based user sessions.

Frontend Caching
React Query and custom caching mechanisms are used to reduce unnecessary API calls, improving the user experience and application performance.

Data Encryption
Sensitive data such as user passwords and API keys are encrypted to prevent unauthorized access.

API Rate Limiting
Implemented RateLimit to protect the backend from abuse and overuse by limiting the number of requests a user can make in a given time period.
```
