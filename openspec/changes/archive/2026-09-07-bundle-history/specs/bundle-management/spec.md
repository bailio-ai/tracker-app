## MODIFIED Requirements

### Requirement: History Page Reflects All Bundles
The history page SHALL list every bundle together with its sessions, most recent bundle first, each bundle showing its price, start date, sessions logged out of its total, whether it is the active bundle, and its sessions ordered most-recent-first with effort shown using the same emoji/color mapping used elsewhere in the app.

#### Scenario: Viewing history
- **WHEN** a user visits the history page
- **THEN** the page lists all bundles, each showing its associated sessions

#### Scenario: Bundles are ordered most recent first
- **WHEN** the history page lists more than one bundle
- **THEN** the bundles appear ordered by start date, most recent first

#### Scenario: Sessions within a bundle are ordered most recent first
- **WHEN** a bundle has more than one session
- **THEN** that bundle's sessions are listed most recent first

#### Scenario: Active bundle is visually indicated
- **WHEN** the history page lists a bundle that is the active one
- **THEN** that bundle is shown with a visible indicator distinguishing it from the others

#### Scenario: Bundle shows sessions logged out of total
- **WHEN** the history page shows a bundle
- **THEN** it shows how many sessions have been logged for that bundle out of its total session count

#### Scenario: Session effort uses the shared visual mapping
- **WHEN** a session in the history page has an effort rating
- **THEN** it is shown with the same emoji and color used for that rating elsewhere in the app
