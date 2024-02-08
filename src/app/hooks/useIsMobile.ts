import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    isMobile: boolean;
  }>({
    width: window?.innerWidth,
    isMobile: window?.innerWidth <= 768,
  });
  useEffect(() => {
    const handleWindowSizeChange = () => {
      const width = window?.innerWidth;
      setWindowSize({
        width,
        isMobile: width <= 768,
      });
    };

    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [window]);

  return windowSize;
};
