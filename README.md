# Tesla Authentication API

A Node.js API that handles Tesla's OAuth 2.0 authentication flow with PKCE (Proof Key for Code Exchange) support. This API provides endpoints to generate authentication URLs, handle login callbacks, and refresh access tokens for Tesla's authentication system.

## Features

- OAuth 2.0 authentication flow with PKCE
- Secure token generation and handling
- Access token refresh functionality
- Type-safe implementation using TypeScript

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

The API uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
```

## API Endpoints

### 1. Get Authentication URL
```http
GET /auth/url
```

Generates a Tesla authentication URL with PKCE challenge.

**Response**
```json
{
  "success": true,
  "url": "https://auth.tesla.com/oauth2/v3/authorize?...",
  "code_verifier": "random_string",
  "code_challenge": "hashed_challenge",
  "state": "random_state"
}
```

### 2. Login with Authorization Code
```http
POST /auth/login
```

**Request Body**
```json
{
  "webUrl": "https://auth.tesla.com/void/callback?code=...",
  "codeVerifier": "previously_generated_code_verifier"
}
```

**Response**
```json
{
  "success": true,
  "message": {
    "access_token": "tesla_access_token",
    "refresh_token": "tesla_refresh_token",
    "expires_in": 28800,
    "created_at": 1640995200
  }
}
```

### 3. Refresh Token
```http
POST /auth/refresh
```

**Request Body**
```json
{
  "refreshToken": "tesla_refresh_token"
}
```

**Response**
```json
{
  "success": true,
  "message": {
    "access_token": "new_tesla_access_token",
    "refresh_token": "new_tesla_refresh_token",
    "expires_in": 28800,
    "created_at": 1640995200
  }
}
```

## Authentication Flow

1. **Generate Authentication URL**
   - Call `/auth/url` to get a Tesla authentication URL
   - Store the returned `code_verifier` securely
   - Redirect user to the returned `url`

2. **Handle Login**
   - After user authenticates, Tesla redirects to callback URL
   - Send the callback URL and stored `code_verifier` to `/auth/login`
   - Store the returned tokens securely

3. **Token Refresh**
   - When access token expires, use `/auth/refresh` with refresh token
   - Update stored tokens with new values

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## License

MIT