# TIOTE - Time Is Of The Essence
_Time tracking app - Nikola Bojanovic_

## User Stories

### Register & Login
  * Register
    * Full Name
    * Email
    * Password
    * Confirm Password
    * Secret Question/Answer
  * Login
    * Email
    * Password
    * Remember me? (writes credentials to browser storage)
    * Forgot password? (requires email, secret question/answer)
<p>* After successful login and if the user profile is not complete, the user is routed to profile page. The user cannot use the timer until the profile is complete. Once the profile is validated, the user will be routed to Overview page on successful logins.</p>

### Overview
  * Current date is a default view
  * Date picker (selecting a date opens up a report for a selection)
  * Reports for selected date
    * Session segments (possible integration with JIRA)
      * Name (Add price filter to products table)
      * Project (MyApp)
      * Employer (Some Company)
      * Duration (01:24:41)
      * Hourly Rate (25$) => calc the rate per sec
      * Earnings (35.28$) => calc the rate * duration in sec, round to 2 decimals
    * Total time
    * Total earnings
  * Filter by Name, Project, Employer
  * Sort by Name, Project, Employer, Duration, Earnings
  * Edit sessions (you cannot modify duration, earnings and hourly rate fields)
    
### Analytics
  * Visual performance representation
  * Graph changes depending on the selected parameter (Duration, Earnings, Mixed)
  * Scopes to analyse: Week, Month, Year
    
### Session
  * Control current session
  * Ability to limit the session duration
  * Start a session by filling the form
    * Name (required)
    * Project (required)
    * Employer (required)
    * Hourly Rate (if not specified, the default rate will be used)
    * Limit (if not specified, the session will last until canceled)
  * Stop a session
    * Limited: stop the timer and alert the user (possibly with a sound too)
    * Regular: add a confirmation before stopping to avoid accidental breaks
  <p>* While the timer is running the backdrop will prevent the navigation and scrolling. If a user changes the url or closes the tab, app will react as if a timer was stopped regulary and send the data to the server.</p>

### Profile
  * Add/Change photo (if no photo is specified, the placeholder will be used)
  * Change password (requires current password, secret question/answer)
  * Request email change (requires current password, secret question/answer)
  * Set global hourly rate (this can be overridden when starting a session)
  * Enable/Disable report export (choose between JSON and xls table)
  * Enable/Disable activity sessions (automatic logout after selected amount of time)
  * Set global language localization (EN, SR, DE, ES, FR)
  * Set global theme (Dark, Light, Aqua)
  
### Roles
  * user
    * Can register & login
    * Edit own profile
    * Add/Edit global configuration
    * Create/Edit sessions
    * Review reports and graphs
    * Export reports
  * admin
    * Includes user access rights except for the register (the admin role can only be granted to a regular user by rootAdmin)
    * Access other users profiles
    * Lock/Unlock a user
    * Request password reset for a user (no email, secret question/answer required)
    * Request email change for a user (no email, secret question/answer required)
    * Admin cannot modify sessions and reports!
  * rootAdmin
    * Includes admin access rights
    * Access unlinked admin dashboard
    * Create, Delete, Update user and admin roles
    * Create, Delete, Update sessions and reports

## Tech Spec

### UI
  * React >= 16.8
  * Material UI
  * Material Icons
  * Roboto Google fonts
<p>* React hooks and React context API will be used for app state management and manipulation with localization and theme.</p>

### Server
  * NodeJS 10.15.1
  * ExpressJS 4.16.4
  * MongoDB
  * Cloudinary

### Deployment
  * Server - Heroku
  * UI - GitHub pages
  
### License
You may use the content of this project for both commercial and non-commercial applications. It is welcomed, but not mandatory, to credit the author in some form (visible on the UI or a comment inside the code)
##### Comment template
```javascript
/*
 * Credits to
 * @author Nikola Bojanovic - nikolabojanovicmob@gmail.com
 */
```