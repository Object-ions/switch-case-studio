import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect on the client, useEffect during the SSG's Node render —
 * react-dom/server warns "useLayoutEffect does nothing on the server" for
 * every page otherwise. Neither effect runs during SSG, so behavior is
 * identical; this only silences the warning without changing client timing.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
