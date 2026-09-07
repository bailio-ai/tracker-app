# static-auth Specification

## Purpose

Gates the entire application behind a single shared password, since the app has exactly one user and no need for accounts, roles, or recovery flows.

## Requirements

### Requirement: Server-Side Password Verification
The system SHALL verify the submitted password against the `APP_PASSWORD` environment variable entirely on the server, never exposing the expected password value to the client.

#### Scenario: Correct password grants a session
- **WHEN** a visitor submits the login form with the correct password
- **THEN** the system establishes a session for that visitor and grants access to the app

#### Scenario: Incorrect password is rejected
- **WHEN** a visitor submits the login form with an incorrect password
- **THEN** the system does not establish a session and reports an error to the visitor

### Requirement: Session Cookie
The system SHALL represent an established session with a cookie that is `httpOnly`, `sameSite=lax`, marked `secure` in production, and long-lived enough to avoid frequent re-logins on mobile.

#### Scenario: Login sets the session cookie
- **WHEN** a visitor's password is verified successfully
- **THEN** the system sets a session cookie with `httpOnly` enabled, `sameSite=lax`, `secure` enabled in production, and an expiry of about 30 days

### Requirement: Route Protection
The system SHALL block access to every route except the login page and static assets unless the request carries a valid session cookie.

#### Scenario: Unauthenticated request is redirected to login
- **WHEN** a request without a valid session cookie is made to any protected route
- **THEN** the system redirects the request to `/login`

#### Scenario: Authenticated request proceeds
- **WHEN** a request with a valid session cookie is made to any protected route
- **THEN** the system allows the request to proceed to that route

### Requirement: Authenticated Visitor Redirected Away From Login
The system SHALL redirect a visitor who already has a valid session away from the login page.

#### Scenario: Valid session visits the login page
- **WHEN** a request with a valid session cookie is made to `/login`
- **THEN** the system redirects the request to the home page instead of showing the login form

### Requirement: Logout
The system SHALL allow an authenticated visitor to end their session on demand.

#### Scenario: Logout clears the session
- **WHEN** an authenticated visitor triggers logout
- **THEN** the system removes the session cookie and subsequent requests are treated as unauthenticated
