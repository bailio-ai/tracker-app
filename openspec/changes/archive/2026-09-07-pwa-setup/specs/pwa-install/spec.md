## Purpose

Lets a user add the app to their device's home screen and open it as a standalone, app-like experience instead of a browser tab, on both Android/Chrome and iOS Safari.

## ADDED Requirements

### Requirement: App Is Installable
The system SHALL expose a web app manifest declaring a name, a short name suitable for display under a home-screen icon, standalone display mode, and icons of at least 192×192 and 512×512, including one icon marked maskable.

#### Scenario: Manifest is discoverable
- **WHEN** a browser requests the app's manifest
- **THEN** it receives a valid manifest with `name`, `short_name`, `display: standalone`, `background_color`, `theme_color`, and an `icons` array containing at least a 192×192 and a 512×512 entry

#### Scenario: Maskable icon available
- **WHEN** a browser reads the manifest's `icons` array
- **THEN** at least one icon entry declares `purpose` including `maskable`

### Requirement: Installed App Launches Standalone
When launched from a home-screen icon on a device that installed it via the manifest, the app SHALL run without browser chrome (address bar, tab UI).

#### Scenario: Opening from the home screen
- **WHEN** a user opens the app from its installed home-screen icon
- **THEN** the app displays in standalone mode with no visible browser address bar

### Requirement: iOS Home Screen Support
On iOS Safari, which does not support the standalone-install prompt, the system SHALL provide the iOS-specific metadata needed for "Add to Home Screen" to produce a standalone-looking icon and launch experience.

#### Scenario: Adding to home screen from iOS Safari
- **WHEN** a user adds the app to their home screen from iOS Safari
- **THEN** the home screen icon uses the app's dedicated touch icon, and opening it launches without Safari's browser chrome

### Requirement: Registered Service Worker Enables Install Eligibility
The system SHALL register a service worker so that browsers requiring one (e.g. Chrome on Android) consider the app eligible for the install prompt, without that service worker caching any page or data response.

#### Scenario: Service worker registered
- **WHEN** a user visits the app in a browser that supports service workers
- **THEN** a service worker becomes active for the app's origin

#### Scenario: No offline caching of app data
- **WHEN** the service worker is active and the device goes offline
- **THEN** previously visited pages and data are not served from a cache — the app does not claim to work offline
