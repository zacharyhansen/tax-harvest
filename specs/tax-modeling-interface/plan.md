# Tax Modeling Interface - Frontend Implementation Plan

## Overview

Implement a tax modeling interface that allows users to interactively add/remove lots to a "model" to explore tax implications without executing actual harvests. This is frontend-only work with mock data and component interfaces ready for backend integration.

## Current State Analysis

### Existing Components
- **Home Page**: `/apps/web/app/main/home/page.tsx:1-77` - Shows HarvestSummaryCards + LotsTable
- **LotsTable**: `/apps/web/modules/lot/LotsTable/LotsTable.tsx:1-238` - Main holdings table with 10 columns, grouping by asset, sticky header support
- **HarvestSummaryCards**: `/apps/web/modules/harvest/HarvestSummaryCards.tsx:1-101` - 4 summary cards (Harvest, Calendar Year P&L, Unrealized Gains, Unrealized Losses)
- **Dashboard Layout**: `/packages/ui/src/layouts/dashboard.tsx` - Sidebar-based layout with collapsible navigation
- **NavigationMenu**: `/packages/ui/src/components/navigation-menu.tsx` - Horizontal navigation menu component (shadcn)
- **DataTable Component**: `/packages/ui/src/components/dataTable/dataTable.tsx` - Feature-rich table with sticky headers/footers, TanStack Table

### Current Layout
- Left sidebar navigation (collapsible icon mode)
- PageWrapper contains content
- Navigation groups: Portfolio, Manage, Admin (role-based)
- Mobile: hamburger menu with breadcrumbs

### Key Discoveries
- DataTable already supports sticky headers (`sticky top-0`) and footers (`sticky bottom-0`)
- Sheet component available for side panels (`@repo/ui/components/sheet`)
- NavigationMenu component available for horizontal tab navigation
- LocalStorage hooks available via standard React patterns
- LotsTable uses `usePortfolioLotsQuery` for data (GraphQL)

## Desired End State

### UI Changes
1. **New top navigation bar** (tab-based using NavigationMenu component) replacing sidebar
2. **Full-width table** expanding to use entire content area
3. **"Tax Bill" column** added to LotsTable
4. **Sticky footer** with same 4 metrics + new "Projected Tax Bill"
5. **Hover "Add to Model" button** on each lot row
6. **400px side panel** (collapsible to minimized state) showing modeled lots
7. **Model calculations** update live as lots are added/removed

### Backend Integration Points
- Component interfaces/props for calculation hooks
- Mock data structure for development
- TypeScript types for backend contract

## What We're NOT Doing

- No backend API implementation
- No database models or migrations
- No actual tax calculation logic (mock only)
- No GraphQL mutations (state is client-side only for now)
- No changes to existing GraphQL queries (except potentially adding taxBill field to fragments)
- No authentication/authorization changes
- No testing implementation (plan only mentions what to test)

---

## Phase 1: New Top Navigation & Layout Restructuring

### Overview
Replace sidebar navigation with top tab-based navigation using shadcn NavigationMenu component and restructure the dashboard layout for full-width content.

### Changes Required

#### 1. New Top Navigation Component
**File**: `apps/web/app/main/top-navigation.tsx` (NEW)
**Changes**: Create horizontal tab navigation using NavigationMenu component with mobile sheet menu

