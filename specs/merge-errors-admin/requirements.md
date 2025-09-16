# Merge Errors Admin Panel Requirements

## Overview
Create a NestJS CRUD module and Admin panel UI for viewing and managing MultiChangeSet and MultiChangeSetOption records, which appear to represent merge/change operations that may encounter errors during lot processing.

## Business Context
The MultiChangeSet and MultiChangeSetOption models track proposed changes to lots and positions, including:
- Target values or quantities for asset positions
- Lot-level changes and new buy operations
- Resolution status tracking

## Functional Requirements

### Backend (API)
1. **NestJS Module Creation**
   - Create MultiChangeSet module with service and resolver
   - Create MultiChangeSetOption module with service and resolver
   - Implement full CRUD operations for both models
   - Follow portfolio-based Row Level Security (RLS) patterns

2. **GraphQL API Endpoints**
   - Queries: list, single record, filtered queries
   - Mutations: create, update, delete, bulk operations
   - Field resolvers for relationships (account, portfolio, asset, lot)

### Frontend (Admin UI)
1. **Navigation**
   - Add "Merge Errors" item to admin navigation menu
   - Role-restrict to admin users only

2. **List View Page**
   - Display MultiChangeSet records in a data table
   - Show key fields: account, asset, target values, resolution status
   - Filtering by resolved/unresolved status
   - Sorting by date, account, asset
   - Click-through to detail view

3. **Detail View Page**
   - Display full MultiChangeSet details
   - Show related MultiChangeSetOption records
   - Display lot information and proposed changes
   - Action buttons for resolution/management

4. **Management Features**
   - Mark sets as resolved/unresolved
   - View related lot and account information
   - Export data capabilities

## Technical Requirements

### Backend
- Use PrismaService with portfolio-based RLS
- Follow existing resolver patterns with PrismaSelect
- Implement proper authentication via ClerkContext
- Add appropriate JSDoc documentation

### Frontend
- Use AG Grid for data tables (following existing admin patterns)
- Implement with TypeScript and generated GraphQL hooks
- Follow shadcn-ui component patterns
- Include proper loading and error states
- Use toast notifications for user feedback

## Non-Functional Requirements
- Maintain type safety end-to-end
- Follow existing code conventions and patterns
- Include comprehensive error handling
- Ensure responsive design for admin interface

## Out of Scope
- Automated resolution of merge errors
- Modification of lot calculation logic
- Integration with external systems
- Batch processing UI