import { useLayoutEffect, useRef, useState } from 'react';

// Reads tokens from the live CSS so this page can never disagree with tokens.css.
export const useResolvedTokens = (tokens: readonly string[]) => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    if (!scopeRef.current) return;
    const computedStyle = getComputedStyle(scopeRef.current);
    setResolved(
      Object.fromEntries(
        tokens.map((token) => [token, computedStyle.getPropertyValue(token).trim()]),
      ),
    );
  }, [tokens]);

  return { scopeRef, resolved };
};
