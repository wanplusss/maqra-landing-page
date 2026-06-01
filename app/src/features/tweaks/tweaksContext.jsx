import React, { createContext, useContext, useState, useEffect } from "react";
import { TWEAK_DEFAULTS, ACCENTS, FONTS } from "./tweaksStrategies.js";

const TweaksContext = createContext(null);

export function TweaksProvider({ children }) {
  const [tweaks, setTweaksState] = useState(() => {
    const saved = localStorage.getItem("maqra_tweaks");
    return saved ? JSON.parse(saved) : TWEAK_DEFAULTS;
  });

  const setTweak = (key, value) => {
    setTweaksState((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("maqra_tweaks", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    const accentValue = ACCENTS[tweaks.accent] || ACCENTS["#2f7d57"];
    const fontValue = FONTS[tweaks.font] || FONTS["Plus Jakarta Sans"];

    root.style.setProperty("--accent", accentValue);
    root.style.setProperty("--font-ui", fontValue);
    root.setAttribute("data-theme", tweaks.dark ? "dark" : "light");
  }, [tweaks.accent, tweaks.font, tweaks.dark]);

  return (
    <TweaksContext.Provider value={{ tweaks, setTweak }}>
      {children}
    </TweaksContext.Provider>
  );
}

export function useTweaks() {
  const context = useContext(TweaksContext);
  if (!context) {
    throw new Error("useTweaks must be used within a TweaksProvider");
  }
  return [context.tweaks, context.setTweak];
}
export { TWEAK_DEFAULTS, ACCENTS, FONTS };
