import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  Paper,
  Fade,
  Zoom,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import { styled } from '@mui/system';
import axios from "axios";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ImageIcon from '@mui/icons-material/Image';
import BrushIcon from '@mui/icons-material/Brush';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

// Styled components for enhanced UI
const TherapyRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e5edf9 100%)',
  padding: theme.spacing(4),
}));

const TherapyContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '1000px',
  borderRadius: 20,
  boxShadow: '0 10px 40px rgba(86, 137, 245, 0.15)',
  overflow: 'hidden',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  background: 'linear-gradient(90deg, #91EAE4 0%, #86A8E7 50%, #7F7FD5 100%)',
  color: 'white',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #91EAE4, #7F7FD5, #91EAE4)',
    opacity: 0.4,
  }
}));

const HeaderAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  border: '2px solid rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 3px 15px rgba(0,0,0,0.15)',
  }
}));

const Content = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(4),
  gap: theme.spacing(4),
  flexDirection: 'column',
  '@media (min-width: 900px)': {
    flexDirection: 'row',
  }
}));

const InputSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const ResultSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 15px rgba(127, 127, 213, 0.25)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0,0,0,0.1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(127, 127, 213, 0.3)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(127, 127, 213, 0.5)',
    }
  }
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(127, 127, 213, 0.2)',
  background: 'linear-gradient(90deg, #91EAE4 0%, #86A8E7 50%, #7F7FD5 100%)',
  backgroundSize: '200% 200%',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundPosition: 'right center',
    boxShadow: '0 6px 18px rgba(127, 127, 213, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 8px rgba(127, 127, 213, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'all 0.6s ease',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const ImageContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
  '& img': {
    width: '100%',
    borderRadius: 10,
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  }
}));

const MoodButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const MoodButton = styled(IconButton)(({ theme, selected }) => ({
  backgroundColor: selected ? 'rgba(127, 127, 213, 0.2)' : 'rgba(255,255,255,0.7)',
  border: selected ? '2px solid rgba(127, 127, 213, 0.5)' : '1px solid rgba(0,0,0,0.1)',
  boxShadow: selected ? '0 4px 12px rgba(127, 127, 213, 0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(127, 127, 213, 0.1)',
    transform: 'translateY(-2px)',
  }
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: 10,
  borderRadius: 16,
}));

const ArtTherapy = () => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const maxWords = 300;

  const moods = [
    { icon: <SentimentSatisfiedAltIcon />, tooltip: "Happy", color: "#4CAF50" },
    { icon: <MoodIcon />, tooltip: "Calm", color: "#2196F3" },
    { icon: <AutoAwesomeIcon />, tooltip: "Inspired", color: "#9C27B0" },
    { icon: <BrushIcon />, tooltip: "Creative", color: "#FF9800" }
  ];

  const handleChange = (event) => {
    const words = event.target.value.split(/\s+/).filter((word) => word !== "");
    if (words.length <= maxWords) {
      setText(event.target.value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // // Enhance prompt with mood if selected
      // const prompt = selectedMood 
      //   ? `${text} (Mood: ${moods[selectedMood].tooltip})` 
      //   : text;
        
      const response = await axios.post("/generate", { text: text });
      setImageUrl(response.data.image_url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };

  return (
    <TherapyRoot>
      <Zoom in={true} timeout={500}>
        <TherapyContainer elevation={4}>
          <Header>
            <HeaderAvatar>
              <ColorLensIcon fontSize="large" />
            </HeaderAvatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Art Therapy Expression
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Transform your thoughts and feelings into visual art
              </Typography>
            </Box>
          </Header>

          <Content>
            <InputSection>
              <Typography variant="h6" gutterBottom sx={{ 
                color: '#556cd6',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <BrushIcon fontSize="small" /> Express Yourself
      </Typography>
      
              <MoodButtonsContainer>
                {moods.map((mood, index) => (
                  <Tooltip key={index} title={mood.tooltip} arrow>
                    <MoodButton 
                      selected={selectedMood === index}
                      onClick={() => setSelectedMood(index === selectedMood ? null : index)}
                      sx={{ color: mood.color }}
                    >
                      {mood.icon}
                    </MoodButton>
                  </Tooltip>
                ))}
              </MoodButtonsContainer>

              <StyledTextField
                id="art-therapy-input"
                label="Describe your thoughts, feelings, or a scene you imagine..."
        variant="outlined"
        multiline
                rows={8}
        value={text}
        onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
      />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="body2" 
                  color={text.split(/\s+/).filter(w => w !== "").length > maxWords * 0.8 ? "error" : "textSecondary"}
                >
        {maxWords - text.split(/\s+/).filter((word) => word !== "").length} words remaining
      </Typography>

                <GenerateButton 
                  variant="contained" 
                  onClick={handleSubmit} 
                  disabled={loading || !text.trim()}
                  startIcon={loading ? undefined : <AutoAwesomeIcon />}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Create Your Art"}
                </GenerateButton>
              </Box>
              
              <Typography variant="body2" color="textSecondary" sx={{ 
                background: 'rgba(145, 234, 228, 0.1)',
                padding: 2,
                borderRadius: 2,
                border: '1px solid rgba(145, 234, 228, 0.3)',
              }}>
                <strong>Tip:</strong> For best results, be descriptive and include details about colors, 
                feelings, and elements you want to see in your art.
              </Typography>
            </InputSection>

            <ResultSection>
              <Typography variant="h6" gutterBottom sx={{ 
                color: '#556cd6',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <ImageIcon fontSize="small" /> Your Artistic Expression
              </Typography>
              
              {!imageUrl && !loading && (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 4,
                  color: 'text.secondary',
                  backgroundColor: 'rgba(145, 234, 228, 0.05)',
                  border: '2px dashed rgba(127, 127, 213, 0.2)',
                  borderRadius: 4
                }}>
                  <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'rgba(127, 127, 213, 0.1)' }}>
                    <BrushIcon fontSize="large" sx={{ color: '#7F7FD5' }} />
                  </Avatar>
                  <Typography variant="body1" align="center" gutterBottom>
                    Your generated artwork will appear here
                  </Typography>
                  <Typography variant="body2" align="center" color="textSecondary">
                    Express your thoughts in the form and click "Create Your Art"
                  </Typography>
                </Box>
              )}

      {imageUrl && (
                <Fade in={!!imageUrl} timeout={800}>
                  <ImageContainer elevation={3}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      Generated Art
                    </Typography>
                    <img 
                      src={`http://localhost:3002${imageUrl}`} 
                      alt="Your Generated AI Art" 
                      loading="lazy"
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Art created based on your expression
                    </Typography>
                  </ImageContainer>
                </Fade>
              )}

              {loading && (
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%',
                  height: 350,
                  backgroundColor: 'rgba(145, 234, 228, 0.05)',
                  border: '2px dashed rgba(127, 127, 213, 0.2)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LoadingOverlay>
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress size={60} sx={{ color: '#7F7FD5', mb: 2 }} />
                      <Typography variant="body1">
                        Creating your artwork...
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        This may take a moment while we craft something special
                      </Typography>
                    </Box>
                  </LoadingOverlay>
        </Box>
      )}
            </ResultSection>
          </Content>
        </TherapyContainer>
      </Zoom>
    </TherapyRoot>
  );
};

export default ArtTherapy;
