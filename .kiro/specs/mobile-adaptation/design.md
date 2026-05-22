# Design Document: Mobile Adaptation for FIITrack

## Overview

This design document specifies the technical architecture for transforming the FIITrack system from a desktop-only application into a mobile-first responsive web application. The system currently uses React 19.2.4, Vite, and Tailwind CSS, but lacks any mobile responsiveness, resulting in broken layouts, unusable touch targets (17px buttons), and horizontal scrolling on mobile devices.

### Current State

The FIITrack system is a fund management application with the following characteristics:
- **Frontend Stack**: React 19.2.4, Vite, Tailwind CSS, React Router, React Icons
- **Backend**: Node.js with SQLite database
- **Authentication**: JWT-based authentication
- **UI Components**: Custom TableAcoes component, Sidebar navigation, DataCard components
- **Design System**: Dark theme with emerald accent (#10b981), slate backgrounds (#0f172a, #1e293b)

**Critical Mobile Issues**:
1. Tables with horizontal scroll make data unreadable on mobile
2. Fixed sidebar (250px) breaks layout on small screens
3. Action buttons are too small (17px) for touch interaction
4. Modals are not adapted for mobile viewports
5. No responsive breakpoint detection system
6. Forms have inadequate touch targets and input sizing

### Target State

The mobile-first adaptation will provide:
- **Responsive Detection**: Custom `useBreakpoint` hook for device type detection
- **Adaptive Layouts**: Sidebar converts to overlay on mobile, tables convert to card views
- **Touch-Optimized UI**: Minimum 48px touch targets, mobile-friendly forms
- **Mobile Components**: CardView, BottomSheet, ActionMenu components
- **Performance**: Lazy loading, virtualization, skeleton states
- **PWA Support**: Service worker, offline capabilities, installable app
- **Backward Compatibility**: Gradual migration without breaking desktop functionality

### Design Goals

1. **Mobile-First**: Prioritize mobile experience while maintaining desktop productivity
2. **Performance**: Achieve Lighthouse mobile score >80, FCP <2s on 3G
3. **Accessibility**: WCAG 2.1 Level AA compliance, screen reader support
4. **Maintainability**: Reusable components, clear separation of concerns
5. **Gradual Migration**: Allow page-by-page adoption without system-wide changes


## Architecture

### System Architecture Overview

The mobile adaptation follows a layered architecture that maintains backward compatibility while introducing responsive capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Pages: Dashboard, Usuarios, MeusFiis, etc.)               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                  Responsive Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ useBreakpoint│  │ResponsiveTable│  │BottomSheet   │     │
│  │    Hook      │  │   Wrapper    │  │  Component   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                  Component Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  TableAcoes  │  │   CardView   │  │  ActionMenu  │     │
│  │  (Desktop)   │  │   (Mobile)   │  │   (Mobile)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Sidebar    │  │    Layout    │  │   TopBar     │     │
│  │  (Adaptive)  │  │  (Adaptive)  │  │  (Adaptive)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                   Foundation Layer                           │
│  • React 19.2.4  • Tailwind CSS  • React Router             │
│  • Vite Build    • React Icons   • Axios HTTP               │
└─────────────────────────────────────────────────────────────┘
```

### Breakpoint System

The system uses three breakpoints aligned with common device sizes:

| Breakpoint | Width Range | Device Type | Layout Strategy |
|------------|-------------|-------------|-----------------|
| Mobile     | < 768px     | Smartphones | Single column, cards, overlay sidebar |
| Tablet     | 769-1024px  | Tablets     | Hybrid layout, optional sidebar |
| Desktop    | > 1024px    | Desktops    | Multi-column, tables, fixed sidebar |


### Responsive Detection Strategy

The `useBreakpoint` hook uses `window.matchMedia` API for optimal performance:

**Advantages over resize events**:
- Native browser API with better performance
- No debouncing needed
- Immediate updates on breakpoint changes
- Lower CPU usage

**Implementation approach**:
```javascript
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
    const desktopQuery = window.matchMedia('(min-width: 1025px)');

    const updateBreakpoint = () => {
      setBreakpoint({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches
      });
    };

    // Initial check
    updateBreakpoint();

    // Listen for changes
    mobileQuery.addEventListener('change', updateBreakpoint);
    tabletQuery.addEventListener('change', updateBreakpoint);
    desktopQuery.addEventListener('change', updateBreakpoint);

    return () => {
      mobileQuery.removeEventListener('change', updateBreakpoint);
      tabletQuery.removeEventListener('change', updateBreakpoint);
      desktopQuery.removeEventListener('change', updateBreakpoint);
    };
  }, []);

  return breakpoint;
};
```


## Components and Interfaces

### 1. useBreakpoint Hook

**Purpose**: Centralized responsive breakpoint detection for the entire application.

**Location**: `src/hooks/useBreakpoint.js`

**Interface**:
```typescript
interface BreakpointState {
  isMobile: boolean;   // < 768px
  isTablet: boolean;   // 768px - 1024px
  isDesktop: boolean;  // > 1024px
}

