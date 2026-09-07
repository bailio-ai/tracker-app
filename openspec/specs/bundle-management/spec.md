# bundle-management Specification

## Purpose

Provides the business logic and UI for creating a training bundle, tracking how many sessions remain on the active bundle, and logging sessions against it.

## Requirements

### Requirement: Create Bundle From User Input
The system SHALL let a user create a new bundle by supplying a price and a start date, optionally a total session count, making it the active bundle.

#### Scenario: Creating a bundle with valid input
- **WHEN** a user submits a price and a start date to create a bundle
- **THEN** the system creates the bundle and it becomes the active bundle

### Requirement: Remaining Sessions Calculation
The system SHALL report how many sessions remain on the active bundle, or an explicit "no active bundle" result when there is none.

#### Scenario: Active bundle with some sessions logged
- **WHEN** the remaining sessions are requested and an active bundle exists with some sessions already logged
- **THEN** the system returns the bundle's total sessions minus the number of sessions logged for it

#### Scenario: No active bundle
- **WHEN** the remaining sessions are requested and there is no active bundle
- **THEN** the system returns an explicit "no active bundle" result rather than an error

### Requirement: Log Session Against Active Bundle
The system SHALL let a user log a session, with an effort rating and an optional note, against the active bundle.

#### Scenario: Logging a session with an active bundle
- **WHEN** a user logs a session and an active bundle exists
- **THEN** the system records the session against that bundle

#### Scenario: Logging a session with no active bundle
- **WHEN** a user attempts to log a session and there is no active bundle
- **THEN** the system does not record a session and reports that there is no active bundle to log against, without crashing

### Requirement: Home Page Reflects Bundle State
The home page SHALL show the active bundle's remaining sessions when one exists, or an empty state offering to create a bundle when none exists.

#### Scenario: Active bundle exists
- **WHEN** a user visits the home page and an active bundle exists
- **THEN** the page shows the remaining sessions for that bundle

#### Scenario: No active bundle exists
- **WHEN** a user visits the home page and no active bundle exists
- **THEN** the page shows an empty state with a form to create a new bundle (price and start date)

### Requirement: History Page Reflects All Bundles
The history page SHALL list every bundle together with its sessions.

#### Scenario: Viewing history
- **WHEN** a user visits the history page
- **THEN** the page lists all bundles, each showing its associated sessions
