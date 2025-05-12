import React, { useState, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton,
  Typography, Avatar, Menu, MenuItem, Tooltip, Switch, Divider
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  FiMenu, FiMessageSquare, FiActivity, FiBookOpen, FiSettings, FiImage, FiLogOut, FiChevronLeft,
  FiMessageCircle, FiDatabase
} from "react-icons/fi";
import { ColorModeContext } from "./ThemeContext";

// Sidebar width constants
const SIDEBAR_WIDTH = 240;

const Sidebar = styled(Box)(({ theme, open }) => ({
  width: open ? SIDEBAR_WIDTH : 60,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  height: "100vh",
  backgroundColor: "#2a3042",  // Matching dark base color for sidebar
  color: "#fff",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1100,
  display: "flex",
  flexDirection: "column",
  paddingTop: theme.spacing(2),
  borderRight: "2px solid #5b5196",  // Added subtle border
}));

const LayoutContent = styled(Box)(({ theme, open }) => ({
  marginLeft: open ? SIDEBAR_WIDTH : 60,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  padding: theme.spacing(4),
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  flexGrow: 1, // Ensures the content fills the remaining space
}));

const features = [
  { id: "dashboard", title: "Dashboard", icon: <FiMessageSquare />, route: "/dashboard" },
  { id: "mood", title: "Mood Analysis", icon: <FiActivity />, route: "/dashboard/mood" },
  { id: "journal", title: "Journal", icon: <FiBookOpen />, route: "/dashboard/journal" },
  { id: "art-therapy", title: "Art Therapy", icon: <FiImage />, route: "/dashboard/art-therapy" },
  { id: "quiz", title: "Quizzes", icon: <FiActivity />, route: "/dashboard/quiz" },
  { id: "chatbot", title: "AI Chatbot", icon: <FiMessageCircle />, route: "/dashboard/chatbot" },
  { id: "responses", title: "My Responses", icon: <FiDatabase />, route: "/dashboard/responses" },
  { id: "report", title: "Report", icon: <FiBookOpen />, route: "/dashboard/report" },
  { id: "settings", title: "Settings", icon: <FiSettings />, route: "/dashboard/settings" },
];

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

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen}>
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            color: "#fff",
            alignSelf: sidebarOpen ? "flex-end" : "center",
            mb: 2,
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          {sidebarOpen ? <FiChevronLeft /> : <FiMenu />}
        </IconButton>

        <List>
          {features.map((feature) => (
            <ListItem
              button
              key={feature.id}
              selected={location.pathname === feature.route}
              onClick={() => navigate(feature.route)}
              sx={{
                borderRadius: "8px",
                marginBottom: "8px",
                backgroundColor: location.pathname === feature.route ? "#5b5196" : "transparent",
                "&:hover": { backgroundColor: "#5b5196" },
                justifyContent: sidebarOpen ? "initial" : "center",
                px: sidebarOpen ? 2 : 1,
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: sidebarOpen ? 2 : "auto", justifyContent: "center" }}>
                {feature.icon}
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary={feature.title} />}
            </ListItem>
          ))}
        </List>
      </Sidebar>

      {/* Main content */}
      <LayoutContent open={sidebarOpen}>
        <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#2a3042", boxShadow: "none" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(to right, #667eea, #764ba2)", // Gradient effect like the login page
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MindfulAI
            </Typography>
            <Tooltip title="Account">
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ bgcolor: "#2a3042" }}>U</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              slotProps={{ paper: { sx: { mt: 1.5 } } }}
            >
              <MenuItem onClick={colorMode.toggleColorMode}>
                <Switch checked={theme.palette.mode === "dark"} />
                {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <FiLogOut size={20} style={{ marginRight: "8px" }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Route children here */}
        <Box sx={{ mt: 3 }}>
          <Outlet />
        </Box>
      </LayoutContent>
    </Box>
  );
};

export default Layout;
