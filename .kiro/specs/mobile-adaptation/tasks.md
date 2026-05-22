# Implementation Plan: Mobile Adaptation for FIITrack

## Overview

This implementation plan transforms the FIITrack fund management system from desktop-only to mobile-first responsive design. The approach maintains backward compatibility with existing desktop functionality while introducing mobile-optimized components (CardView, BottomSheet, ActionMenu) and responsive detection (useBreakpoint hook). The implementation follows a gradual migration strategy, allowing page-by-page adoption without breaking existing features.

**Key Technologies**: React 19.2.4, Vite, Tailwind CSS, React Router, React Icons

**Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

**Design System**: Dark theme with emerald accent (#10b981), slate backgrounds (#0f172a, #1e293b)

## Tasks

- [x] 1. Set up responsive foundation and breakpoint detection
  - Create `src/hooks/useBreakpoint.js` hook using window.matchMedia API
  - Implement breakpoint detection for mobile (<768px), tablet (768-1024px), desktop (>1024px)
  - Add event listeners for viewport changes with automatic cleanup
  - Return breakpoint state object: `{ isMobile, isTablet, isDesktop }`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_


- [x] 2. Create mobile-specific UI components
  - [x] 2.1 Implement BottomSheet component
    - Create `src/components/BottomSheet/BottomSheet.jsx` with slide-up animation
    - Support props: isOpen, onClose, title, children, height ('auto'|'half'|'full')
    - Implement backdrop with blur effect (rgba(0,0,0,0.6) + backdrop-filter)
    - Add swipe-to-close gesture support with spring physics
    - Include drag handle at top and close button in header
    - Implement focus trap and ESC key handler
    - Add ARIA attributes: role="dialog", aria-modal="true", aria-labelledby
    - Use cubic-bezier(0.4, 0, 0.2, 1) easing for 250ms slide animation
    - _Requirements: 4.4, 4.5, 4.6, 4.9, 6.1, 6.2, 6.7, 6.9, 6.10_

  - [x] 2.2 Implement ActionMenu component
    - Create `src/components/ActionMenu/ActionMenu.jsx` with vertical ellipsis icon (⋮)
    - Ensure minimum 48px touch target for icon button
    - Open BottomSheet on tap with action list
    - Support action types: visualizar, editar, excluir, resetar, inativar, reativar
    - Apply color coding: cyan (#06b6d4) view, emerald (#10b981) edit, red (#ef4444) delete, amber (#f59e0b) reset
    - Display action buttons with icons, labels, and 48px minimum height
    - Show record identifier in BottomSheet header
    - Close BottomSheet after action execution
    - _Requirements: 4.1, 4.2, 4.3, 4.7, 4.8, 4.10, 4.11, 4.12, 5.1, 5.2, 5.3_


  - [x] 2.3 Implement CardView component
    - Create `src/components/CardView/CardView.jsx` for mobile data display
    - Accept same props as TableAcoes for backward compatibility (coluna, data, itemsPerPage, labelpesquisa)
    - Support action handlers: acaoVisualizar, acaoEditar, acaoExcluir, acaoResetarSenha, acaoInativar, acaoReativar
    - Render cards with background #0f172a, border #1e293b, 8px border-radius
    - Display primary fields in card header (16px font, bold)
    - Display secondary fields in 2-column grid layout
    - Include ActionMenu in top-right corner of each card
    - Maintain 12px spacing between cards
    - Support pagination and search functionality
    - Display "Nenhum registro encontrado" for empty data
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

  - [ ]* 2.4 Write unit tests for mobile components
    - Test BottomSheet open/close behavior and animations
    - Test ActionMenu icon rendering and action execution
    - Test CardView data rendering and pagination
    - Test touch target sizes (minimum 48px)
    - Test accessibility attributes (ARIA roles, labels)
    - _Requirements: 4.1-4.12, 5.1-5.3, 3.1-3.10_


- [x] 3. Create ResponsiveTable wrapper component
  - Create `src/components/ResponsiveTable/ResponsiveTable.jsx` wrapper
  - Use useBreakpoint hook to detect device type
  - Render TableAcoes when isDesktop or isTablet
  - Render CardView when isMobile
  - Pass all props to both components (coluna, data, actions, etc.)
  - Maintain backward compatibility with existing TableAcoes usage
  - Support primaryFields and secondaryFields props for CardView configuration
  - _Requirements: 3.1, 3.2, 3.3, 17.1, 17.2, 19.1, 19.2_

- [x] 4. Checkpoint - Test responsive table switching
  - Ensure all tests pass, ask the user if questions arise.


- [-] 5. Adapt Sidebar for mobile overlay mode
  - [ ] 5.1 Modify Sidebar component for responsive behavior
    - Import and use useBreakpoint hook in `src/components/Sidebar/Sidebar.jsx`
    - Change position to fixed overlay with z-index 999 when isMobile
    - Initialize sidebar closed by default in mobile view
    - Add backdrop with rgba(0,0,0,0.6) and backdrop-filter blur when mobile sidebar is open
    - Close sidebar on backdrop click
    - Implement 300ms transition for slide animation
    - Ensure hamburger menu button has 48px minimum touch target
    - Close sidebar on navigation in mobile view
    - Support swipe-to-close gesture
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.2, 9.4_

  - [ ]* 5.2 Write unit tests for adaptive sidebar
    - Test sidebar position changes based on breakpoint
    - Test backdrop rendering in mobile view
    - Test sidebar close on navigation in mobile
    - Test touch target size for hamburger menu
    - _Requirements: 2.1-2.7_


- [ x] 6. Adapt Layout component for responsive content margins
  - [x ] 6.1 Modify Layout component for mobile responsiveness
    - Import and use useBreakpoint hook in `src/components/Layout/Layout.jsx`
    - Set content marginLeft to 0px when isMobile (regardless of sidebar state)
    - Adjust content marginLeft based on sidebar state when isDesktop (250px or 0px)
    - Implement responsive padding: 16px mobile, 20px tablet, 24px desktop
    - Close sidebar on route change when isMobile
    - Add smooth transition for margin changes (300ms)
    - _Requirements: 2.8, 2.9, 7.1, 7.2_

  - [ ]* 6.2 Write integration tests for Layout responsiveness
    - Test content margin adjustments based on breakpoint
    - Test sidebar auto-close on route change in mobile
    - Test responsive padding values
    - _Requirements: 2.8, 2.9_

- [x] 7. Checkpoint - Test layout and sidebar adaptation
  - Ensure all tests pass, ask the user if questions arise.


- [x] 8. Create responsive modal components
  - [x] 8.1 Implement ResponsiveModal wrapper
    - Create `src/components/ResponsiveModal/ResponsiveModal.jsx`
    - Use useBreakpoint to detect device type
    - Render BottomSheet for mobile forms with <5 fields
    - Render fullscreen modal for mobile forms with ≥5 fields
    - Render centered dialog for desktop (max-width 500px)
    - Include fixed header with title and close button (48px touch target)
    - Include fixed footer with action buttons (48px height, full width on mobile)
    - Make content area scrollable when exceeds viewport height
    - Prevent body scroll when modal is open
    - Restore body scroll when modal closes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

  - [ ]* 8.2 Write unit tests for responsive modals
    - Test modal type selection based on field count and breakpoint
    - Test body scroll prevention
    - Test touch target sizes for buttons
    - Test modal close and open behavior
    - _Requirements: 6.1-6.10_


- [x] 9. Implement touch-friendly UI standards
  - [x] 9.1 Create TouchButton component
    - Create `src/components/TouchButton/TouchButton.jsx` with minimum 48px dimensions
    - Provide visual feedback within 50ms of touch (color change or scale)
    - Prevent accidental double-tap zoom
    - Support haptic feedback if device supports it
    - Apply consistent styling with theme colors
    - _Requirements: 5.1, 5.2, 5.3, 5.7, 11.7_

  - [x] 9.2 Create TouchInput component
    - Create `src/components/TouchInput/TouchInput.jsx` with minimum 48px height
    - Use 16px font size to prevent iOS auto-zoom
    - Support appropriate input types (email, tel, number, date)
    - Set autocomplete attributes for common fields
    - Display clear button (X) when text is entered
    - Maintain 12px minimum spacing between elements
    - _Requirements: 5.2, 5.4, 5.5, 5.6, 13.1, 13.2, 13.3, 16.2, 16.3_

  - [ ]* 9.3 Write unit tests for touch components
    - Test minimum touch target sizes (48px)
    - Test visual feedback timing (<50ms)
    - Test input font sizes and autocomplete
    - _Requirements: 5.1-5.7_


- [x] 10. Implement confirmation dialogs for destructive actions
  - Create `src/components/ConfirmationDialog/ConfirmationDialog.jsx`
  - Use BottomSheet for mobile, centered dialog for desktop
  - Display record identifier and warning message
  - Provide "Cancelar" (neutral #64748b) and "Excluir" (danger #ef4444) buttons
  - Position "Cancelar" on left, "Excluir" on right
  - Ensure buttons have 48px minimum height
  - Require explicit user action (no auto-dismiss)
  - Integrate with ActionMenu for delete actions
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

- [x] 11. Checkpoint - Test touch UI and confirmations
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 12. Adapt priority pages to use ResponsiveTable
  - [ ] 12.1 Adapt /cadastros/meusfiis page
    - Replace TableAcoes with ResponsiveTable in MeusFiis page
    - Configure primaryFields: ['ticker', 'name']
    - Configure secondaryFields: ['cnpj', 'segment']
    - Maintain all existing action handlers
    - _Requirements: 10.1, 17.1, 17.2, 19.1_

  - [ ] 12.2 Adapt /cadastros/usuarios page
    - Replace TableAcoes with ResponsiveTable in Usuarios page
    - Configure primaryFields: ['name', 'email']
    - Configure secondaryFields: ['role', 'status']
    - Maintain all existing action handlers
    - _Requirements: 10.2, 17.1, 17.2, 19.1_

  - [ ] 12.3 Adapt /cadastros/seguimentos page
    - Replace TableAcoes with ResponsiveTable in Seguimentos page
    - Configure primaryFields: ['name']
    - Configure secondaryFields: ['description']
    - Maintain all existing action handlers
    - _Requirements: 10.3, 17.1, 17.2, 19.1_


  - [ ] 12.4 Adapt /controle-ativos page
    - Replace TableAcoes with ResponsiveTable in ControleAtivos page
    - Configure primaryFields: ['asset', 'quantity']
    - Configure secondaryFields: ['averagePrice', 'currentValue']
    - Maintain all existing action handlers
    - _Requirements: 10.4, 17.1, 17.2, 19.1_

  - [ ] 12.5 Adapt /operacoes page
    - Replace TableAcoes with ResponsiveTable in Operacoes page
    - Configure primaryFields: ['date', 'type']
    - Configure secondaryFields: ['asset', 'quantity', 'value']
    - Maintain all existing action handlers
    - _Requirements: 10.5, 17.1, 17.2, 19.1_

  - [ ] 12.6 Adapt /rendimentos page
    - Replace TableAcoes with ResponsiveTable in Rendimentos page
    - Configure primaryFields: ['date', 'asset']
    - Configure secondaryFields: ['value', 'type']
    - Maintain all existing action handlers
    - _Requirements: 10.6, 17.1, 17.2, 19.1_


  - [ ] 12.7 Adapt /precificacao page
    - Replace TableAcoes with ResponsiveTable in Precificacao page
    - Configure primaryFields: ['asset', 'currentPrice']
    - Configure secondaryFields: ['variation']
    - Maintain all existing action handlers
    - _Requirements: 10.8, 17.1, 17.2, 19.1_

  - [ ]* 12.8 Write integration tests for adapted pages
    - Test ResponsiveTable rendering on each page
    - Test data display in both desktop and mobile views
    - Test action handlers execution
    - Test pagination and search functionality
    - _Requirements: 10.1-10.8_

- [ ] 13. Checkpoint - Test page adaptations
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 14. Implement loading states and feedback
  - [ ] 14.1 Create SkeletonLoader component
    - Create `src/components/SkeletonLoader/SkeletonLoader.jsx` with shimmer animation
    - Support card and table row layouts
    - Match structure of actual content (CardView or TableAcoes)
    - Use slate colors (#1e293b, #334155) for skeleton elements
    - _Requirements: 8.1, 8.9, 11.1_

  - [ ] 14.2 Create Toast notification system
    - Create `src/components/Toast/Toast.jsx` for feedback messages
    - Support types: success (emerald), error (red), warning (amber), info (cyan)
    - Display success messages for 3 seconds, errors for 5 seconds
    - Position toasts at top-right on desktop, top-center on mobile
    - Support stacking multiple toasts
    - _Requirements: 11.4, 11.5, 11.6_

  - [ ] 14.3 Create EmptyState component
    - Create `src/components/EmptyState/EmptyState.jsx` for empty lists
    - Display illustration, message, and optional action button
    - Use consistent styling with theme colors
    - _Requirements: 11.8_


  - [ ] 14.4 Integrate loading states into components
    - Add SkeletonLoader to CardView while data is loading
    - Add loading spinner to ResponsiveModal during form submission
    - Disable submit buttons and show loading state during API calls
    - Display Toast notifications for success/error responses
    - Show EmptyState in CardView when data array is empty
    - _Requirements: 8.1, 8.2, 11.1, 11.2, 11.3, 11.4, 11.5, 11.8_

  - [ ]* 14.5 Write unit tests for feedback components
    - Test SkeletonLoader rendering and animation
    - Test Toast display duration and stacking
    - Test EmptyState rendering
    - Test loading state integration
    - _Requirements: 8.1-8.9, 11.1-11.8_

- [ ] 15. Checkpoint - Test loading states and feedback
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 16. Implement search and filter enhancements
  - [ ] 16.1 Enhance search input for mobile
    - Update search input in CardView to use TouchInput component
    - Ensure 48px minimum height and 16px font size
    - Add clear button (X) when text is entered
    - Display search icon on left with #64748b color
    - Implement 300ms debounce for search queries
    - Display result count below search input when active
    - Maintain focus after filtering results
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 8.4_

  - [ ]* 16.2 Write unit tests for search functionality
    - Test search input rendering and styling
    - Test debounce behavior (300ms delay)
    - Test clear button functionality
    - Test result count display
    - _Requirements: 13.1-13.9_


- [ ] 17. Implement accessibility features
  - [ ] 17.1 Add ARIA attributes to components
    - Add aria-label to all icon-only buttons
    - Add role="dialog" and aria-modal="true" to BottomSheet and modals
    - Add aria-labelledby to modal headers
    - Add aria-live regions for dynamic content changes
    - Ensure semantic HTML elements (nav, main, article, button)
    - _Requirements: 14.1, 14.2, 14.4, 14.6, 14.8_

  - [ ] 17.2 Implement keyboard navigation
    - Ensure logical tab order for all interactive elements
    - Add 2px focus indicators for all focusable elements
    - Support ESC key to close modals and BottomSheet
    - Implement focus trap in modals
    - _Requirements: 14.2, 14.5_

  - [ ] 17.3 Ensure color contrast compliance
    - Verify text color contrast ratio ≥4.5:1 against backgrounds
    - Test with contrast checker tools
    - Add alternative text for all images and icons
    - _Requirements: 14.3, 14.7_

  - [ ]* 17.4 Write accessibility tests
    - Test ARIA attributes presence
    - Test keyboard navigation flow
    - Test focus trap in modals
    - Test color contrast ratios
    - _Requirements: 14.1-14.8_


- [ ] 18. Implement orientation support
  - [ ] 18.1 Add orientation detection and handling
    - Extend useBreakpoint hook to detect orientation (portrait/landscape)
    - Render single column CardView in portrait mode
    - Render two-column CardView in landscape mode when width <768px
    - Adjust layout within 300ms of orientation change
    - Maintain scroll position during orientation changes
    - Close BottomSheet when changing to landscape
    - Adjust BottomSheet height to 70% in landscape mode
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

  - [ ]* 18.2 Write tests for orientation handling
    - Test orientation detection
    - Test CardView column layout changes
    - Test BottomSheet behavior on orientation change
    - Test scroll position preservation
    - _Requirements: 15.1-15.7_


- [ ] 19. Optimize forms for mobile
  - [ ] 19.1 Create ResponsiveForm component
    - Create `src/components/ResponsiveForm/ResponsiveForm.jsx`
    - Stack form fields vertically with full width in mobile view
    - Use appropriate input types (email, tel, number, date) for mobile keyboards
    - Set autocomplete attributes for common fields (name, email, phone)
    - Display field labels above inputs with 14px minimum font size
    - Display validation errors below fields with red color
    - Scroll to first error field when validation fails
    - Provide clear visual indication of required fields with asterisk (*)
    - Maintain form state when navigating away and returning
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9_

  - [ ]* 19.2 Write unit tests for responsive forms
    - Test field stacking in mobile view
    - Test input type attributes
    - Test validation error display
    - Test scroll to error behavior
    - Test form state persistence
    - _Requirements: 16.1-16.9_

- [ ] 20. Checkpoint - Test forms and orientation
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 21. Implement performance optimizations
  - [ ] 21.1 Add lazy loading and virtualization
    - Implement lazy loading for CardView items beyond initial viewport
    - Limit initial render to 20 items per page in mobile view
    - Use React.memo for CardView items to prevent unnecessary re-renders
    - Implement intersection observer for lazy loading
    - _Requirements: 8.1, 8.3, 8.5_

  - [ ] 21.2 Optimize animations and transitions
    - Use CSS transforms instead of position changes for animations
    - Use will-change property sparingly for BottomSheet and Sidebar
    - Disable animations when user prefers reduced motion (prefers-reduced-motion)
    - Ensure animations maintain >50fps during scroll
    - _Requirements: 8.9, 21.6, 21.7, 21.8_

  - [ ] 21.3 Implement state management optimizations
    - Preserve scroll position when navigating back from detail pages
    - Preserve search query when navigating back to list pages
    - Preserve pagination state when navigating back
    - Persist sidebar open/closed preference in localStorage
    - Clear sensitive data from state on logout
    - _Requirements: 22.1, 22.2, 22.3, 22.5, 22.7_


  - [ ]* 21.4 Write performance tests
    - Test lazy loading behavior
    - Test React.memo optimization
    - Test animation frame rates
    - Test state persistence
    - _Requirements: 8.1-8.9, 22.1-22.7_

- [ ] 22. Implement error handling and offline support
  - [ ] 22.1 Create error handling components
    - Create `src/components/ErrorBoundary/ErrorBoundary.jsx` for React errors
    - Create `src/components/NetworkError/NetworkError.jsx` with retry button
    - Display offline indicator in top bar when user is offline
    - Show inline errors below invalid form fields
    - Use plain language without technical jargon in error messages
    - Provide actionable next steps in error messages
    - Log errors to console for debugging
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8_

  - [ ]* 22.2 Write error handling tests
    - Test error boundary catching and display
    - Test network error retry functionality
    - Test offline indicator display
    - Test error message content
    - _Requirements: 23.1-23.8_


- [ ] 23. Implement PWA support
  - [ ] 23.1 Create PWA manifest and service worker
    - Create `public/manifest.json` with app metadata (name, short_name, description, theme_color)
    - Provide app icons in sizes 192x192 and 512x512 in `public/icons/`
    - Create service worker in `public/sw.js` for offline functionality
    - Cache critical assets (HTML, CSS, JS) for offline access
    - Use standalone display mode to hide browser UI
    - Create splash screen with app icon and theme color
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.7, 25.8_

  - [ ] 23.2 Implement PWA install prompt
    - Display install prompt when PWA criteria are met
    - Handle offline state gracefully with cached data
    - Sync data when connection is restored
    - _Requirements: 25.6, 25.9, 25.10_

  - [ ]* 23.3 Write PWA tests
    - Test manifest.json validity
    - Test service worker registration
    - Test offline functionality
    - Test install prompt display
    - _Requirements: 25.1-25.10_

- [ ] 24. Checkpoint - Test performance and PWA
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 25. Implement security enhancements for mobile
  - Enforce HTTPS for all API requests
  - Store JWT tokens in httpOnly cookies (backend change if needed)
  - Implement CSRF protection for state-changing operations
  - Add Content Security Policy headers
  - Validate and sanitize all user inputs
  - Implement rate limiting for authentication endpoints
  - Add security headers (X-Frame-Options, X-Content-Type-Options)
  - _Requirements: 26.1, 26.2_

- [ ] 26. Adapt dashboard and remaining pages
  - [ ] 26.1 Adapt dashboard (/) page
    - Stack DataCard components vertically in mobile view
    - Ensure cards have full width with proper spacing
    - Adapt charts to full width with minimum 300px height
    - _Requirements: 10.7, 10.9_

  - [ ] 26.2 Adapt /relatorios page
    - Adapt charts to full width with minimum 300px height in mobile view
    - Stack report sections vertically
    - Ensure touch-friendly controls for chart interactions
    - _Requirements: 10.9_

  - [ ] 26.3 Adapt /configuracoes page
    - Render form fields with full width and 48px minimum height in mobile view
    - Use ResponsiveForm component
    - Ensure touch-friendly toggle switches and selects
    - _Requirements: 10.10_


- [ ] 27. Implement navigation enhancements
  - Add "back to top" button when user scrolls beyond 2 viewport heights
  - Ensure button has 48px minimum touch target
  - Position button in bottom-right corner with fixed position
  - Smooth scroll to top on button click
  - Support swipe-to-close for Sidebar and BottomSheet
  - Prevent navigation during active touch gestures
  - _Requirements: 9.1, 9.3, 9.4, 9.5, 9.7_

- [ ] 28. Create documentation
  - [ ] 28.1 Document component APIs
    - Add JSDoc comments to useBreakpoint hook
    - Add usage examples to BottomSheet component
    - Add prop descriptions to CardView component
    - Document ActionMenu action types and icons
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [ ] 28.2 Create architecture documentation
    - Create README.md explaining mobile architecture decisions
    - Document breakpoint values in central configuration file
    - Add code comments for complex responsive logic
    - Create CHANGELOG.md documenting mobile adaptation progress
    - _Requirements: 20.5, 20.6, 20.7, 20.8_


- [ ] 29. Comprehensive testing across devices
  - [ ]* 29.1 Test on various viewport sizes
    - Test on 320px viewport (iPhone SE)
    - Test on 375px viewport (iPhone 12/13)
    - Test on 414px viewport (iPhone 12 Pro Max)
    - Test on 768px viewport (iPad portrait)
    - Verify no horizontal scroll on any viewport
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.10_

  - [ ]* 29.2 Test on mobile browsers
    - Test on Safari iOS 15+
    - Test on Chrome Android 90+
    - Verify touch interactions work correctly
    - Verify animations are smooth
    - _Requirements: 18.5, 18.6_

  - [ ]* 29.3 Run Lighthouse audits
    - Achieve Performance score >80 on mobile
    - Achieve Accessibility score >90
    - Achieve Best Practices score >90
    - Verify First Contentful Paint <2s on 3G
    - Verify Time to Interactive <4s on 3G
    - _Requirements: 8.6, 8.7, 8.8, 18.7, 18.8, 18.9_


- [ ] 30. Final integration and verification
  - [ ] 30.1 Verify backward compatibility
    - Test all existing desktop functionality works without regressions
    - Verify no changes required to backend APIs
    - Verify authentication and authorization flows unchanged
    - Verify all existing features preserved (visualizar, editar, excluir, etc.)
    - Verify existing keyboard shortcuts work in desktop view
    - Verify existing unit tests still pass
    - _Requirements: 19.3, 19.4, 19.5, 19.6, 19.7, 19.8_

  - [ ] 30.2 Optimize assets for production
    - Serve images in WebP format with JPEG fallback
    - Use responsive images with srcset for different densities
    - Lazy load images below the fold
    - Compress SVG icons to remove metadata
    - Use icon sprites or icon fonts to reduce HTTP requests
    - Implement cache-control headers for static assets
    - Minify CSS and JavaScript bundles
    - Use code splitting to load only necessary JavaScript per page
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8_

  - [ ] 30.3 Final smoke testing
    - Test complete user flows on mobile (login, view data, edit, delete)
    - Test complete user flows on desktop (verify no regressions)
    - Test responsive transitions (resize browser window)
    - Test all pages load without errors
    - Test all actions execute successfully
    - Verify no console errors or warnings

- [ ] 31. Final checkpoint - Production readiness
  - Ensure all tests pass, ask the user if questions arise.


## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation maintains full backward compatibility with existing desktop functionality
- All components use the existing design system (dark theme, emerald accent, slate backgrounds)
- Touch targets follow mobile best practices (minimum 48px)
- Animations use performant CSS transforms and respect user preferences
- The gradual migration approach allows page-by-page adoption without breaking changes
- PWA support enables offline functionality and app-like experience
- Security enhancements protect user data on mobile networks
- Comprehensive testing ensures quality across devices and browsers

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["2.4", "3"] },
    { "id": 3, "tasks": ["5.1", "6.1"] },
    { "id": 4, "tasks": ["5.2", "6.2", "8.1", "9.1", "9.2"] },
    { "id": 5, "tasks": ["8.2", "9.3", "10"] },
    { "id": 6, "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"] },
    { "id": 7, "tasks": ["12.8", "14.1", "14.2", "14.3"] },
    { "id": 8, "tasks": ["14.4"] },
    { "id": 9, "tasks": ["14.5", "16.1", "17.1", "17.2", "17.3", "18.1"] },
    { "id": 10, "tasks": ["16.2", "17.4", "18.2", "19.1"] },
    { "id": 11, "tasks": ["19.2", "21.1", "21.2", "21.3"] },
    { "id": 12, "tasks": ["21.4", "22.1"] },
    { "id": 13, "tasks": ["22.2", "23.1", "23.2"] },
    { "id": 14, "tasks": ["23.3", "25", "26.1", "26.2", "26.3", "27"] },
    { "id": 15, "tasks": ["28.1", "28.2"] },
    { "id": 16, "tasks": ["29.1", "29.2", "29.3"] },
    { "id": 17, "tasks": ["30.1", "30.2", "30.3"] }
  ]
}
```
