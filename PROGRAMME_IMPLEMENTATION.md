# Programme Menu Implementation

## Overview
This implementation creates a dedicated programme menu with separate HTML and JavaScript files for better code organization and maintainability.

## Files Created

### 1. `/public/programme.html`
- Contains the HTML structure for the Programme Master interface
- Includes input field for programme name
- Displays a table with programme list showing:
  - Serial number
  - Programme name
  - Edit button
  - Delete button

### 2. `/public/js/programme.js`
- Contains all JavaScript functions specific to programme management
- Functions included:
  - `saveProgramme()` - Saves or updates a programme
  - `loadProgrammes()` - Loads and displays the programme list
  - `editProgramme(id, name)` - Loads a programme for editing
  - `deleteProgramme(id)` - Deletes a programme after confirmation

## Files Modified

### 1. `/public/js/script.js`
- Updated `openProgramme()` function to dynamically load programme.html and programme.js
- Removed duplicate programme-related functions (moved to programme.js)
- Kept `loadProgrammeDropdown()` in script.js as it's used by branch module

### 2. `/public/index.html`
- Removed embedded programme HTML (lines 135-157)
- Navigation menu already exists and calls `openPage(this,'programme')`
- This triggers the `openProgramme()` function in script.js

## Backend Integration

The programme menu integrates with existing backend routes:
- **POST** `/api/programme/add` - Add new programme
- **GET** `/api/programme/list` - Get all programmes
- **PUT** `/api/programme/update/:id` - Update a programme
- **DELETE** `/api/programme/:id` - Delete a programme

## Database Table

The backend expects a `programme_master` table with the following structure:
- `id` - Primary key
- `programme_name` - Name of the programme
- `status` - Status flag (1 for active)

## How It Works

1. User clicks "Programme" in the navigation sidebar
2. `openPage(this,'programme')` is called
3. This calls `openProgramme()` in script.js
4. `openProgramme()` fetches `/programme.html` and loads it into the content area
5. It then loads `/js/programme.js` dynamically
6. Once loaded, it calls `loadProgrammes()` to fetch and display the programme list
7. All CRUD operations work through the backend API endpoints

## Benefits

- **Separation of Concerns**: Programme-specific code is isolated
- **Maintainability**: Easier to locate and update programme-related code
- **Consistency**: Follows the same pattern as course-mapping module
- **Reusability**: Programme functionality can be loaded on demand
- **Clean Code**: Reduced clutter in main index.html and script.js files

## Testing Notes

To test the implementation:
1. Ensure MySQL database is running with proper credentials in `.env`
2. Ensure `programme_master` table exists in the database
3. Start the server: `npm start`
4. Navigate to http://localhost:8080
5. Click on "Masters" → "Programme" in the sidebar
6. The programme master page should load with all functionality working