```typescript
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@repo/ui/components/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { Button } from '@repo/ui/components/button';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { PortfolioSwitcher } from '~/modules/portfolio';
import ThemeButton from './theme-button';
import { TypedRoutes } from '~/lib/routes';
import { Wallet2, Scissors, Wheat, UserPlus, Waypoints, Settings, ShieldCheck, Menu } from 'lucide-react';
import { cn } from '@repo/ui/utils';

const navItems = [
  { href: 'home', label: 'Dashboard', icon: Wallet2 },
  { href: 'taxOpportunities', label: 'Tax Opportunities', icon: Scissors },
  { href: 'harvests', label: 'Harvests', icon: Wheat },
  { href: 'invite', label: 'Invite', icon: UserPlus },
  { href: 'settings', label: 'Settings', icon: Settings },
];

const accountNavItems = [
  { href: 'accounts', label: 'View Accounts', description: 'Manage your connected accounts' },
  // Switch Portfolios will be a custom component, not a route
];

const adminNavItems = [
  { href: 'performance', label: 'Performance', description: 'System performance metrics' },
  // Add other admin routes here
];

export function TopNavigation() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === 'admin';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile: Hamburger Menu */}
        <div className="md:hidden flex-1 flex justify-end items-center gap-2">
          <ThemeButton />
          <UserButton />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] py-4">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const route = TypedRoutes[item.href]();
                    const isActive = item.href === 'settings'
                      ? pathname?.startsWith(route)
                      : pathname === route;

                    return (
                      <Link
                        key={item.href}
                        href={route}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* Account section in mobile */}
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2 px-3 text-sm font-semibold text-muted-foreground">
                      <Waypoints className="h-4 w-4" />
                      Account
                    </div>
                  </div>
                  {accountNavItems.map((item) => {
                    const route = TypedRoutes[item.href]();
                    const isActive = pathname?.startsWith(route);

                    return (
                      <Link
                        key={item.href}
                        href={route}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  {/* Portfolio Switcher in mobile Account section */}
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium mb-2">Switch Portfolio</div>
                    <PortfolioSwitcher />
                  </div>

                  {/* Admin items in mobile */}
                  {isAdmin && (
                    <>
                      <div className="pt-4 pb-2">
                        <div className="flex items-center gap-2 px-3 text-sm font-semibold text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" />
                          Admin
                        </div>
                      </div>
                      {adminNavItems.map((item) => {
                        const route = TypedRoutes[item.href]();
                        const isActive = pathname === route;

                        return (
                          <Link
                            key={item.href}
                            href={route}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <span className="font-medium">{item.label}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </>
                  )}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: Main Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => {
              const route = TypedRoutes[item.href]();
              const isActive = item.href === 'settings'
                ? pathname?.startsWith(route)
                : pathname === route;

              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={route} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={isActive}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}

            {/* Account Dropdown (Desktop) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  {accountNavItems.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={TypedRoutes[item.href]()}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.label}</div>
                          {item.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}

                  {/* Portfolio Switcher in Account dropdown */}
                  <li className="border-t pt-2">
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium mb-2">Switch Portfolio</div>
                      <PortfolioSwitcher />
                    </div>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Admin Dropdown (Desktop only) */}
            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Admin
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    {adminNavItems.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={TypedRoutes[item.href]()}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.label}</div>
                            {item.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop: User Menu & Theme */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeButton />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
```

**Key Features**:
- Uses shadcn NavigationMenu component for desktop
- Uses Sheet component for mobile menu (slide from left)
- **Desktop navigation**: Text-only tabs (no icons), left-aligned
- **Mobile navigation**: Vertical list with icons in sheet menu
- Active state highlighting based on pathname
- **Account dropdown** (desktop) or section (mobile) containing:
  - "View Accounts" link to accounts page
  - Portfolio Switcher component for switching portfolios
- Admin items collapsed into dropdown (desktop) or section (mobile)
- User menu + theme button on right (desktop) or in mobile header
- Sticky at top with backdrop blur
- Responsive breakpoint at `md` (768px)
- **Clean design**: No icons in desktop navigation tabs, left-aligned

#### 2. Update Main Layout
**File**: `apps/web/app/main/layout.tsx`
**Changes**: Replace Dashboard component with new top-nav layout

```typescript
'use client';

import { PortfolioProvider } from '~/modules/portfolio';
import { TopNavigation } from './top-navigation';
import MediaProvider from '@repo/ui/providers/media-provider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MediaProvider>
      <PortfolioProvider>
        <div className="flex min-h-screen flex-col">
          <TopNavigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </PortfolioProvider>
    </MediaProvider>
  );
}
```

#### 3. Create New Page Layout Wrapper
**File**: `apps/web/modules/layout/full-width-page-wrapper.tsx` (NEW)
**Changes**: Create full-width page wrapper without sidebar constraints

```typescript
import { cn } from '@repo/ui/utils';
import type { ReactNode } from 'react';

export function FullWidthPageWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('w-full px-6 py-4', className)}>
      {children}
    </div>
  );
}
```

#### 4. Update Module Exports
**File**: `apps/web/modules/layout/index.ts`
**Changes**: Export FullWidthPageWrapper

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `pnpm --filter web check:types`
- [ ] No ESLint errors: `pnpm --filter web lint`
- [ ] Navigation component renders without errors
- [ ] All existing routes still accessible

