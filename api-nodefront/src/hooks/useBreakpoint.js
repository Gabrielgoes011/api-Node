import { useState, useEffect } from 'react';

/**
 * Custom React hook for responsive breakpoint detection.
 *
 * Uses the `window.matchMedia` API for optimal performance — no debouncing
 * needed and lower CPU usage compared to resize event listeners.
 *
 * Breakpoints:
 *  - Mobile:  viewport width < 768px
 *  - Tablet:  viewport width between 768px and 1024px (inclusive)
 *  - Desktop: viewport width > 1024px
 *
 * @returns {Object} breakpoint - Current breakpoint state object.
 * @returns {boolean} breakpoint.isMobile  - `true` when viewport width is less than 768px.
 * @returns {boolean} breakpoint.isTablet  - `true` when viewport width is between 768px and 1024px.
 * @returns {boolean} breakpoint.isDesktop - `true` when viewport width is greater than 1024px.
 *
 * @example
 * import useBreakpoint from '@/hooks/useBreakpoint';
 *
 * function MyComponent() {
 *   const { isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * }
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
    const desktopQuery = window.matchMedia('(min-width: 1025px)');

    /**
     * Reads the current match state of all three queries and updates state.
     * Called once on mount and again whenever any query fires a change event.
     */
    const updateBreakpoint = () => {
      setBreakpoint({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches,
      });
    };

    // Initialise with the current viewport dimensions on mount.
    updateBreakpoint();

    // Subscribe to future viewport changes.
    mobileQuery.addEventListener('change', updateBreakpoint);
    tabletQuery.addEventListener('change', updateBreakpoint);
    desktopQuery.addEventListener('change', updateBreakpoint);

    // Clean up all listeners when the component that uses this hook unmounts.
    return () => {
      mobileQuery.removeEventListener('change', updateBreakpoint);
      tabletQuery.removeEventListener('change', updateBreakpoint);
      desktopQuery.removeEventListener('change', updateBreakpoint);
    };
  }, []);

  return breakpoint;
};

export default useBreakpoint;
