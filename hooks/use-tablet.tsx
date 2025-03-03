import * as React from "react";

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)",
    );
    const handler = (event: MediaQueryListEvent) => {
      setIsTablet(event.matches);
    };

    // Set initial value
    setIsTablet(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isTablet;
}
