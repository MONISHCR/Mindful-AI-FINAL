import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode");
    if (storedMode) setMode(storedMode);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: {
                  default: "#f5f7fb",
                  paper: "#fff",
                },
                text: {
                  primary: "#000", // Black text for light mode
                },
              }
            : {
                background: {
                  default: "#1c1e26",
                  paper: "#2a2d3b",
                },
                text: {
                  primary: "#fff", // White text for dark mode
                },
              }),
        },
        typography: {
          // Define text styles for both modes
          allVariants: {
            color: mode === "light" ? "#000" : "#fff", // Set text color for all variants
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeContextProvider;
