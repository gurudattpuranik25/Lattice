import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `Lattice | ${title}` : 'Lattice — Drop anything. Understand everything.';
    return () => { document.title = prev; };
  }, [title]);
}
