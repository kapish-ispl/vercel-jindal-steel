import { useState, useEffect } from 'react';

const useBreakpoint = (breakpoints: { [key: string]: number }): string => {
  const getActiveBreakpoint = (): string => {
    const sortedBreakpoints = Object.keys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b]);

    const active = sortedBreakpoints.reverse().find((key) => window.matchMedia(`(min-width: ${breakpoints[key]}px)`).matches);

    return active || sortedBreakpoints[sortedBreakpoints.length - 1];
  };

  const [activeBreakpoint, setActiveBreakpoint] = useState('desktop');

  useEffect(() => {
    setActiveBreakpoint(getActiveBreakpoint());
    const handleResize = () => setActiveBreakpoint(getActiveBreakpoint());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return activeBreakpoint;
};

export default useBreakpoint;