#### Manual Verification:
- [ ] **Desktop**: Top navigation appears horizontally across top of page
- [ ] **Desktop**: Navigation tabs are text-only (no icons) and left-aligned
- [ ] **Desktop**: Navigation tabs highlight correctly based on current route
- [ ] **Desktop**: Account dropdown contains "View Accounts" link and Portfolio Switcher
- [ ] **Desktop**: Clicking Account dropdown shows 300px wide panel
- [ ] **Desktop**: Portfolio Switcher works inside Account dropdown
- [ ] **Desktop**: Admin dropdown contains all admin-only items (only for admin users)
- [ ] **Desktop**: User menu and theme button appear on right side
- [ ] **Mobile**: Hamburger menu icon appears on right side
- [ ] **Mobile**: Clicking hamburger opens sheet menu from left
- [ ] **Mobile**: Navigation items appear as vertical list with icons
- [ ] **Mobile**: Account section appears with "View Accounts" link
- [ ] **Mobile**: Portfolio Switcher appears in Account section
- [ ] **Mobile**: Admin section appears below Account section (for admin users)
- [ ] **Mobile**: Clicking nav item closes sheet and navigates
- [ ] **Mobile**: Theme button and user button appear in header
- [ ] **Both**: Navigation is sticky at top when scrolling
- [ ] **Both**: No layout shift or hydration errors
- [ ] **Both**: Active states highlight correctly

---

## Phase 2: Model State Management & Utilities

### Overview
Implement client-side state management for the tax model with localStorage persistence and mock calculation utilities.

### Changes Required

#### 1. Model State Hook
**File**: `apps/web/modules/model/hooks/use-model-state.ts` (NEW)
**Changes**: Create hook for managing model state

```typescript
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePortfolioLotsQuery } from '~/generated/gql';

type ModelStateStorage = {
  isPanelOpen: boolean;
  isPanelMinimized: boolean;
};

const STORAGE_KEY = 'tax-model-state';

export function useModelState() {
  // Panel UI state (persisted to localStorage)
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);

  // Model data (will come from backend later, mocked for now)
  const [modelLotIds, setModelLotIds] = useState<string[]>([]);
  const [addedAt, setAddedAt] = useState<Record<string, number>>({});

  // Load panel state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state: ModelStateStorage = JSON.parse(stored);
        setIsPanelOpen(state.isPanelOpen ?? false);
        setIsPanelMinimized(state.isPanelMinimized ?? false);
      } catch (e) {
        console.error('Failed to parse model state from localStorage', e);
      }
    }
  }, []);

  // Save panel state to localStorage when it changes
  useEffect(() => {
    const state: ModelStateStorage = { isPanelOpen, isPanelMinimized };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isPanelOpen, isPanelMinimized]);

  // Add lot to model
  const addLot = useCallback((lotId: string) => {
    setModelLotIds((prev) => {
      if (prev.includes(lotId)) return prev;
      return [...prev, lotId];
    });
    setAddedAt((prev) => ({
      ...prev,
      [lotId]: Date.now(),
    }));
  }, []);

  // Remove lot from model
  const removeLot = useCallback((lotId: string) => {
    setModelLotIds((prev) => prev.filter((id) => id !== lotId));
    setAddedAt((prev) => {
      const newAddedAt = { ...prev };
      delete newAddedAt[lotId];
      return newAddedAt;
    });
  }, []);

  // Clear all lots from model
  const clearAll = useCallback(() => {
    setModelLotIds([]);
    setAddedAt({});
  }, []);

  // Check if lot is in model
  const isInModel = useCallback(
    (lotId: string) => modelLotIds.includes(lotId),
    [modelLotIds]
  );

  // Sort lot IDs by when they were added (oldest first)
  const sortedLotIds = useMemo(() => {
    return [...modelLotIds].sort((a, b) => {
      return (addedAt[a] ?? 0) - (addedAt[b] ?? 0);
    });
  }, [modelLotIds, addedAt]);

  return {
    modelLotIds,
    addLot,
    removeLot,
    clearAll,
    isInModel,
    isPanelOpen,
    setIsPanelOpen: (open: boolean) => setIsPanelOpen(open),
    isPanelMinimized,
    setIsPanelMinimized: (minimized: boolean) => setIsPanelMinimized(minimized),
    sortedLotIds,
  };
}
```

#### 2. Mock Calculation Hook
**File**: `apps/web/modules/model/hooks/use-model-calculations.ts` (NEW)
**Changes**: Create hook that accepts lot IDs and returns mock calculations

