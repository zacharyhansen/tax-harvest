# IGO-135: Portfolio Banner with Harvest Counts Implementation Plan

## Overview

Implementation of a compact portfolio banner that displays harvest count information in its default state, providing users with immediate visibility of pending tax loss harvesting opportunities while maintaining a clean interface when no harvests are available.

## Current State Analysis

### Completed Implementation
The core feature has been implemented in commit `1f4d811` with the following components:

1. **PortfolioCompactBanner Component** (`apps/web/components/portfolio-compact-banner.tsx`)
   - Displays portfolio tax status information
   - Conditionally shows harvest count when open harvests exist
   - Hides harvest section when no harvests are pending (default state)

2. **Scroll Position Hook** (`apps/web/modules/hooks/use-scroll-position.ts`)
   - Detects when user scrolls past target element
   - Enables sticky banner behavior

3. **Integration** (`apps/web/app/main/tax-opportunities/page.tsx`)
   - Banner appears when scrolling past main portfolio status section
   - Smooth animations and transitions

### Key Discoveries
- Open harvests are determined by `recommendationExpiresDate >= endOfToday`: `apps/web/modules/hooks/use-open-harvests.ts:8`
- Portfolio data comes from `harvestEvalResult` GraphQL query: `apps/web/app/main/tax-opportunities/page.tsx:75`
- Design system uses shadcn/ui components with Tailwind CSS: `packages/ui/src/shadcn-theme.css`
- Framer Motion handles all animations with 300ms transitions

## Desired End State

A fully functional portfolio banner that:
- ✅ Shows harvest counts only when open harvests exist (implemented)
- ✅ Hides harvest section in default state when no harvests (implemented)
- ✅ Appears on scroll with smooth animations (implemented)
- ⚠️ Is accessible and performant (needs optimization)
- ⚠️ Works across all supported browsers and devices (needs verification)

## What We're NOT Doing

- Not modifying the existing harvest data structure or GraphQL queries
- Not changing the main portfolio status section behavior
- Not implementing harvest action buttons in the compact banner
- Not adding additional metrics beyond the current three (Net Position, Unrealized Gain/Loss)
- Not implementing banner persistence across page navigation

## Implementation Approach

Since the core functionality is implemented, this plan focuses on quality improvements and potential enhancements.

## Phase 1: Accessibility & Performance Optimization

### Overview
Enhance the banner for better accessibility and performance.

### Changes Required:

#### 1. Accessibility Improvements
**File**: `apps/web/components/portfolio-compact-banner.tsx`
**Changes**: 
- Add ARIA labels and roles
- Ensure keyboard navigation support
- Add screen reader announcements for harvest count changes

#### 2. Performance Optimization
**File**: `apps/web/modules/hooks/use-scroll-position.ts`
**Changes**:
- Implement throttling for scroll events
- Add requestAnimationFrame for smoother updates

### Success Criteria:

#### Automated Verification:
- [ ] Type checking passes: `pnpm run typecheck`
- [ ] Linting passes: `pnpm lint`
- [ ] Build completes successfully: `pnpm build`
- [ ] Bundle size increase < 5KB

#### Manual Verification:
- [ ] Banner is fully keyboard navigable
- [ ] Screen readers announce harvest counts properly
- [ ] No scroll performance issues on low-end devices
- [ ] Banner state persists correctly during fast scrolling
- [ ] Color contrast meets WCAG AA standards

---

## Phase 2: Edge Cases & Error Handling

### Overview
Handle edge cases and error scenarios gracefully.

### Changes Required:

#### 1. Error Boundary Implementation
**File**: `apps/web/components/portfolio-compact-banner.tsx`
**Changes**: Add error handling for data loading failures

#### 2. Loading States
**File**: `apps/web/modules/hooks/use-open-harvests.ts`
**Changes**: Improve loading state handling

### Success Criteria:

#### Automated Verification:
- [ ] Type checking includes error states
- [ ] Build handles all edge cases

#### Manual Verification:
- [ ] Banner handles network failures gracefully
- [ ] Loading states are smooth and non-jarring
- [ ] Stale data is handled correctly
- [ ] Banner recovers from errors without page reload

---

## Manual Verification Steps:
1. Navigate to `/main/tax-opportunities`
2. Verify banner is not visible initially
3. Create test harvests with future expiration dates
4. Verify harvest count appears in banner
5. Scroll down past portfolio status section
6. Verify compact banner appears with animation
7. Clear all harvests
8. Verify harvest section disappears (default state)
9. Test on mobile, tablet, and desktop viewports
10. Test with keyboard navigation
11. Test with screen reader

## Performance Considerations

- Scroll event listener uses passive flag for better performance
- Framer Motion animations use GPU-accelerated transforms
- NumberFlow library efficiently animates currency values
- Sticky positioning leverages native browser optimization
- Component uses React.memo for unnecessary re-renders prevention

## Migration Notes

No migration required as this is a new feature addition. The banner gracefully handles both states:
- Existing users with no harvests see clean banner (default state)
- Users with pending harvests immediately see counts
- No data structure changes required

## References

- Original ticket: https://linear.app/harvester/issue/IGO-135/default-state
- Implementation commit: `1f4d811`
- Similar banner pattern: `apps/web/app/main/tax-opportunities/open-harvests-banner.tsx:1-50`
- Design system: `packages/ui/src/shadcn-theme.css`
- GraphQL schema: `apps/api/schema.graphql:4876`