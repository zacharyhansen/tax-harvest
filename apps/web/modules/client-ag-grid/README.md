# AG-Grid Components for Client

This module contains components and configurations for using AG-Grid in the client application.

## Available Cell Components

### JSON Cell

The JSON Cell provides a way to display and potentially edit JSON data within an AG-Grid cell. It shows a summarized view of the JSON data in the cell, and when clicked, opens a dialog with the full JSON content in a textarea.

#### Features

- Compact display of JSON objects/arrays in the grid cell
- Dialog popup with full JSON content
- Monospaced font for better readability
- Optional read-only mode (default is read-only)

#### Usage

To use the JSON cell in your AG-Grid column definition:

```typescript
import { ColDef } from 'ag-grid-community'
import { JsonCell } from '../../modules/client-ag-grid'

const columnDefs: ColDef[] = [
  // ... other columns
  {
    headerName: 'Configuration',
    field: 'configuration',
    cellRenderer: JsonCell,
    cellRendererParams: {
      type: 'json',
      readOnly: true, // Optional, defaults to true
    },
  },
  // Or using the data type approach
  {
    headerName: 'Settings',
    field: 'settings',
    type: 'json', // This will automatically use the JSON cell renderer
  },
]
```

## Example

Here's an example showing how the JSON cell works with different types of data:

```tsx
import { AgGridReact } from 'ag-grid-react'
import { themeQuartzGridOptions } from '../../modules/client-ag-grid'

// Sample data
const rowData = [
  {
    id: 1,
    name: 'Product A',
    config: { enabled: true, features: ['search', 'filter', 'export'] },
    metadata: { created: '2023-05-10', tags: ['featured', 'new'] },
  },
  {
    id: 2,
    name: 'Product B',
    config: { enabled: false, features: [] },
    metadata: null,
  },
]

// Column definitions
const columnDefs = [
  { field: 'id' },
  { field: 'name' },
  {
    headerName: 'Configuration',
    field: 'config',
    type: 'json',
  },
  {
    headerName: 'Metadata',
    field: 'metadata',
    type: 'json',
  },
]

// In your component
return (
  <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
    <AgGridReact
      {...themeQuartzGridOptions}
      rowData={rowData}
      columnDefs={columnDefs}
    />
  </div>
)
```