function useBreakpoint(): BreakpointState
```

**Usage Example**:
```javascript
import useBreakpoint from '@/hooks/useBreakpoint';

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

**Key Features**:
- Uses `window.matchMedia` for performance
- Updates within 100ms of viewport change
- Automatic cleanup on unmount
- No external dependencies


### 2. ResponsiveTable Component

**Purpose**: Wrapper component that renders TableAcoes on desktop and CardView on mobile.

**Location**: `src/components/ResponsiveTable/ResponsiveTable.jsx`

**Interface**:
```typescript
interface ResponsiveTableProps {
  // Inherited from TableAcoes
  coluna: Array<{
    titulo: string;
    acesso: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: any) => React.ReactNode;
    truncate?: boolean;
  }>;
  data: Array<any>;
  itemsPerPage?: number;
  labelpesquisa?: string;
  
  // Action handlers
  usaVisualizar?: boolean;
  acaoVisualizar?: (item: any) => void;
  usaEditar?: boolean;
  acaoEditar?: (item: any) => void;
  usaExcluir?: boolean;
  acaoExcluir?: (item: any) => void;
  usaResetarSenha?: boolean;
  acaoResetarSenha?: (item: any) => void;
  usaInativar?: boolean;
  acaoInativar?: (item: any) => void;
  usaReativar?: boolean;
  acaoReativar?: (item: any) => void;
  
  // Mobile-specific
  cardPrimaryFields?: string[];  // Fields to show in card header
  cardSecondaryFields?: string[]; // Fields to show in card body
}
```

**Behavior**:
- Detects breakpoint using `useBreakpoint` hook
- Renders `TableAcoes` when `isDesktop` or `isTablet`
- Renders `CardView` when `isMobile`
- Maintains same props interface for backward compatibility
- Passes all action handlers to both components


### 3. CardView Component

**Purpose**: Mobile-optimized card-based data display replacing tables.

**Location**: `src/components/CardView/CardView.jsx`

**Interface**:
```typescript
interface CardViewProps {
  coluna: Array<ColumnConfig>;
  data: Array<any>;
  itemsPerPage?: number;
  labelpesquisa?: string;
  
  // Action configuration
  actions: Array<{
    type: 'visualizar' | 'editar' | 'excluir' | 'resetar' | 'inativar' | 'reativar';
    handler: (item: any) => void;
    label: string;
    icon: React.ComponentType;
    color: string;
  }>;
  
  // Display configuration
  primaryFields: string[];    // Fields shown in card header (bold, larger)
  secondaryFields: string[];  // Fields shown in card body (grid layout)
}
```

**Visual Structure**:
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ Primary Field 1: Value          │ │ ← Header (16px, bold)
│ │ Primary Field 2: Value      ⋮   │ │ ← ActionMenu icon
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Label 1    │ Label 2            │ │
│ │ Value 1    │ Value 2            │ │ ← 2-column grid
│ │ Label 3    │ Label 4            │ │
│ │ Value 3    │ Value 4            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Styling**:
- Background: `#0f172a`
- Border: `1px solid #1e293b`
- Border radius: `8px`
- Padding: `16px`
- Gap between cards: `12px`
- Shadow: `0 2px 8px rgba(0,0,0,0.2)`


### 4. BottomSheet Component

**Purpose**: Mobile-native modal that slides up from bottom of screen.

**Location**: `src/components/BottomSheet/BottomSheet.jsx`

**Interface**:
```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';  // 40%, 60%, 90% of viewport
  showHandle?: boolean;  // Drag handle at top
  closeOnBackdrop?: boolean;  // Default true
  closeOnSwipeDown?: boolean;  // Default true
}
```

**Animation Behavior**:
- Slide up: `cubic-bezier(0.4, 0, 0.2, 1)` over 250ms
- Backdrop fade: 200ms
- Swipe-to-close: Follows finger with spring physics

