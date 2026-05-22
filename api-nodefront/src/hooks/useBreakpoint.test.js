import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useBreakpoint from './useBreakpoint';

/**
 * Helper: create a mock matchMedia that returns `matches` for a given query
 * and exposes an `addListener` / `removeListener` spy.
 */
function createMatchMedia(width) {
  const listeners = [];

  return (query) => {
    // Evaluate the query string against the given width
    let matches = false;
    if (query.includes('max-width: 767px'))          matches = width < 768;
    else if (query.includes('min-width: 768px') && query.includes('max-width: 1024px'))
                                                      matches = width >= 768 && width <= 1024;
    else if (query.includes('min-width: 1025px'))     matches = width >= 1025;

    const mql = {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event, cb) => listeners.push({ event, cb, mql })),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    return mql;
  };
}

describe('useBreakpoint', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns isMobile=true when viewport is 375px', () => {
    window.matchMedia = createMatchMedia(375);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('returns isTablet=true when viewport is 900px', () => {
    window.matchMedia = createMatchMedia(900);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('returns isDesktop=true when viewport is 1280px', () => {
    window.matchMedia = createMatchMedia(1280);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('registers event listeners for all three queries on mount', () => {
    const addEventListenerSpy = vi.fn();
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    renderHook(() => useBreakpoint());
    // Three queries × one 'change' listener each
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('removes event listeners on unmount (cleanup)', () => {
    const removeEventListenerSpy = vi.fn();
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: vi.fn(),
    });

    const { unmount } = renderHook(() => useBreakpoint());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);
  });
});