```typescript
'use client';

import { useMemo } from 'react';
import { usePortfolioLotsQuery } from '~/generated/gql';

export function useModelCalculations(lotIds: string[]) {
  const { data, loading } = usePortfolioLotsQuery();

  const calculations = useMemo(() => {
    if (!data?.lots) {
      return {
        unrealizedGains: 0,
        unrealizedLosses: 0,
        realizedGains: 0,
        harvestTotal: 0,
        projectedTaxBill: 0,
      };
    }

    // Filter to only lots in the model
    const modelLots = data.lots.filter((lot) => lotIds.includes(lot.id));

    let totalGains = 0;
    let totalLosses = 0;

    modelLots.forEach((lot) => {
      const costBasis = Number(lot.remainingQty || 0) * Number(lot.price || 0);
      const currentValue =
        Number(lot.remainingQty || 0) * Number(lot.asset.lastPrice || 0);
      const gain = currentValue - costBasis;

      if (gain > 0) {
        totalGains += gain;
      } else {
        totalLosses += Math.abs(gain);
      }
    });

    // Mock tax calculation:
    // Simplified: 20% on long-term gains, 37% on short-term gains
    // For this mock, we'll use 25% average
    const projectedTaxBill = totalGains * 0.25;

    return {
      unrealizedGains: totalGains,
      unrealizedLosses: -totalLosses, // Negative value
      realizedGains: 0, // Model doesn't have realized gains (not executed)
      harvestTotal: totalLosses, // Harvestable amount = losses
      projectedTaxBill,
    };
  }, [data?.lots, lotIds]);

  return {
    ...calculations,
    loading,
  };
}
```

#### 3. TypeScript Types
**File**: `apps/web/modules/model/types.ts` (NEW)
**Changes**: Define TypeScript interfaces for backend contract

```typescript
import type { LotItemFragment } from '~/generated/gql';

export type ModelLot = {
  id: string;
  addedAt: number;
  lot: LotItemFragment;
};

export type ModelCalculations = {
  unrealizedGains: number;
  unrealizedLosses: number;
  realizedGains: number;
  harvestTotal: number;
  projectedTaxBill: number;
};

export type ModelStateStorage = {
  isPanelOpen: boolean;
  isPanelMinimized: boolean;
};
```

#### 4. Model Module Index
**File**: `apps/web/modules/model/index.ts` (NEW)
**Changes**: Export all model-related components and hooks

```typescript
export { useModelState } from './hooks/use-model-state';
export { useModelCalculations } from './hooks/use-model-calculations';
export * from './types';
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `pnpm --filter web check:types`
- [x] useModelState hook initializes with empty state
- [x] localStorage reads/writes correctly
- [x] Mock calculations return expected values

#### Manual Verification:
- [ ] Adding lot IDs to state works
- [ ] Removing lot IDs from state works
- [ ] clearAll empties the model
- [ ] isPanelOpen persists across page refreshes
- [ ] Mock calculations update when lot list changes
- [ ] sortedLotIds returns lots in order of addedAt timestamp

---

## Phase 3: Enhanced LotsTable with Model Controls

### Overview
Add "Tax Bill" column, hover "Add to Model" buttons, and integrate model state into the LotsTable.

### Changes Required

#### 1. Update LotsTable Column Definitions
**File**: `apps/web/modules/lot/LotsTable/LotsTable.tsx:14-182`
**Changes**: Add new "Tax Bill" column and "Actions" column with hover button

```typescript
// Add after totalGainPct column (line 163):

// Tax Bill Column (mock data for now)
columnHelper.accessor(
  (row) => {
    // Mock calculation: 25% of gains if positive, 0 if negative
    const costBasis = Number(row.remainingQty || 0) * Number(row.price || 0);
    const currentValue = Number(row.remainingQty || 0) * Number(row.asset.lastPrice || 0);
    const gain = currentValue - costBasis;
    return gain > 0 ? gain * 0.25 : 0;
  },
  {
    id: 'taxBill',
    header: 'Tax Bill',
    cell: DataTable.MoneyCell,
    aggregationFn: 'sumMoney',
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + Number(row.getValue('taxBill') || 0), 0)
        .toFixed(2);
      return <DataTable.FooterCell label="Total Tax Bill" value={Format.money(total)} />;
    },
    size: 130,
  }
),

// Actions Column (Add to Model button)
columnHelper.display({
  id: 'actions',
  size: 150,
  cell: ({ row }) => <LotModelActions lot={row.original} />,
}),
```

#### 2. Create Lot Model Actions Component
**File**: `apps/web/modules/lot/LotsTable/LotModelActions.tsx` (NEW)
**Changes**: Create hover button component for add/remove from model

```typescript
'use client';

import { Button } from '@repo/ui/components/button';
import { Plus, X } from 'lucide-react';
import type { LotItemFragment } from '~/generated/gql';
import { useModelState } from '~/modules/model';

