# session-logging Specification

## Purpose

Defines the log-session form's UI: a date field, a visual 1-5 effort selector, and an optional note, layered on top of the existing `logSession` business logic.

## Requirements

### Requirement: Session Date Field
The log-session form SHALL include a date field that defaults to today's date and can be changed to log a past session.

#### Scenario: Form loads with today's date
- **WHEN** the log-session form is displayed
- **THEN** the date field is pre-filled with today's date

#### Scenario: Logging a past session
- **WHEN** a user changes the date field to an earlier date and submits the form
- **THEN** the submitted session date matches the date the user selected

### Requirement: Visual Effort Selector
The log-session form SHALL offer exactly one selectable option among 5 effort levels (1 through 5), each shown with a distinct emoji and a color following a red-to-green gradient (1 greenest/easiest, 5 reddest/hardest), and none of them selected by default.

#### Scenario: Selecting an effort level
- **WHEN** a user taps one of the 5 effort options
- **THEN** that option becomes selected and any previously selected option is deselected

#### Scenario: Submitting without selecting an effort level
- **WHEN** a user submits the form without selecting any effort level
- **THEN** the form submits successfully with no effort value

### Requirement: Optional Note Field
The log-session form SHALL include an optional note field with placeholder text inviting the user to add something memorable about the session.

#### Scenario: Submitting without a note
- **WHEN** a user submits the form without entering a note
- **THEN** the form submits successfully with no note value

### Requirement: Reusable Effort Selector
The effort selector SHALL be usable as a standalone piece of UI, independent of the log-session form, so it can be reused wherever an effort level needs to be picked.

#### Scenario: Using the effort selector outside the log-session form
- **WHEN** the effort selector is rendered in a context other than the log-session form
- **THEN** it presents the same 5 emoji/color options and selection behavior
