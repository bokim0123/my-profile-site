# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**나의 버킷 리스트** (My Bucket List) is a lightweight, serverless web application for managing and tracking life goals. It requires no build tools, no backend server, and no package manager.

**Technology Stack:**
- Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3
- CSS Framework: Tailwind CSS (CDN)
- Data Storage: LocalStorage API (browser)
- Architecture: No frameworks, no dependencies

## Architecture & Code Organization

### Core Module Structure

The application uses a **two-module architecture** with clear separation of concerns:

**1. BucketStorage Module (js/storage.js)**
- Single object that acts as the data persistence layer
- Manages all LocalStorage read/write operations with JSON serialization
- Provides pure data operations: `addItem()`, `updateItem()`, `deleteItem()`, `toggleComplete()`
- Computes derived data: `getStats()` (totals, counts, completion rate), `getFilteredList(filter)`
- No DOM dependencies; can be used standalone
- All methods load/save from LocalStorage atomically

**2. BucketListApp Class (js/app.js)**
- Manages application state: `currentFilter` and `editingId`
- Handles all user interactions via event listeners
- Renders the UI by calling `BucketStorage` methods and building HTML strings
- DOM element references cached in constructor to avoid repeated queries
- Main entry point: `render()` updates statistics, applies current filter, and regenerates the list DOM

### Data Model

Each bucket list item is a plain object:
```javascript
{
  id: "1730880000000",           // Unique ID (Date.now() as string)
  title: "Learn Rust",           // User-provided goal text
  completed: false,              // Boolean completion status
  createdAt: "2025-11-06T...",  // ISO timestamp of creation
  completedAt: null              // ISO timestamp of completion (null until completed)
}
```

Storage format: Array of these objects, serialized to JSON in LocalStorage key `'bucketList'`.

### UI Data Flow

```
User Action (click, type, etc.)
       ↓
Event Handler (in BucketListApp)
       ↓
Call BucketStorage method to mutate data
       ↓
this.render()
       ↓
Recalculate stats → Update statistics display
Fetch filtered list → Regenerate list HTML
       ↓
Update DOM with new HTML
```

## Running the Application

**No build step required.** Simply open the HTML file:

### Option 1: Direct File Open (Simplest)
```bash
# Windows: Double-click bucket-list-main/index.html
# Or drag index.html to your browser
```

### Option 2: Python Simple Server (Recommended for Development)
```bash
# Navigate to project directory
cd bucket-list-main
python -m http.server 8000
# Visit http://localhost:8000 in browser
```

### Option 3: VS Code Live Server Extension
```bash
# Install extension, then right-click index.html → "Open with Live Server"
```

## Key Files & Their Roles

| File | Responsibility | Key Exports |
|------|---|---|
| **index.html** | Semantic HTML structure, Tailwind CDN, modal template | - |
| **js/storage.js** | Data persistence, CRUD operations, filtering, statistics | `BucketStorage` (object) |
| **js/app.js** | UI state, event handling, rendering | `BucketListApp` (class), global `app` instance |
| **css/styles.css** | Animations (slideIn, fadeIn), responsive overrides, dark mode | - |

## Development Guidelines

### Adding New Features

**If the feature involves data storage or logic:**
1. Add a method to `BucketStorage` in `js/storage.js`
2. Call it from an event handler in `BucketListApp`
3. Trigger `this.render()` to update the UI

**If the feature is UI-only:**
1. Add HTML to `index.html` or the `createBucketItemHTML()` method
2. Add event listener or handler in `BucketListApp`
3. Call `this.render()` when state changes

**Example: Adding a priority field to items**
1. Add `priority: 'low'` to item object in `BucketStorage.addItem()`
2. Update `createBucketItemHTML()` to display priority
3. Add a method to `BucketStorage` to sort by priority
4. Add buttons to `index.html` to filter by priority, handle them in `BucketListApp.handleFilter()`

### Security Notes

- **XSS Prevention**: User input is HTML-escaped via `escapeHtml()` before rendering. Always use this method when displaying user-provided text.
- **LocalStorage Only**: No network requests; data never leaves the browser.
- **No Configuration Secrets**: No API keys or sensitive data in the codebase.

### Responsive Design

Tailwind classes handle most responsive behavior. Custom breakpoint override in `css/styles.css`:
```css
@media (max-width: 640px) {
  /* Mobile-specific adjustments (buttons stack vertically, etc.) */
}
```

Breakpoints: Mobile (< 640px), Tablet (768px+), Desktop (1024px+)

### State Management

- **Data**: Loaded from LocalStorage on app init, always kept in sync
- **Filter**: Stored in `app.currentFilter`, updated by filter button clicks
- **Edit Modal**: `app.editingId` tracks which item is being edited; null when modal is closed

### Modal Pattern

The edit modal uses a simple show/hide pattern:
- `openEditModal(id, title)`: Populate form, show modal
- `closeEditModal()`: Clear form, hide modal
- `handleEditSubmit()`: Validate, save, close, re-render

Modal closes either by submit, cancel button, or clicking the backdrop (event delegation on modal itself).

## Testing

No test framework is set up. Test manually:

1. **Add/Edit/Delete**: Create items, modify text, delete and confirm
2. **Filter Switching**: Click all/active/completed filters and verify list updates
3. **Data Persistence**: Add items, reload page (Ctrl+R or browser refresh), verify data remains
4. **Responsive**: Resize browser to mobile (320px), tablet (768px), desktop (1024px+) and verify layout
5. **Statistics**: Add/complete items and verify total, completed, progress counts and completion rate

## Customization

### Colors
Tailwind color classes are in `index.html`. To change theme:
- Primary (buttons): Change `bg-blue-600` → your color (e.g., `bg-purple-600`)
- Success (completed): Change `bg-green-500` → your color
- Danger (delete): Change `bg-red-100` → your color

### Filters
To add a new filter (e.g., "starred"):
1. Add button to `index.html`: `<button class="filter-btn" data-filter="starred">`
2. Add case to `BucketStorage.getFilteredList(filter)` to handle `'starred'`
3. Update item model to include a `starred` field if needed

## Performance Notes

- **LocalStorage Limit**: 5-10MB typically; at ~1KB per item, supports ~5000-10000 items comfortably
- **Rendering**: Full list DOM rebuild on every change (acceptable at current scale; if list grows beyond 1000 items, consider virtual scrolling)
- **DOM Caching**: Constructor caches all frequently-used element references to avoid repeated `querySelector` calls

## Browser Compatibility

Requires:
- ES6+ (arrow functions, template literals, const/let)
- LocalStorage API
- CSS3 (Flexbox, Animations)

Supported: Chrome, Firefox, Safari, Edge (all modern versions)