export function LotModelActions({ lot }: { lot: LotItemFragment }) {
  const { isInModel, addLot, removeLot, setIsPanelOpen } = useModelState();
  const inModel = isInModel(lot.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inModel) {
      removeLot(lot.id);
    } else {
      addLot(lot.id);
      // Auto-open panel when adding first lot
      setIsPanelOpen(true);
    }
  };

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant={inModel ? 'secondary' : 'outline'}
        size="sm"
        onClick={handleClick}
      >
        {inModel ? (
          <>
            <X className="h-3 w-3 mr-1" />
            Remove from Model
          </>
        ) : (
          <>
            <Plus className="h-3 w-3 mr-1" />
            Add to Model
          </>
        )}
      </Button>
    </div>
  );
}
```

#### 3. Update LotsTable Component
**File**: `apps/web/modules/lot/LotsTable/LotsTable.tsx:196-237`
**Changes**: Import and use new components

```typescript
// Add imports at top:
import { LotModelActions } from './LotModelActions';

// Update DataTable rendering to include group class for hover:
// Modify the return statement to wrap table rows with group class
// This is handled by DataTable component, but verify it supports rowClassName prop
```

#### 4. Update Module Exports
**File**: `apps/web/modules/lot/index.ts`
**Changes**: Export new LotModelActions component

```typescript
export { default as LotsTable } from './LotsTable/LotsTable';
export { LotModelActions } from './LotsTable/LotModelActions';
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `pnpm --filter web check:types`
- [ ] No ESLint errors in LotsTable
- [x] Tax Bill column renders without errors
- [x] LotModelActions component renders without errors

#### Manual Verification:
- [ ] Tax Bill column appears in table with mocked values
- [ ] Footer shows total tax bill across all lots
- [ ] Hovering over row reveals "Add to Model" button
- [ ] Button text changes to "Remove from Model" when lot is in model
- [ ] Clicking button adds/removes lot from model state
- [ ] Panel auto-opens when first lot is added
- [ ] Button appears on right side of each row
- [ ] Hover effect is smooth with transition

---

## Phase 4: Sticky Footer with Model Metrics

### Overview
Add sticky footer to home page showing portfolio summary metrics (including new Projected Tax Bill).

### Changes Required

#### 1. Create Model Summary Footer Component
**File**: `apps/web/modules/model/ModelSummaryFooter.tsx` (NEW)
**Changes**: Create sticky footer component with metrics

```typescript
'use client';

import DataCard from '@repo/ui/components/dataCard';
import { TrendingDown, TrendingUp, Wheat, Receipt } from 'lucide-react';
import { useModelState, useModelCalculations } from '~/modules/model';
import { Format, MoneyUtil } from '~/modules/utils';

export function ModelSummaryFooter() {
  const { modelLotIds } = useModelState();
  const {
    harvestTotal,
    realizedGains,
    unrealizedGains,
    unrealizedLosses,
    projectedTaxBill,
    loading
  } = useModelCalculations(modelLotIds);

  const getAmountColor = (amount: number | undefined) => {
    const direction = MoneyUtil.amountDirection(amount);
    return direction === 'positive' ? 'text-green-600'
         : direction === 'negative' ? 'text-red-600'
         : '';
  };

  const realizedDirection = MoneyUtil.amountDirection(realizedGains);

  return (
    <div className="sticky bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-5">
        <DataCard
          loading={loading}
          data={<p className={getAmountColor(harvestTotal)}>{Format.money(harvestTotal)}</p>}
          title="The Harvest"
          icon={<Wheat className="text-primary" />}
          description="Total harvestable amount"
        />
        <DataCard
          loading={loading}
          data={<p className={getAmountColor(realizedGains)}>{Format.money(realizedGains)}</p>}
          title="Calendar Year P&L"
          icon={
            realizedDirection !== 'negative' ? (
              <TrendingUp className="text-green-600" />
            ) : (
              <TrendingDown className="text-red-600" />
            )
          }
          description="Realized profit / loss"
        />
        <DataCard
          loading={loading}
          data={<p className={getAmountColor(unrealizedGains)}>{Format.money(unrealizedGains)}</p>}
          title="Unrealized Gains"
          icon={<TrendingUp className="text-green-600" />}
          description="Total unrealized gains"
        />
        <DataCard
          loading={loading}
          data={<p className={getAmountColor(unrealizedLosses)}>{Format.money(unrealizedLosses)}</p>}
          title="Unrealized Losses"
          icon={<TrendingDown className="text-red-600" />}
          description="Total unrealized losses"
        />
        <DataCard
          loading={loading}
          data={<p className={getAmountColor(projectedTaxBill)}>{Format.money(projectedTaxBill)}</p>}
          title="Projected Tax Bill"
          icon={<Receipt className="text-primary" />}
          description="Estimated tax on model"
        />
      </div>
    </div>
  );
}
```

#### 2. Update Home Page Layout
**File**: `apps/web/app/main/home/page.tsx:33-76`
**Changes**: Remove top HarvestSummaryCards, add ModelSummaryFooter to bottom

