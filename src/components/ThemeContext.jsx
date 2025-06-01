import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext();

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode colors
          primary: {
            main: '#7F7FD5',
            light: '#91EAE4',
            dark: '#5b5196',
            contrastText: '#fff',
          },
          secondary: {
            main: '#764ba2',
            light: '#9f7aea',
            dark: '#553c8b',
            contrastText: '#fff',
          },
          background: {
            default: "#f5f7fb",
            paper: "#fff",
            gradient: 'linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 50%, #f5f9ff 100%)',
          },
          text: {
            primary: "#2a3042",
            secondary: "#666",
          },
          divider: 'rgba(0, 0, 0, 0.1)',
          custom: {
            sidebar: '#2a3042',
            cardGradient: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
            buttonGradient: 'linear-gradient(135deg, #7F7FD5 0%, #91EAE4 100%)',
            glassmorphism: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }
      : {
          // Dark mode colors
          primary: {
            main: '#9f7aea',
            light: '#b794f4',
            dark: '#805ad5',
            contrastText: '#fff',
          },
          secondary: {
            main: '#7f9cf5',
            light: '#a3bffa',
            dark: '#667eea',
            contrastText: '#fff',
          },
          background: {
            default: "#1c1e26",
            paper: "#2a2d3b",
            gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
          },
          text: {
            primary: "#fff",
            secondary: "#b2b2b2",
          },
          divider: 'rgba(255, 255, 255, 0.1)',
          custom: {
            sidebar: '#1a1a2e',
            cardGradient: 'linear-gradient(135deg, #2a2d3b 0%, #1f2937 100%)',
            buttonGradient: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)',
            glassmorphism: 'rgba(26, 32, 44, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: theme.palette.custom.boxShadow,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s ease',
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.custom.cardGradient,
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        }),
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.1)',
    // ... add more shadow definitions as needed
  ],
});

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

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeContextProvider;
