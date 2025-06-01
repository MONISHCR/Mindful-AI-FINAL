import React, { useState, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton,
  Typography, Avatar, Menu, MenuItem, Tooltip, Switch, Divider, useTheme
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  FiMenu, FiMessageSquare, FiActivity, FiBookOpen, FiSettings, FiImage, FiLogOut, FiChevronLeft,
  FiMessageCircle, FiDatabase, FiHeart, FiSun, FiMoon
} from "react-icons/fi";
import { ColorModeContext } from "./ThemeContext";

// Sidebar width constants
const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

// Pulse animation for active item
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Ripple animation for hover effect
const rippleAnimation = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const Sidebar = styled(Box)(({ theme, open }) => ({
  width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
  transition: theme.transitions.create(["width", "transform"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  height: "100vh",
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)'
    : 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1100,
  display: "flex",
  flexDirection: "column",
  boxShadow: 'none',
  borderRight: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    zIndex: -1,
  }
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: '12px',
  margin: '4px 12px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: selected 
    ? 'rgba(255,255,255,0.15)'
    : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translateX(5px)',
  },
  ...(selected && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '3px',
      height: '50%',
      background: '#fff',
      borderRadius: '0 2px 2px 0',
    }
  })
}));

const IconWrapper = styled(Box)(({ theme, open }) => ({
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  marginRight: open ? theme.spacing(2) : 0,
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: '20px',
    color: '#fff',
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    '& svg': {
      transform: 'scale(1.1)',
    }
  }
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#fff',
    transition: 'all 0.3s ease',
  }
}));

const Layout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const features = [
    { id: "home", title: "Home", icon: <FiMessageSquare />, route: "/home" },
    { id: "mood", title: "Mood Analysis", icon: <FiActivity />, route: "/home/mood" },
    { id: "journal", title: "Journal", icon: <FiBookOpen />, route: "/home/journal" },
    { id: "art-therapy", title: "Art Therapy", icon: <FiImage />, route: "/home/art-therapy" },
    { id: "quiz", title: "Quizzes", icon: <FiActivity />, route: "/home/quiz" },
    { id: "chatbot", title: "AI Chatbot", icon: <FiMessageCircle />, route: "/home/chatbot" },
    { id: "responses", title: "My Responses", icon: <FiDatabase />, route: "/home/responses" },
    { id: "report", title: "Report", icon: <FiBookOpen />, route: "/home/report" },
    // { id: "settings", title: "Settings", icon: <FiSettings />, route: "/home/settings" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar open={sidebarOpen}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          alignItems: 'center',
          padding: '20px 16px',
          mb: 2
        }}>
          {sidebarOpen && (
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 600,
              }}
            >
              MindfulAI
            </Typography>
          )}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              color: '#fff',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiMenu />}
          </IconButton>
        </Box>

        <List sx={{ 
          flex: 1,
          px: sidebarOpen ? 1 : 0,
          '& .MuiListItem-root': {
            px: sidebarOpen ? 2 : 1,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }
        }}>
          {features.map((feature) => (
            <StyledListItem
              button
              key={feature.id}
              selected={location.pathname === feature.route}
              onClick={() => navigate(feature.route)}
            >
              <IconWrapper open={sidebarOpen}>
                {feature.icon}
              </IconWrapper>
              {sidebarOpen && (
                <StyledListItemText primary={feature.title} />
              )}
            </StyledListItem>
          ))}
        </List>

        <Box sx={{ 
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          flexDirection: sidebarOpen ? 'row' : 'column',
          gap: sidebarOpen ? 0 : 2
        }}>
          <IconButton
            onClick={colorMode.toggleColorMode}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            {theme.palette.mode === 'dark' ? <FiSun /> : <FiMoon />}
          </IconButton>
          
          <IconButton
            onClick={handleLogout}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <FiLogOut />
          </IconButton>
        </Box>
      </Sidebar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
