export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};

export const getGridColumnsForWidth = (width, density) => {
  if (width <= BREAKPOINTS.mobile) return 10;
  if (width <= BREAKPOINTS.tablet) return 14;
  if (density === "padat") return 28;
  if (density === "lapang") return 15;
  return 20; // sederhana
};
