## Purpose

Provides the persisted data model and base data-access operations for training bundles and their individual sessions, on which bundle management and history features are built.

## ADDED Requirements

### Requirement: Bundle Record
The system SHALL persist a bundle with a price, a start date, a total session count, and an active flag.

#### Scenario: Creating a bundle stores its core fields
- **WHEN** a new bundle is created with a price, a start date, and a total session count
- **THEN** the system persists a bundle record with those values and defaults `total_sessions` to 10 when none is supplied

#### Scenario: New bundle defaults to active
- **WHEN** a new bundle is created
- **THEN** the persisted bundle has `active` set to true

### Requirement: Single Active Bundle
The system SHALL guarantee that at most one bundle is active at any time.

#### Scenario: Creating a new bundle deactivates the previous one
- **GIVEN** a bundle exists with `active = true`
- **WHEN** a new bundle is created
- **THEN** the previously active bundle is persisted with `active = false`
- **AND** the newly created bundle is the only bundle with `active = true`

### Requirement: Retrieve Active Bundle
The system SHALL provide a way to retrieve the currently active bundle, if one exists.

#### Scenario: An active bundle exists
- **WHEN** the active bundle is requested and a bundle with `active = true` exists
- **THEN** the system returns that bundle's data

#### Scenario: No active bundle exists
- **WHEN** the active bundle is requested and no bundle has `active = true`
- **THEN** the system indicates that there is no active bundle, without error

### Requirement: Session Record
The system SHALL persist a session linked to a bundle, with a session date, an effort rating, and an optional note.

#### Scenario: Creating a session stores its fields
- **WHEN** a new session is created for an existing bundle with an effort rating and an optional note
- **THEN** the system persists a session record linked to that bundle, defaulting `session_date` to the current date when none is supplied

#### Scenario: Effort rating is constrained to a valid range
- **WHEN** a session is created with an effort rating outside the 1-5 range
- **THEN** the system rejects the operation and no session record is persisted

### Requirement: Session Count Per Bundle
The system SHALL provide a way to count how many sessions are linked to a given bundle.

#### Scenario: Counting sessions for a bundle with recorded sessions
- **WHEN** the session count is requested for a bundle that has recorded sessions
- **THEN** the system returns the number of sessions linked to that bundle

#### Scenario: Counting sessions for a bundle with no sessions
- **WHEN** the session count is requested for a bundle that has no recorded sessions
- **THEN** the system returns zero

### Requirement: Bundle History With Sessions
The system SHALL provide a way to list all bundles together with their associated sessions, for history views.

#### Scenario: Listing bundles with sessions
- **WHEN** the bundle history is requested
- **THEN** the system returns all bundles, each including its associated sessions
