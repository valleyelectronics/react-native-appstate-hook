import { useState, useEffect } from "react";
import { AppState } from "react-native";

export default function useAppState(settings) {
  const { onChange, onForeground, onBackground } = settings || {};
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    function handleAppStateChange(nextAppState) {
      if (nextAppState === "active" && appState !== "active") {
        isValidFunction(onForeground) && onForeground();
      } else if (
        appState === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        isValidFunction(onBackground) && onBackground();
      }
      setAppState(nextAppState);
      isValidFunction(onChange) && onChange(nextAppState);
    }
    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    return () => appStateListener?.remove();
  }, [onChange, onForeground, onBackground, appState]);

  // settings validation
  function isValidFunction(func) {
    return func && typeof func === "function";
  }
  return { appState };
}

export function useOnForeground(callback) {
  return useAppState({ onForeground: callback });
}

export function useOnBackground(callback) {
  return useAppState({ onBackground: callback });
}