**Structure**:
```
┌─────────────────────────────────────┐
│         Backdrop (blur)             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ─────  (drag handle)        │   │
│  │                             │   │
│  │  Title                  ✕   │   │ ← Header
│  │ ─────────────────────────── │   │
│  │                             │   │
│  │  Content Area               │   │ ← Scrollable
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Accessibility**:
- Traps focus within sheet when open
- ESC key closes sheet
- ARIA role="dialog"
- aria-modal="true"
- aria-labelledby points to title


### 5. ActionMenu Component

**Purpose**: Compact action menu for mobile card views, triggered by vertical ellipsis icon.

**Location**: `src/components/ActionMenu/ActionMenu.jsx`

**Interface**:
```typescript
interface ActionMenuProps {
  item: any;  // The data item
  actions: Array<{
    type: 'visualizar' | 'editar' | 'excluir' | 'resetar' | 'inativar' | 'reativar';
    handler: (item: any) => void;
    label: string;
    icon: React.ComponentType;
    color: string;
    requiresConfirmation?: boolean;
  }>;
  itemIdentifier?: string;  // Field to show in BottomSheet header (e.g., "ticker", "name")
}
```

**Behavior**:
1. Renders vertical ellipsis icon (⋮) with 48px touch target
2. On tap, opens BottomSheet with action list
3. Each action button: 48px height, full width, icon + label
4. Actions with `requiresConfirmation` show confirmation dialog before executing

**Action Color Mapping**:
- Visualizar: `#06b6d4` (cyan)
- Editar: `#10b981` (emerald)
- Excluir: `#ef4444` (red)
- Resetar Senha: `#f59e0b` (amber)
- Inativar: `#64748b` (slate)
- Reativar: `#10b981` (emerald)


### 6. Adaptive Sidebar Component

**Purpose**: Sidebar that switches between fixed panel (desktop) and overlay (mobile).

**Location**: `src/components/Sidebar/Sidebar.jsx` (modified)

**Changes Required**:
```javascript
// Add breakpoint detection
const { isMobile } = useBreakpoint();

// Conditional positioning
const sidebarStyle = {
  position: isMobile ? 'fixed' : 'fixed',
  width: isOpen ? '250px' : '0px',
  zIndex: isMobile ? 999 : 100,
  transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
  transition: 'transform 0.3s ease',
};

// Backdrop for mobile
{isMobile && isOpen && (
  <div 
    onClick={onToggle}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 998,
    }}
  />
)}
```

**Behavior Differences**:

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Position | Fixed overlay | Fixed panel |
| Default State | Closed | Open |
| Backdrop | Yes (blur) | No |
| Z-index | 999 | 100 |
| Close on navigation | Yes | No |
| Swipe to close | Yes | No |


### 7. Adaptive Layout Component

**Purpose**: Main layout wrapper that adjusts content margin based on sidebar state and device type.

**Location**: `src/components/Layout/Layout.jsx` (modified)

**Changes Required**:
```javascript
const { isMobile } = useBreakpoint();

// Content area margin
const contentStyle = {
  marginLeft: isMobile ? '0px' : (sidebarOpen ? '250px' : '0px'),
  paddingTop: '60px',
  transition: 'margin-left 0.3s ease',
  minHeight: '100vh',
};

// Close sidebar on route change in mobile
useEffect(() => {
  if (isMobile && sidebarOpen) {
    setSidebarOpen(false);
  }
}, [location.pathname, isMobile]);
```

**Responsive Padding**:
- Mobile: `padding: 16px`
- Tablet: `padding: 20px`
- Desktop: `padding: 24px`


### 8. Responsive Modal Components

**Purpose**: Adapt existing modal components for mobile viewports.

**Strategy**:
- Forms with < 5 fields: BottomSheet
- Forms with ≥ 5 fields: Fullscreen modal
- Confirmation dialogs: BottomSheet
- View-only modals: BottomSheet

**Fullscreen Modal Structure**:
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ Title                       ✕   │ │ ← Fixed header
│ └─────────────────────────────────┘ │
│                                     │
│  Scrollable Content Area            │
│                                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Cancelar]        [Salvar]      │ │ ← Fixed footer
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Implementation**:
```javascript
function ResponsiveModal({ children, title, onClose, onSave }) {
  const { isMobile } = useBreakpoint();
  const fieldCount = React.Children.count(children);
  
  if (isMobile && fieldCount < 5) {
    return (
      <BottomSheet isOpen={true} onClose={onClose} title={title} height="half">
        {children}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onSave}>Salvar</button>
        </div>
      </BottomSheet>
    );
  }
  
  if (isMobile && fieldCount >= 5) {
    return <FullscreenModal>{children}</FullscreenModal>;
  }
  
  return <DesktopModal>{children}</DesktopModal>;
}
```

