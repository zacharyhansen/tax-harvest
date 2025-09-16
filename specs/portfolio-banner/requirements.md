# IGO-135: Portfolio Banner Default State Requirements

## Feature Overview
Update the portfolio banner's default state to properly display harvest count information, ensuring users have visibility into pending tax loss harvesting opportunities while maintaining a clean interface when no harvests exist.

## Business Context
Users need immediate visibility of pending harvest opportunities without cluttering the interface. The banner should adapt its display based on whether harvests are available, providing a clean default state when no actions are needed.

## User Stories

### As a user with pending harvests
- I want to see the count of pending harvests in the portfolio banner
- So that I'm aware of tax optimization opportunities that need attention

### As a user without pending harvests  
- I want to see a clean portfolio status without harvest information
- So that the interface remains uncluttered when no action is needed

### As a user scrolling through the tax opportunities page
- I want the portfolio banner to remain accessible as I scroll
- So that I can always see my portfolio status and pending harvests

## Functional Requirements

### FR1: Harvest Count Display
- **FR1.1**: The banner SHALL display the count of open harvests when at least one exists
- **FR1.2**: The harvest count SHALL be visually prominent with an alert icon
- **FR1.3**: The harvest count SHALL update automatically when harvests change
- **FR1.4**: The harvest count SHALL only include harvests with `recommendationExpiresDate >= endOfToday`

### FR2: Default State Behavior
- **FR2.1**: The banner SHALL NOT display any harvest section when no open harvests exist
- **FR2.2**: The banner SHALL maintain consistent height whether harvest count is shown or hidden
- **FR2.3**: The transition between states SHALL be smooth and animated

### FR3: Scroll-Triggered Visibility
- **FR3.1**: The compact banner SHALL appear when user scrolls past the main portfolio status
- **FR3.2**: The banner SHALL stick to the top of the viewport when visible
- **FR3.3**: The banner SHALL have a semi-transparent backdrop with blur effect
- **FR3.4**: The appearance/disappearance SHALL be animated with 300ms duration

### FR4: Data Display
- **FR4.1**: The banner SHALL display Net Position (Realized P&L)
- **FR4.2**: The banner SHALL display Unrealized Gain amount
- **FR4.3**: The banner SHALL display Unrealized Loss amount
- **FR4.4**: All monetary values SHALL be formatted as USD currency
- **FR4.5**: All monetary values SHALL animate when changing

## Non-Functional Requirements

### NFR1: Performance
- **NFR1.1**: Scroll detection SHALL NOT cause jank or lag
- **NFR1.2**: Component SHALL render within 16ms for 60fps
- **NFR1.3**: Bundle size increase SHALL be less than 10KB

### NFR2: Accessibility
- **NFR2.1**: Banner SHALL be keyboard navigable
- **NFR2.2**: Banner SHALL have appropriate ARIA labels
- **NFR2.3**: Color contrast SHALL meet WCAG AA standards
- **NFR2.4**: Screen readers SHALL announce harvest count changes

### NFR3: Responsiveness
- **NFR3.1**: Banner SHALL be readable on mobile devices (320px+)
- **NFR3.2**: Banner SHALL adapt layout for tablet and desktop
- **NFR3.3**: Text SHALL remain legible at all viewport sizes

### NFR4: Browser Compatibility
- **NFR4.1**: Banner SHALL work in Chrome, Firefox, Safari, Edge
- **NFR4.2**: Animations SHALL degrade gracefully if not supported
- **NFR4.3**: Sticky positioning SHALL have fallback for older browsers

## Technical Requirements

### TR1: Component Architecture
- **TR1.1**: Use React functional components with hooks
- **TR1.2**: Implement with TypeScript for type safety
- **TR1.3**: Use Framer Motion for animations
- **TR1.4**: Use NumberFlow for currency animations

### TR2: Data Integration
- **TR2.1**: Use existing `useOpenHarvests` hook for harvest data
- **TR2.2**: Use existing `useHarvestEvalResultQuery` for portfolio data
- **TR2.3**: No modifications to existing GraphQL schema
- **TR2.4**: Maintain real-time data synchronization

### TR3: Styling
- **TR3.1**: Use Tailwind CSS utility classes
- **TR3.2**: Follow existing shadcn/ui component patterns
- **TR3.3**: Use design system color variables
- **TR3.4**: Maintain consistent spacing and typography

## Acceptance Criteria

### Scenario 1: User with no open harvests
**Given** a user has no harvests with future expiration dates  
**When** they view the tax opportunities page  
**Then** the banner displays only portfolio metrics without harvest section

### Scenario 2: User with open harvests
**Given** a user has 3 harvests with future expiration dates  
**When** they view the tax opportunities page  
**Then** the banner displays portfolio metrics AND shows "Pending Harvests: 3"

### Scenario 3: Scroll-triggered appearance
**Given** a user is on the tax opportunities page  
**When** they scroll past the main portfolio status section  
**Then** the compact banner appears at the top with smooth animation

### Scenario 4: Real-time updates
**Given** a user is viewing the banner with 2 pending harvests  
**When** one harvest expires or is completed  
**Then** the count updates to show "Pending Harvests: 1"

### Scenario 5: State transition
**Given** a user completes their last pending harvest  
**When** the harvest count reaches 0  
**Then** the harvest section disappears from the banner

## Design Specifications

### Visual Design
- Primary color (#F9C74F) for harvest count emphasis
- Blue color (#3B82F6) for pending harvest indicator
- Semi-transparent background (95% opacity) with backdrop blur
- 300ms ease-in-out transitions for all animations
- Sticky positioning with z-index 50

### Layout
- Full width container with Card component wrapper
- Horizontal layout with portfolio metrics on left
- Harvest count on right side when present
- Consistent padding (12px on mobile, 16px on desktop)
- Responsive grid for metrics display

## Dependencies

### External Dependencies
- Framer Motion (animations)
- NumberFlow (currency animations)
- Lucide React (icons)

### Internal Dependencies  
- shadcn/ui components (Card, CardContent)
- useOpenHarvests hook
- useScrollPosition hook
- MoneyUtil utility functions

## Risks & Mitigations

### Risk 1: Performance Impact
**Risk**: Scroll event listeners could impact performance  
**Mitigation**: Use passive listeners and throttling

### Risk 2: Data Synchronization
**Risk**: Harvest count might be out of sync  
**Mitigation**: Use GraphQL subscriptions or polling

### Risk 3: Browser Compatibility
**Risk**: Sticky positioning might not work in older browsers  
**Mitigation**: Provide graceful degradation

## Future Enhancements
- Add click action to navigate to harvest management
- Include harvest value total alongside count
- Add notification badge for urgent harvests
- Implement banner customization preferences
- Add harvest deadline countdown timer