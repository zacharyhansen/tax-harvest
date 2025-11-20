# Tax Modeling Interface Requirements - Frontend Only

## Overview
Create the frontend UI/UX for a "model" functionality that allows users to explore tax implications of potential asset sales. This is **frontend-only** work - all components and state management will be structured to accept backend data via props/hooks that will be implemented separately.

## Core Frontend Functionality

### 1. Model State Management (Frontend)
- Client-side state to track which lots are added to the model
- UI updates in response to add/remove actions
- Components structured to accept calculation results from backend hooks
- All calculation logic will be backend-provided (not FE computed)

### 2. UI Layout Restructuring

#### Table View Changes
- **Expand table width** to use more screen real estate
- **Simplified column set**: Show only essential fields (based on design mockup)
- **Sticky header**: When scrolling down, column headers ("Asset", "Purchase Date", etc.) should remain pinned at top
- **Fixed footer**: Summary metrics pinned to bottom at all times showing:
  - Unrealized losses
  - Unrealized gains
  - Realized gain/losses
  - Projected tax bill
  - Footer values will come from backend calculations

#### Navigation Changes
- **Move nav bar to upper right** corner
- **Hide extra nav items** in an 'Account' tab/menu
- Clean, minimal top navigation

### 3. Add to Model Interaction (UI Components)

#### Hover State Component
- On hover over each lot row, show **"Add to Model"** button
- If lot is already in model, button shows **"Remove from Model"** instead
- Click handlers update frontend model state

#### Model Panel Component
- **Side panel (slide-out/drawer)** appears when items are added to model
- Shows list of lots currently in the model
- **Ordering**: Lots ordered from oldest to newest based on when added to model
- **Hover to remove**: Users can hover over items in side panel to remove them
- **Display calculations**: Show values provided by backend hooks

### 4. Component Structure for Backend Integration
- Props/interfaces defined for:
  - Lot data structure
  - Tax calculation results
  - Model summary metrics
- Hooks prepared for backend integration:
  - `useModelCalculations(lotIds)` - placeholder for backend tax calc hook
  - `useModelState()` - client-side model management
- Clear separation between UI state and calculation logic

## What We're NOT Doing (Backend)
- No database models or migrations
- No API endpoints or GraphQL mutations
- No actual tax calculation logic
- No server-side model persistence
- Components will have placeholders/mock data until backend is connected

## What We ARE Doing (Frontend)
- Complete UI/UX implementation
- Client-side model state management
- All interactive components (buttons, panels, tables)
- Layout restructuring (sticky headers, fixed footer, navigation)
- Component interfaces ready for backend integration
- TypeScript types for data structures

## Design References
- Linear ticket includes UI mockups showing:
  - Expanded table layout
  - Sticky header behavior
  - Side panel design
  - Add/Remove button placement

## Success Criteria (Frontend)
- Users can add/remove lots to model via hover interactions (updates FE state)
- Side panel displays modeled lots in chronological order
- Table header stays pinned when scrolling
- Footer metrics stay pinned when scrolling
- UI matches design mockups
- Components accept calculation data via props/hooks
- TypeScript interfaces defined for backend integration
- Works with mock data until backend is ready

## Questions to Resolve
1. Should model state use React Context, Zustand, or component state?
2. Should we use localStorage to persist model across page refreshes?
3. What's the data shape for a "lot" from the backend?
4. What calculation values will the backend provide?
5. Should side panel be a drawer/sheet component or custom implementation?
