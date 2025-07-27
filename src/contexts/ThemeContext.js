import React, { createContext, useContext, useEffect, useState } from "react";

// Create a Context to manage theme globally across the app
const ThemeContext = createContext();

// Custom hook to easily access theme context values
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component that wraps around children components
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Whenever the theme changes, update the body class and save to localStorage
  useEffect(() => {
    document.body.className = theme;            
    localStorage.setItem("theme", theme);      
  }, [theme]);

  // Toggle between 'light' and 'dark' themes
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Provide the theme and toggle function to children components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
