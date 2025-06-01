import React from "react";
import { 
  Box, 
  Typography, 
  Button,
  Zoom,
  Tooltip
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  maxWidth: 500,
  width: "100%",
  borderRadius: 15,
  boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
  backgroundColor: theme.palette.background.paper,
  margin: "0 auto",
  textAlign: "center"
}));

const FeatureButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2, 3),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  width: '100%',
  maxWidth: 280,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  }
}));

const ServicesGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(4),
    gap: theme.spacing(2),
  }
}));

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", position: 'relative' }}>
      <StyledPaper>
        <Typography variant="h4" fontWeight={600}>
          Welcome to MIND WELLNESS SITE
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
          Select a feature to begin your journey.
        </Typography>
        
        <ServicesGrid>
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <FeatureButton 
              variant="contained" 
              color="primary"
              startIcon={<ChatIcon />}
              onClick={() => navigate('/home/chatbot')}
              sx={{ backgroundColor: '#7F7FD5', '&:hover': { backgroundColor: '#6F6FC5' } }}
            >
              Talk to MIND WELLNESS SITE Chatbot
            </FeatureButton>
          </Zoom>

          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <FeatureButton 
              variant="contained" 
              startIcon={<MusicNoteIcon />}
              onClick={() => navigate('/home/music')}
              sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1ed760' } }}
            >
              Music Therapy
            </FeatureButton>
          </Zoom>

          
        </ServicesGrid>
      </StyledPaper>
    </Box>
  );
};

export default Home;
