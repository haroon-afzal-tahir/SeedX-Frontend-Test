import { useWindowWidth } from "./useWindowWidth";

export function useDevice() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const deviceType: DeviceType = isMobile ? "mobile" : "desktop";

  return {
    isMobile,
    isDesktop: !isMobile,
    deviceType,
  };
}
