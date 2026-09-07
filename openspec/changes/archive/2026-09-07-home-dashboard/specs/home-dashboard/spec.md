## Purpose

Shows a compact, at-a-glance list of the active bundle's most recent sessions on the home page, without navigating to the full history.

## ADDED Requirements

### Requirement: Recent Sessions List
The home page SHALL show the 5 most recent sessions of the active bundle, ordered from most recent to oldest, each showing its date, its effort (if any), and its note (if any).

#### Scenario: Active bundle has sessions
- **WHEN** a user visits the home page and the active bundle has one or more sessions
- **THEN** the page lists up to 5 of that bundle's most recent sessions, most recent first, each showing its date and, when present, its effort and note

#### Scenario: Active bundle has more than 5 sessions
- **WHEN** the active bundle has more than 5 sessions
- **THEN** only the 5 most recent are shown

#### Scenario: Active bundle has no sessions yet
- **WHEN** a user visits the home page and the active bundle has no sessions
- **THEN** the page shows a message indicating no sessions have been logged for this bundle yet, instead of an empty list

### Requirement: Recent Session Effort Uses Shared Visual Mapping
Each recent session's effort SHALL be shown using the same emoji and color mapping used by the effort selector in the log-session form.

#### Scenario: Session with an effort rating
- **WHEN** a recent session has an effort rating
- **THEN** its entry shows the same emoji and color associated with that rating in the effort selector

#### Scenario: Session with no effort rating
- **WHEN** a recent session has no effort rating
- **THEN** its entry shows no emoji/color for effort, without error
