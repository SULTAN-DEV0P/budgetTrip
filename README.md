# 🧭 BudgetTrip — Master Engineering Documentation & Developer Guide

> **“Where can I go, where can I stay, what can I eat, and what can I do without exceeding my travel budget?”**

BudgetTrip is a mobile-first travel planning platform focused on intelligent budget allocation, realistic Nigerian place discovery, and automated trip calculation.

* **Repository:** [https://github.com/SULTAN-DEV0P/budgetTrip.git](https://github.com/SULTAN-DEV0P/budgetTrip.git)
* **Figma Design Reference:** [Figma Make App](https://framer-bagel-25194088.figma.site/)
* **Stack:** React 19 / Vite / Tailwind CSS v4 / Lucide React / LocalStorage Persistence

---

## 📑 Table of Contents
1. [Tech Stack & Design Tokens](#1-tech-stack--design-tokens)
2. [Project File Hierarchy](#2-project-file-hierarchy)
3. [Data Models & Schema Specifications](#3-data-models--schema-specifications)
4. [Services & API Abstraction Layer](#4-services--api-abstraction-layer)
5. [Utility Functions & Math Engines](#5-utility-functions--math-engines)
6. [Component Architecture & Screen Routing](#6-component-architecture--screen-routing)
7. [Variable Naming Conventions & State Dictionary](#7-variable-naming-conventions--state-dictionary)
8. [Collaborator Handoff & Next Steps](#8-collaborator-handoff--next-steps)
9. [Development Commands](#9-development-commands)

---

## 1. Tech Stack & Design Tokens

### Core Dependencies
* **Framework:** React 19 (`react`, `react-dom`) with Vite bundler
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
* **Typography:** `Manrope, sans-serif` (Weights: 400, 500, 600, 700, 800)
* **Icons:** `lucide-react` (18–22px unified icon set)
* **Linter:** `oxlint` (Fast Rust-based linter)

### Design Palette & CSS Tokens (`src/index.css`)
```css
--bg-main: #f5f2ed;         /* Primary canvas background (warm linen/sand) */
--bg-card: #ffffff;         /* Elevated surface / card background */
--bg-pill: #f0ece6;         /* Tag and pill backgrounds */
--bg-green-light: #e8f0ec;   /* Accent container / positive badge background */
--green-primary: #1f4a35;    /* Deep luxury forest green (primary brand color) */
--border-subtle: #e4e1db;    /* Divider and card borders */
--text-main: #111110;        /* Heading and primary dark text */
--text-muted: #8a8680;       /* Secondary and metadata text */
--alert-red: #c24a1e;        /* Over-budget and danger text */
--alert-red-bg: #fdf0eb;     /* Over-budget container background */
```

---

## 2. Project File Hierarchy

```text
budget-trip/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx             # Category & status pills
│   │   │   ├── Button.jsx            # Standard button with variants (primary, gold, outline)
│   │   │   ├── Card.jsx              # Surface card wrapper with hover states
│   │   │   └── RatingStars.jsx       # 5-star rating renderer (e.g. 4.8)
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx         # Fixed mobile bottom bar (Home, Explore, My Trip, Budget, Saved)
│   │   │   └── Header.jsx            # Desktop / full-screen top header bar
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx        # Step 1: Hero & Destination discovery cards
│   │   │   ├── SetupScreen.jsx       # Step 2: Trip Setup Wizard (Dates, Travelers, Budget, Preferences)
│   │   │   └── PlaceholderScreen.jsx # Collaborator handoff slots (My Trip, Budget, Saved)
│   │   └── setup/
│   │       ├── DestinationSelector.jsx # Visual selector for Lagos, Abuja, Abeokuta
│   │       └── TripSetupWizard.jsx   # Detailed wizard component
│   ├── data/
│   │   └── mockDestinations.js       # Authentic database for Lagos, Abuja, Abeokuta
│   ├── services/
│   │   ├── destinationService.js     # Destination fetching and search abstraction
│   │   ├── placesService.js          # Place discovery, category filtering, recommendation score
│   │   ├── storageService.js         # LocalStorage synchronization layer
│   │   └── tripService.js            # Dynamic trip generator & budget calculation engine
│   ├── types/
│   │   └── index.js                  # JSDoc schemas, currency definitions, constants
│   ├── utils/
│   │   ├── currency.js               # Currency formatting & NGN conversions
│   │   └── date.js                   # Date math, duration calculations & formatting
│   ├── App.css
│   ├── App.jsx                       # Main application state & screen controller
│   ├── index.css                     # Tailwind v4 import, fonts & theme tokens
│   └── main.jsx                      # React 19 root mount
├── index.html                        # Mobile-first viewport & PWA meta tags
├── package.json
├── vite.config.js                    # Vite configuration with @tailwindcss/vite
└── README.md
```

---

## 3. Data Models & Schema Specifications (`src/types/index.js`)

### A. Place Model (`Place`)
Represents an individual hotel, restaurant, or activity.
```javascript
/**
 * @typedef {Object} Place
 * @property {string} id - Unique identifier (e.g. 'lag-hotel-1')
 * @property {'hotel' | 'restaurant' | 'activity' | 'transport'} type
 * @property {string} name - Place name (e.g. 'Nordic Hotel Lagos')
 * @property {number} rating - 1.0 to 5.0 (e.g. 4.7)
 * @property {number} [reviewCount] - Number of reviews (e.g. 420)
 * @property {string} category - e.g. 'Boutique Hotel', 'Authentic Nigerian Cuisine'
 * @property {Object} location
 * @property {string} location.address - Street address
 * @property {number} location.latitude - Coordinates
 * @property {number} location.longitude - Coordinates
 * @property {string} [location.neighborhood] - Area/District (e.g. 'Victoria Island')
 * @property {number} [distanceKm] - Distance from city center
 * @property {string} imageUrl - High-resolution cover photo URL
 * @property {1 | 2 | 3 | 4} priceLevel - Price tier (1: $, 2: $$, 3: $$$, 4: $$$$)
 * @property {number} estimatedPrice - Realistic price in NGN (e.g. 75000)
 * @property {'night' | 'meal' | 'ticket' | 'trip'} priceUnit
 * @property {string} currency - 'NGN' (default)
 * @property {string[]} tags - e.g. ['Boutique', 'Pool', 'Fine Dining']
 * @property {string} description - Highlight overview of the place
 * @property {'mock' | 'google' | 'curated'} source
 * @property {string} [googlePlaceId] - Future Google Places API ID
 */
```

### B. Destination Model (`Destination`)
```javascript
/**
 * @typedef {Object} Destination
 * @property {string} id - 'lagos' | 'abuja' | 'abeokuta'
 * @property {string} name - 'Lagos' | 'Abuja' | 'Abeokuta'
 * @property {string} state - e.g. 'Lagos State', 'FCT', 'Ogun State'
 * @property {string} country - 'Nigeria'
 * @property {string} currency - 'NGN'
 * @property {string} tagLine - Short catchy summary
 * @property {string} description - In-depth overview
 * @property {string} imageUrl - Hero banner image URL
 * @property {Object} coordinates - { address, latitude, longitude }
 * @property {string[]} popularTags - ['Beach', 'Culture', 'Nightlife', 'Foodie']
 * @property {Object} budgetTier - { budgetDaily, midDaily, luxuryDaily }
 * @property {Place[]} hotels - Available accommodation catalog
 * @property {Place[]} restaurants - Available dining catalog
 * @property {Place[]} activities - Available activities & cultural spots catalog
 */
```

### C. Trip Model (`Trip`)
```javascript
/**
 * @typedef {Object} Trip
 * @property {string} id - Unique trip ID (e.g. 'trip-1787867200000')
 * @property {string} destinationId - 'lagos' | 'abuja' | 'abeokuta'
 * @property {string} destinationName - 'Lagos' | 'Abuja' | 'Abeokuta'
 * @property {string} state - 'Lagos State' | 'FCT' | 'Ogun State'
 * @property {string} country - 'Nigeria'
 * @property {string} currency - 'NGN' | 'USD' | 'EUR' | 'GBP'
 * @property {string} startDate - YYYY-MM-DD (e.g. '2026-08-28')
 * @property {string} endDate - YYYY-MM-DD (e.g. '2026-08-30')
 * @property {number} totalDays - Number of days inclusive (e.g. 3)
 * @property {number} travelers - Number of companions (1 to 10)
 * @property {number} totalBudget - Total trip budget in NGN (e.g. 150000)
 * @property {string[]} interests - ['Art', 'Food', 'Culture', 'Nature', 'Beach', 'Nightlife', 'History']
 * @property {'cheapest' | 'budget' | 'comfortable' | 'any'} accommodationPreference
 * @property {Place} [selectedHotel] - Currently assigned accommodation
 * @property {TripDay[]} days - Day-by-day scheduled slots
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */
```

### D. Budget Breakdown Model (`BudgetBreakdown`)
```javascript
/**
 * @typedef {Object} BudgetBreakdown
 * @property {number} accommodation - Total stay cost for all nights
 * @property {number} food - Total estimated dining cost
 * @property {number} activities - Total tickets & entrance fees
 * @property {number} transportation - Local transit allowance (₦4,000 / day / person)
 * @property {number} totalEstimated - Sum of all categories
 * @property {number} totalBudget - Total user budget
 * @property {number} remaining - (totalBudget - totalEstimated)
 * @property {boolean} isOverBudget - (remaining < 0)
 * @property {number} overAmount - Math.abs(remaining) if over budget, else 0
 * @property {number} percentageUsed - (totalEstimated / totalBudget) * 100
 * @property {number} nights - Total nights (totalDays - 1)
 * @property {number} travelers - Number of travelers
 * @property {Object} categoryPercentages - { accommodation, food, activities, transportation }
 */
```

---

## 4. Services & API Abstraction Layer

### 1. Destination Service (`src/services/destinationService.js`)
* `destinationService.getAllDestinations()` $\rightarrow$ Returns array of all destinations with metadata and place counts.
* `destinationService.getDestinationById(id)` $\rightarrow$ Returns full destination object including all hotels, restaurants, and activities.
* `destinationService.searchDestinations(query)` $\rightarrow$ Filters destinations by name, state, or tags.

### 2. Places Service (`src/services/placesService.js`)
* `placesService.getPlaces(destinationId, category = 'all')` $\rightarrow$ Returns places filtered by `'all' | 'hotel' | 'restaurant' | 'activity'`.
* `placesService.getPlaceById(placeId)` $\rightarrow$ Finds a single place by ID across all destinations.
* `placesService.filterPlaces({ destinationId, category, maxPrice, minRating, interests, sortBy })` $\rightarrow$ Multi-criteria place filtering with 4-factor recommendation scoring:
  $$\text{Score} = (\text{Rating} \times 0.40) + (\text{InterestMatch} \times 0.35) + (\text{ReviewWeight} \times 0.25)$$

### 3. LocalStorage Service (`src/services/storageService.js`)
Provides instant offline persistence across browser sessions:
* `storageService.getCurrentTrip()` $\rightarrow$ Reads `budgettrip_current_trip`
* `storageService.saveCurrentTrip(trip)` $\rightarrow$ Saves current trip object
* `storageService.getSavedPlaces()` $\rightarrow$ Reads `budgettrip_saved_places`
* `storageService.toggleSavePlace(place)` $\rightarrow$ Adds/removes place from bookmarks and saves to `localStorage`
* `storageService.getPreferences()` / `savePreferences(prefs)` $\rightarrow$ Persists user currency & default preferences

### 4. Trip Calculation Engine (`src/services/tripService.js`)
* `tripService.generateTrip(params)` $\rightarrow$ Automatically allocates accommodation, scores dining and activities, and slots them into morning, afternoon, and evening slots.
* `tripService.calculateBudget(trip)` $\rightarrow$ Pure budget math engine calculating total spend, category costs, remaining balance, and over-budget delta.

---

## 5. Utility Functions & Math Engines

### Currency Utilities (`src/utils/currency.js`)
* `formatCurrency(amountInNgn, targetCurrency = 'NGN')`:
  * Returns formatted strings with correct symbols:
    * `formatCurrency(150000, 'NGN')` $\rightarrow$ `"₦150,000"`
    * `formatCurrency(150000, 'USD')` $\rightarrow$ `"$100"`
    * `formatCurrency(150000, 'EUR')` $\rightarrow$ `"€93"`
    * `formatCurrency(150000, 'GBP')` $\rightarrow$ `"£79"`
* `convertToNgn(amount, fromCurrency = 'NGN')`:
  * Converts any foreign currency back to NGN base currency using exchange rates.

### Date Utilities (`src/utils/date.js`)
* `calculateDaysBetween(startDateStr, endDateStr)` $\rightarrow$ Returns total inclusive days (e.g. `'2026-08-28'` to `'2026-08-30'` = `3`).
* `formatDateReadable(dateStr)` $\rightarrow$ Formats date as `"Thu, Aug 28"`.
* `addDaysToDate(startDateStr, daysToAdd)` $\rightarrow$ Computes future date string `'YYYY-MM-DD'`.
* `getDefaultDateRange()` $\rightarrow$ Returns default 3-day trip window `{ startDate, endDate }`.

---

## 6. Component Architecture & Screen Routing

The application uses an explicit mobile `screen` state machine in `src/App.jsx`:

```
+-------------------------------------------------------------------------------+
|                                 App.jsx                                       |
|  screen: 'home' | 'explore' | 'mytrip' | 'budget' | 'saved' | 'ready'         |
+-------------------------------------------------------------------------------+
       │                   │                │            │            │
       ▼                   ▼                ▼            ▼            ▼
 ┌────────────┐     ┌─────────────┐   ┌───────────┐┌───────────┐┌───────────┐
 │ HomeScreen │     │ SetupScreen │   │ MyTrip    ││ Budget    ││ Saved     │
 │            │     │ (Wizard)    │   │ (Slot)    ││ (Slot)    ││ (Slot)    │
 └─────┬──────┘     └──────┬──────┘   └───────────┘└───────────┘└───────────┘
       │ "Start Planning"  │ "Build My Trip"
       └───────────────────┼───────────────────────────────────────────┐
                           ▼                                           ▼
                     ┌───────────┐                              ┌───────────┐
                     │  'ready'  │                              │ BottomNav │
                     │  Summary  │                              │ (5 Tabs)  │
                     └───────────┘                              └───────────┘
```

### Screen Manifest
1. **`HomeScreen` (`src/components/screens/HomeScreen.jsx`)**:
   * Hero header: *"Plan your trip without guessing the cost."*
   * 3 Destination visual cards for **Lagos**, **Abuja**, and **Abeokuta** with starting rates.
   * "Start Planning" action $\rightarrow$ navigates to `explore`.
2. **`SetupScreen` (`src/components/screens/SetupScreen.jsx`)**:
   * Destination selection pills
   * Start and End calendar pickers
   * Travelers counter (`-` / `+`)
   * Total budget input with quick presets (`₦100k`, `₦150k`, `₦250k`, `₦500k`)
   * Travel style / interest pills (Art, Food, Nightlife, Culture, Nature, Beach, History)
   * Stay preference (Cheapest, Budget, Comfortable)
   * "Build My Trip" action $\rightarrow$ triggers `onGenerateTrip` and persists to `localStorage`.
3. **`PlaceholderScreen` (`src/components/screens/PlaceholderScreen.jsx`)**:
   * Stand-in screens for **My Trip**, **Budget**, and **Saved** ready for collaborator implementation.
4. **`BottomNav` (`src/components/layout/BottomNav.jsx`)**:
   * 5 navigation buttons:
     * `Home` (`Home` icon) $\rightarrow$ `setScreen('home')`
     * `Explore` (`Search` magnifying glass icon) $\rightarrow$ `setScreen('explore')`
     * `My Trip` (`Calendar` icon) $\rightarrow$ `setScreen('mytrip')`
     * `Budget` (`Wallet` icon) $\rightarrow$ `setScreen('budget')`
     * `Saved` (`Bookmark` icon) $\rightarrow$ `setScreen('saved')`

---

## 7. Variable Naming Conventions & State Dictionary

To ensure seamless collaboration, always adhere to these exact variable and property names:

| Variable / Prop Name | Type | Description | Example Values |
| :--- | :--- | :--- | :--- |
| `screen` | `string` | Active screen ID in `App.jsx` | `'home'`, `'explore'`, `'mytrip'`, `'budget'`, `'saved'`, `'ready'` |
| `currentTrip` | `Object` | Active trip state object | See [Trip Model](#c-trip-model-trip) |
| `destinationId` | `string` | Lowercase destination identifier | `'lagos'`, `'abuja'`, `'abeokuta'` |
| `destinationName` | `string` | Display name of destination | `'Lagos'`, `'Abuja'`, `'Abeokuta'` |
| `travelers` | `number` | Total companions count | `1`, `2`, `4` |
| `totalBudget` | `number` | Total budget in Nigerian Naira | `150000`, `250000`, `500000` |
| `startDate` | `string` | Trip departure date (`YYYY-MM-DD`) | `'2026-08-28'` |
| `endDate` | `string` | Trip return date (`YYYY-MM-DD`) | `'2026-08-30'` |
| `totalDays` | `number` | Total duration in days (inclusive) | `3` |
| `interests` | `string[]` | Selected interest tags | `['Art', 'Food', 'Culture']` |
| `accommodationPreference`| `string` | Stay style preference | `'cheapest'`, `'budget'`, `'comfortable'` |
| `savedPlaces` | `Place[]` | Array of bookmarked places | `Place[]` |
| `isOverBudget` | `boolean` | Flag when spending exceeds budget | `true` or `false` |
| `estimatedSpending` | `number` | Total calculated expenses in NGN | `127500` |
| `remaining` | `number` | Remaining budget balance in NGN | `22500` |

---

## 8. Collaborator Handoff & Next Steps

Steps 1 & 2 are complete. Your collaborator can now pick up the remaining screens:

### 🛠️ Tasks for Collaborator:
1. **Build `ExploreScreen.jsx` (Place Discovery Catalog)**:
   * Query places using `placesService.getPlaces(currentTrip.destinationId, activeTab)`
   * Render category tabs (`Stay`, `Eat`, `Things To Do`) and filter chips (`Cheapest`, `Highest rated`, `Closest`)
   * Add tap-to-inspect modal/screen for place details.
2. **Build `MyTripScreen.jsx` (Day-by-Day Itinerary)**:
   * Use `tripService.generateTrip(currentTrip)` or schedule slots.
   * Render items with time, cost, grip handle, category icon, and delete action (`Trash2`).
3. **Build `BudgetScreen.jsx` (Category Breakdown & Optimizer)**:
   * Use `tripService.calculateBudget(currentTrip)` to render progress bars for Accommodation, Food, Activities, and Transport.
   * Implement the "Find cheaper options" auto-optimization trigger.
4. **Build `SavedScreen.jsx` (Bookmarks List)**:
   * Connect `storageService.getSavedPlaces()` and `storageService.toggleSavePlace(place)` to render user's saved items with category filter tabs.

---

## 9. Development Commands

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm run dev
# Server ready at: http://localhost:5173/
```

### Run Linter
```bash
npm run lint
# Uses oxlint to verify code quality with 0 errors
```

### Production Build
```bash
npm run build
# Compiles optimized bundle to dist/
```
