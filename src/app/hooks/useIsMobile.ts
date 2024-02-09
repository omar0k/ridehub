import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const isClient = typeof window === "object";

  const [windowSize, setWindowSize] = useState<{
    width: number;
    isMobile: boolean;
  }>({
    width: isClient ? window.innerWidth : 0,
    isMobile: isClient ? window.innerWidth <= 768 : false,
  });

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const handleWindowSizeChange = () => {
      setWindowSize({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 768,
      });
    };

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [isClient]);

  return windowSize;
};