```typescript
'use client';

import { SetUpStatus, usePortfolioSummaryQuery } from '~/generated/gql';
import { NoAccounts } from '~/modules/account';
import { LotsTable } from '~/modules/lot';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { ModelSummaryFooter, ModelPanel } from '~/modules/model';
import { cn } from '@repo/ui/utils';
import { useModelState } from '~/modules/model';

export default function HomePage() {
  const { data, loading, error } = usePortfolioSummaryQuery();
  const { isPanelOpen, isPanelMinimized } = useModelState();

  if (!data && loading) {
    return <LoadingPage message="Retrieving your portfolio information" />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (data?.portfolioSummary.setUpStatus === SetUpStatus.NoAccounts) {
    return <NoAccounts />;
  }

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden">
      {/* Main scrollable content area */}
      <div
        className={cn(
          "flex-1 overflow-y-auto pb-[200px] transition-all duration-300",
          isPanelOpen && !isPanelMinimized ? "pr-[400px]" : ""
        )}
      >
        <div className="w-full px-6 py-4">
          <LotsTable />
        </div>
      </div>

      {/* Sticky footer */}
      <ModelSummaryFooter />

      {/* Model panel */}
      <ModelPanel />
    </div>
  );
}
```

#### 3. Update Module Exports
**File**: `apps/web/modules/model/index.ts`
**Changes**: Export ModelSummaryFooter

```typescript
export { useModelState } from './hooks/use-model-state';
export { useModelCalculations } from './hooks/use-model-calculations';
export { ModelSummaryFooter } from './ModelSummaryFooter';
export * from './types';
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `pnpm --filter web check:types`
- [x] Component renders without errors
- [x] No layout shift issues

#### Manual Verification:
- [ ] Footer sticks to bottom of viewport when scrolling
- [ ] Footer shows all 5 metrics (Harvest, P&L, Unrealized Gains/Losses, Projected Tax Bill)
- [ ] Metrics update when lots are added to model
- [ ] Footer has semi-transparent backdrop blur effect
- [ ] Footer remains visible at all times
- [ ] Table content has appropriate padding to avoid being hidden by footer

---

## Phase 5: Model Side Panel

### Overview
Create collapsible 400px side panel that shows lots in the model, with minimize/expand states and Clear All functionality.

### Changes Required

#### 1. Create Model Panel Component
**File**: `apps/web/modules/model/ModelPanel.tsx` (NEW)
**Changes**: Create side panel with lot list and controls

```typescript
'use client';

