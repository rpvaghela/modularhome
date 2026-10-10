"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "locomotive-scroll/locomotive-scroll.css";

interface LocomotiveScrollContextType {
  scroll: any | null;
  scrollTo: (target: any, options?: any) => void;
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
  scrollTo: () => {},
});

export function useLocomotiveScroll() {
  return useContext(LocomotiveScrollContext);
}

export default function LocomotiveScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrollInstance, setScrollInstance] = useState<any>(null);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    // Disable on server or admin paths
    if (typeof window === "undefined" || pathname?.startsWith("/admin")) {
      return;
    }

    let isMounted = true;

    // Dynamically import to ensure window and DOM are fully ready
    import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      if (!isMounted) return;

      try {
        const instance = new LocomotiveScroll({
          lenisOptions: {
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            duration: 1.2,
          },
        });

        scrollRef.current = instance;
        setScrollInstance(instance);
      } catch (err) {
        console.warn("Locomotive Scroll initialization warning:", err);
      }
    });

    return () => {
      isMounted = false;
      if (scrollRef.current) {
        try {
          scrollRef.current.destroy();
        } catch {}
        scrollRef.current = null;
        setScrollInstance(null);
      }
    };
  }, [pathname?.startsWith("/admin")]);

  // Scroll to top on route change
  useEffect(() => {
    if (scrollRef.current?.lenisInstance) {
      scrollRef.current.lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const scrollTo = (target: any, options?: any) => {
    if (scrollRef.current?.lenisInstance) {
      scrollRef.current.lenisInstance.scrollTo(target, options);
    } else if (typeof window !== "undefined") {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <LocomotiveScrollContext.Provider value={{ scroll: scrollInstance, scrollTo }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
}