import { Button } from '@repo/ui/components/button';
import { X, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { Badge } from '@repo/ui/components/badge';
import { useModelState } from './hooks/use-model-state';
import { usePortfolioLotsQuery } from '~/generated/gql';
import { Format, isOlderThanOneYear } from '~/modules/utils';
import { useEffect } from 'react';

export function ModelPanel() {
  const {
    modelLotIds,
    sortedLotIds,
    removeLot,
    clearAll,
    isPanelOpen,
    setIsPanelOpen,
    isPanelMinimized,
    setIsPanelMinimized,
  } = useModelState();

  const { data } = usePortfolioLotsQuery();

  // Filter lots from query data based on modelLotIds, maintaining sort order
  const modelLots = sortedLotIds
    .map((lotId) => data?.lots.find((lot) => lot.id === lotId))
    .filter(Boolean);

  // Auto-open panel when first lot is added
  useEffect(() => {
    if (modelLotIds.length > 0 && !isPanelOpen) {
      setIsPanelOpen(true);
    }
  }, [modelLotIds.length, isPanelOpen, setIsPanelOpen]);

  if (!isPanelOpen) return null;

  return (
    <>
      {/* Minimized state - small tab on right edge */}
      {isPanelMinimized && (
        <button
          type="button"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 cursor-pointer bg-primary text-primary-foreground px-2 py-8 rounded-l-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
          onClick={() => setIsPanelMinimized(false)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="[writing-mode:vertical-rl] text-sm font-semibold">
            Model ({modelLots.length})
          </span>
        </button>
      )}

      {/* Full panel */}
      {!isPanelMinimized && (
        <div className="fixed right-0 top-0 bottom-0 w-[400px] z-40 border-l bg-background shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Tax Model</h2>
              <Badge variant="secondary">{modelLots.length} lots</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPanelMinimized(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Clear All Button */}
          {modelLots.length > 0 && (
            <div className="border-b p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={clearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}

          {/* Lot List */}
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-4 space-y-2">
              {modelLots.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No lots in model</p>
                  <p className="text-sm mt-2">Hover over lots in the table to add them</p>
                </div>
              ) : (
                modelLots.map((lot) => {
                  if (!lot) return null;
                  const isLongTerm = isOlderThanOneYear(lot.acquiredDate);
                  const costBasis = Number(lot.remainingQty) * Number(lot.price);
                  const currentValue = Number(lot.remainingQty) * Number(lot.asset.lastPrice);
                  const gain = currentValue - costBasis;

                  return (
                    <div
                      key={lot.id}
                      className="group relative border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{lot.assetSymbol}</span>
                            <Badge variant={isLongTerm ? 'default' : 'secondary'}>
                              {isLongTerm ? 'Long Term' : 'Short Term'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-0.5">
                            <div>Qty: {Number(lot.remainingQty).toFixed(2)}</div>
                            <div>Purchased: {Format.date(lot.acquiredDate)}</div>
                            <div>Cost Basis: {Format.money(costBasis)}</div>
                            <div className={gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                              Gain: {Format.money(gain)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeLot(lot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}
```

#### 2. Update Module Exports
**File**: `apps/web/modules/model/index.ts`
**Changes**: Export ModelPanel

```typescript
export { useModelState } from './hooks/use-model-state';
export { useModelCalculations } from './hooks/use-model-calculations';
export { ModelSummaryFooter } from './ModelSummaryFooter';
export { ModelPanel } from './ModelPanel';
export * from './types';
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `pnpm --filter web check:types`
- [ ] No ESLint errors
- [x] Component renders without errors

#### Manual Verification:
- [ ] Panel automatically opens when first lot is added to model
- [ ] Panel is 400px wide
- [ ] Panel can be minimized to small tab on right edge
- [ ] Minimized tab shows lot count
- [ ] Clicking minimized tab expands panel
- [ ] Clear All button removes all lots and updates UI
- [ ] Lots are ordered by time added (oldest first)
- [ ] Hovering over lot in panel shows remove (X) button
- [ ] Clicking remove button removes lot from model
- [ ] Panel scrolls when many lots are added
- [ ] Panel shows empty state with helpful message when no lots
- [ ] Close button (X) hides panel
- [ ] Panel state persists across page refreshes (localStorage)

---

## Phase 6: Full-Width Table & Sticky Header

### Overview
Expand table to full width and ensure sticky header works correctly with new layout.

### Changes Required

#### 1. Update LotsTable Container
**File**: `apps/web/modules/lot/LotsTable/LotsTable.tsx:196`
**Changes**: Update className for full-width rendering

```typescript
<DataTable
  className="w-full min-h-[700px]" // w-full ensures full width
  columns={columnDef}
  // ... rest of props
/>
```

#### 2. Verify DataTable Sticky Header
**File**: `packages/ui/src/components/dataTable/dataTable.tsx`
**Changes**: Verify sticky header has correct z-index and background (likely already correct)

The DataTable component should already have sticky header support. Verify it has:
```typescript
<TableHeader className="sticky top-0 bg-background z-30 shadow-sm">
  {/* header content */}
</TableHeader>
```

If not, update the className to include these styles.

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `pnpm --filter web check:types`
- [x] No layout shift warnings
- [x] Table renders full width

#### Manual Verification:
- [ ] Table expands to full width of viewport
- [ ] When model panel is open, table content shifts left smoothly to avoid being hidden
- [ ] When model panel is minimized, table uses full width again
- [ ] Table header stays pinned at top when scrolling (below top navigation)
- [ ] Header has subtle shadow/border for visibility
- [ ] No horizontal scrollbar appears
- [ ] Content is not cut off by panel
- [ ] Transition is smooth when panel opens/closes (300ms duration)

---

## Testing Strategy

### Unit Tests
**Note**: Testing implementation is out of scope, but these are the recommended tests:

- `useModelState` hook:
  - Adding/removing lot IDs
  - clearAll functionality
  - localStorage persistence
  - sortedLotIds ordering

- `useModelCalculations` hook:
  - Mock calculation formulas
  - Empty state handling
  - Loading states

### Integration Tests
- Model workflow:
  - Add lot → panel opens → lot appears in panel
  - Remove lot → lot disappears from panel
  - Clear all → panel shows empty state
  - Refresh page → panel state persists

### Manual Testing Checklist

#### Navigation
- [ ] Top navigation tabs highlight correctly
- [ ] All routes still accessible
- [ ] Admin dropdown shows for admin users only
- [ ] Icons appear next to navigation labels
- [ ] Navigation is sticky at top

#### Model Interactions
- [ ] Hover over row shows "Add to Model" button
- [ ] Click add button adds lot to model
- [ ] Panel opens automatically on first add
- [ ] Lot appears in panel list
- [ ] Lots are ordered by add time (oldest first)
- [ ] Hover over lot in panel shows remove button
- [ ] Remove button removes lot from model
- [ ] "Remove from Model" button appears in table for lots in model
- [ ] Clear All button removes all lots

#### Panel Behavior
- [ ] Panel is 400px wide
- [ ] Panel can be minimized to tab
- [ ] Minimized tab shows lot count
- [ ] Clicking tab expands panel
- [ ] Close button hides panel
- [ ] Panel state persists across refreshes
- [ ] Scrolling works with many lots

#### Layout & Styling
- [ ] Table is full width
- [ ] Table header sticks at top when scrolling (below top nav)
- [ ] Footer sticks at bottom at all times
- [ ] Footer shows all 5 metrics
- [ ] Tax Bill column appears in table
- [ ] Content adjusts when panel opens/closes
- [ ] No content is hidden by panel
- [ ] Smooth transitions (300ms)

#### Calculations
- [ ] Footer metrics update when lots added to model
- [ ] Projected Tax Bill shows mocked value
- [ ] Tax Bill column shows mocked values
- [ ] Footer totals match sum of visible rows

#### Edge Cases
- [ ] Empty model state shows helpful message
- [ ] Panel handles 100+ lots without performance issues
- [ ] Works on mobile viewports
- [ ] Works with table grouping enabled
- [ ] Works with table filtering/sorting

---

## Performance Considerations

### Optimization Strategies
1. **Memoization**: Memoize sorted lots calculation in `useModelState`
2. **Virtual Scrolling**: If panel has 100+ lots, consider react-window for virtualization
3. **Debounce**: Debounce localStorage writes (not needed for panel state, but good practice)
4. **React.memo**: Wrap lot cards in panel to prevent unnecessary re-renders
5. **Calculation Caching**: Memoize calculation results in `useModelCalculations`

### Potential Issues
- Large number of lots in model (100+) may slow down panel rendering
- Frequent localStorage writes could impact performance (use debounce if needed)
- Table re-rendering when model state changes (use React.memo on row components if needed)

---

## Migration Notes

### Breaking Changes
- **Layout change**: Sidebar navigation → top navigation (major UI change)
- **Home page structure**: Content now full-width instead of constrained

### User Impact
- Users will see new navigation layout immediately
- Existing workflows (viewing holdings, harvests, etc.) remain the same
- Model feature is additive - doesn't affect existing functionality

### Rollback Plan
If issues arise:
1. Revert home page to use old PageWrapper
2. Revert layout to use Dashboard with sidebar
3. Model feature is self-contained and can be disabled by removing ModelPanel component

---

## Component Dependency Tree

```
HomePage
├── TopNavigation (NEW - NavigationMenu based)
│   ├── PortfolioSwitcher
│   ├── NavigationMenu Items
│   └── UserMenu + ThemeButton
├── LotsTable (MODIFIED)
│   ├── LotModelActions (NEW)
│   └── Tax Bill Column (NEW)
├── ModelSummaryFooter (NEW)
│   └── useModelCalculations (NEW)
└── ModelPanel (NEW)
    └── useModelState (NEW)
```

---

## File Structure Summary

### New Files (12)
```
apps/web/app/main/top-navigation.tsx
apps/web/modules/layout/full-width-page-wrapper.tsx
apps/web/modules/model/index.ts
apps/web/modules/model/types.ts
apps/web/modules/model/hooks/use-model-state.ts
apps/web/modules/model/hooks/use-model-calculations.ts
apps/web/modules/model/ModelPanel.tsx
apps/web/modules/model/ModelSummaryFooter.tsx
apps/web/modules/lot/LotsTable/LotModelActions.tsx
```

### Modified Files (5)
```
apps/web/app/main/layout.tsx                    (replace sidebar with top nav)
apps/web/app/main/home/page.tsx                 (add model components, full-width layout)
apps/web/modules/lot/LotsTable/LotsTable.tsx    (add columns, import actions)
apps/web/modules/lot/index.ts                   (export new component)
apps/web/modules/layout/index.ts                (export new wrapper)
```

---

## References

- **Linear ticket**: [IGO-148](https://linear.app/harvester/issue/IGO-148/create-a-model)
- **Current LotsTable**: `apps/web/modules/lot/LotsTable/LotsTable.tsx:1-238`
- **DataTable component**: `packages/ui/src/components/dataTable/dataTable.tsx`
- **NavigationMenu component**: `packages/ui/src/components/navigation-menu.tsx`
- **Sheet component**: `packages/ui/src/components/sheet.tsx`
- **Dashboard layout**: `packages/ui/src/layouts/dashboard.tsx`
- **Navigation patterns**: `apps/web/app/main/nav-tree.tsx`
