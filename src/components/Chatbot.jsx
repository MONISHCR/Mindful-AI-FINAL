import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Fade,
  Tooltip,
  Zoom,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpaIcon from '@mui/icons-material/Spa';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MedicationIcon from '@mui/icons-material/Medication';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/system';

// --- Web Speech API Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

// Initialize speech synthesis with more robust fallbacks
let synth = null;
let synthVoices = [];

try {
  synth = window.speechSynthesis;
  
  // Chrome fix: forces Chrome to load voices
  if (synth && window.navigator.userAgent.indexOf('Chrome') !== -1) {
    synthVoices = synth.getVoices();
  }
} catch (e) {
  console.error("Speech synthesis not available:", e);
}

// Full-screen styled components with mental health focus
const ChatRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 50%, #f5f9ff 100%)',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
      : 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.6,
    zIndex: 0,
  },
  // Add subtle animated gradient background
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(144, 206, 244, 0.1) 0%, rgba(127, 127, 213, 0.1) 100%)',
    opacity: 0.4,
    zIndex: 0,
    animation: 'gradientAnimation 15s ease infinite',
  },
  '@keyframes gradientAnimation': {
    '0%': { opacity: 0.2 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 0.2 },
  }
}));

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1400px',
  height: '100%',
  margin: '0 auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  '@media (max-width: 768px)': {
    padding: theme.spacing(2, 1),
  }
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 30,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 10px 45px rgba(0, 0, 0, 0.3)'
    : '0 10px 45px rgba(86, 137, 245, 0.15)',
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'rgba(26, 32, 44, 0.95)'
    : 'rgba(255, 255, 255, 0.97)',
  backdropFilter: 'blur(15px)',
  position: 'relative',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'}`,
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 15px 55px rgba(0, 0, 0, 0.4)'
      : '0 15px 55px rgba(86, 137, 245, 0.18)'
  }
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3, 4),
  background: 'linear-gradient(90deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)',
  backgroundSize: '200% 200%',
  color: 'white',
  position: 'relative',
  animation: 'gradientFlow 25s ease infinite',
  '@keyframes gradientFlow': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #91EAE4, #7F7FD5, #91EAE4)',
    opacity: 0.4,
  }
}));

const HeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const HeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center'
}));

const HeaderAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
  border: '2px solid rgba(255,255,255,0.6)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 3px 20px rgba(0,0,0,0.2)',
  }
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  background: 'transparent',
  scrollBehavior: 'smooth',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(241, 241, 241, 0.4)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(161, 196, 253, 0.5)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(127, 127, 213, 0.5)',
  },
  // Add subtle background pattern
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(rgba(145, 234, 228, 0.1) 1px, transparent 0)`,
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
    opacity: 0.4,
    zIndex: -1,
  }
}));

const BubbleContainer = styled(Box)(({ theme, align }) => ({
  display: 'flex',
  justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  alignItems: 'flex-end',
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(1),
  width: '100%',
  position: 'relative',
  transformOrigin: align === 'right' ? 'bottom right' : 'bottom left',
  animation: 'bubbleIn 0.3s ease-out forwards',
  '@keyframes bubbleIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px) scale(0.95)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
  }
}));

const BubbleAvatar = styled(Avatar)(({ theme, isUser }) => ({
  width: 36,
  height: 36,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backgroundColor: isUser ? '#7F7FD5' : '#91EAE4',
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid white',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

// Add formatting utility function
const formatMessage = (text) => {
  if (!text) return text;

  // Split into paragraphs
  return text.split('\n').map((paragraph, index) => {
    // Handle bullet points
    if (paragraph.trim().startsWith('*')) {
      const bulletContent = paragraph.trim().replace(/^\*\s*/, '');
      
      // Handle bold text within bullets
      const boldPattern = /\*\*(.*?)\*\*/g;
      const italicPattern = /\*(.*?)\*/g;
      
      let formattedContent = bulletContent
        .replace(boldPattern, '<strong>$1</strong>')
        .replace(italicPattern, '<em>$1</em>');

      return (
        <ListItem key={index} sx={{ 
          py: 0.5, 
          pl: 0,
          '& .MuiListItemIcon-root': {
            minWidth: '24px',
            color: 'inherit',
            opacity: 0.7
          }
        }}>
          <ListItemIcon>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography 
                component="span" 
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            }
          />
        </ListItem>
      );
    }
    
    // Handle regular paragraphs with bold and italic
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    
    let formattedContent = paragraph
      .replace(boldPattern, '<strong>$1</strong>')
      .replace(italicPattern, '<em>$1</em>');

    return (
      <Typography 
        key={index} 
        variant="body1" 
        paragraph 
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  });
};

// Update the Bubble styled component
const Bubble = styled(Paper)(({ theme, owner }) => ({
  maxWidth: '70%',
  minWidth: '40px',
  background: owner === 'user'
    ? theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)'
      : 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 100%)'
    : theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #2C3E50 0%, #1a1a2e 100%)'
      : 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
  color: owner === 'user' 
    ? '#fff' 
    : theme.palette.mode === 'dark' ? '#fff' : '#333',
  borderRadius: owner === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  padding: theme.spacing(2, 3),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0,0,0,0.2)'
    : '0 2px 8px rgba(0,0,0,0.07)',
  position: 'relative',
  transition: 'all 0.3s',
  '& .MuiTypography-root': {
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0
    }
  },
  '& .MuiList-root': {
    padding: 0,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  '& strong': {
    color: theme.palette.mode === 'dark'
      ? theme.palette.primary.light
      : theme.palette.primary.main,
    fontWeight: 600
  },
  '& em': {
    color: theme.palette.mode === 'dark'
      ? theme.palette.secondary.light
      : theme.palette.secondary.main,
    fontStyle: 'italic'
  }
}));

const QuickReplies = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(2, 4),
  borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to bottom, rgba(26, 32, 44, 0.8) 0%, rgba(26, 32, 44, 0.95) 100%)'
    : 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(120deg, rgba(127, 127, 213, 0.05) 0%, rgba(145, 234, 228, 0.05) 100%)',
    backgroundSize: '200% 200%',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  }
}));

const QuickReplyButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(127, 127, 213, 0.15)'
    : 'rgba(127, 127, 213, 0.1)',
  color: theme.palette.mode === 'dark'
    ? theme.palette.primary.light
    : theme.palette.primary.main,
  textTransform: 'none',
  fontWeight: 'normal',
  fontSize: '0.9rem',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 5px rgba(0,0,0,0.2)'
    : '0 2px 5px rgba(0,0,0,0.03)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(127, 127, 213, 0.3)' : 'rgba(127, 127, 213, 0.2)'}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(127, 127, 213, 0.25)'
      : 'rgba(127, 127, 213, 0.2)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&.MuiButton-root': {
    minWidth: 'unset',
  }
}));

const InputBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3, 4),
  background: theme.palette.mode === 'dark'
    ? 'rgba(26, 32, 44, 0.95)'
    : 'rgba(255,255,255,0.85)',
  borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  backdropFilter: 'blur(10px)',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(26, 32, 44, 1)'
      : 'rgba(255,255,255,0.95)',
  },
  '@media (max-width: 600px)': {
    padding: theme.spacing(2, 2),
    gap: theme.spacing(1),
  }
}));

// Add animated microphone indicator
const RecordingIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 107, 107, 0.1)',
  zIndex: 0,
  borderRadius: 5,
  animation: 'pulse-recording 2s infinite',
  pointerEvents: 'none',
  '@keyframes pulse-recording': {
    '0%': { opacity: 0.2, backgroundColor: 'rgba(255, 107, 107, 0.1)' },
    '50%': { opacity: 0.4, backgroundColor: 'rgba(255, 107, 107, 0.2)' },
    '100%': { opacity: 0.2, backgroundColor: 'rgba(255, 107, 107, 0.1)' },
  }
}));

const StatusIndicator = styled(Box)(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#555',
  fontSize: '0.85rem',
  padding: theme.spacing(0.5, 2),
  borderRadius: 20,
  backgroundColor: active ? 'rgba(145, 234, 228, 0.2)' : 'rgba(255,255,255,0.5)',
  border: active ? '1px solid rgba(145, 234, 228, 0.5)' : '1px solid rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  boxShadow: active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
  ...(active && {
    animation: 'pulse 1.5s infinite',
    '@keyframes pulse': {
      '0%': { opacity: 0.7 },
      '50%': { opacity: 1 },
      '100%': { opacity: 0.7 }
    }
  })
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: 25,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#FFF',
    transition: 'all 0.3s',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.2)'
      : '0 2px 8px rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.3)'
        : '0 4px 12px rgba(0,0,0,0.08)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.2)'
        : 'rgba(0,0,0,0.1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(127, 127, 213, 0.5)'
        : 'rgba(127, 127, 213, 0.3)',
    },
    '& input': {
      color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
    },
    '& input::placeholder': {
      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'inherit',
    }
  }
}));

const ActionButton = styled(IconButton)(({ theme, color, active }) => ({
  width: 52,
  height: 52,
  borderRadius: 26,
  transition: 'all 0.2s ease',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)',
    zIndex: 1,
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  '& svg': {
    fontSize: '1.4rem',
    position: 'relative',
    zIndex: 2,
    transition: 'transform 0.2s ease',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
  },
  ...(active && {
    animation: 'pulsate 1.5s infinite',
    '@keyframes pulsate': {
      '0%': { boxShadow: '0 0 0 0 rgba(127, 127, 213, 0.4)' },
      '70%': { boxShadow: '0 0 0 10px rgba(127, 127, 213, 0)' },
      '100%': { boxShadow: '0 0 0 0 rgba(127, 127, 213, 0)' },
    }
  })
}));

const TherapyTip = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2.5, 3),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(75, 108, 183, 0.15) 0%, rgba(24, 40, 72, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(145, 234, 228, 0.15) 0%, rgba(127, 127, 213, 0.15) 100%)',
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  alignSelf: 'center',
  maxWidth: '80%',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 3px 12px rgba(0,0,0,0.2)'
    : '0 3px 12px rgba(0,0,0,0.04)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'}`,
  backdropFilter: 'blur(8px)',
  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
  '& svg': {
    color: theme.palette.mode === 'dark'
      ? theme.palette.primary.light
      : theme.palette.primary.main
  }
}));

const ErrorMsg = styled(Box)(({ theme }) => ({
  color: '#d32f2f',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 107, 107, 0.15)'
    : 'rgba(248, 215, 218, 0.9)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 107, 107, 0.3)'
    : '1px solid rgba(245, 198, 203, 0.5)',
  borderRadius: 12,
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 4, 2, 4),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  fontSize: '0.9rem',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 5px rgba(0,0,0,0.2)'
    : '0 2px 5px rgba(0,0,0,0.05)',
}));

// Mental health quick reply suggestions
const quickReplies = [
  "I'm feeling anxious today",
  "How can I manage stress?",
  "I need motivation",
  "Help me with negative thoughts",
  "Tips for better sleep"
];

// Mental health tips to display randomly
const therapyTips = [
  { icon: <LightbulbIcon />, text: "Take a few deep breaths when feeling overwhelmed. Inhale for 4 counts, hold for 4, exhale for 6." },
  { icon: <VolunteerActivismIcon />, text: "Self-compassion is crucial. Treat yourself with the same kindness you'd offer a good friend." },
  { icon: <PsychologyIcon />, text: "Name your emotions. Just labeling how you feel can reduce their intensity." },
  { icon: <MedicationIcon />, text: "Remember that progress isn't linear. Setbacks are a normal part of growth." }
];

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]); // {owner: 'user'|'bot', text: string}
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [intentionalCancel, setIntentionalCancel] = useState(false);

  const utteranceRef = useRef(null);
  const chatAreaRef = useRef(null);
  const voicesLoadedRef = useRef(false);

  // --- Rotate therapy tips ---
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % therapyTips.length);
    }, 15000);
    return () => clearInterval(tipInterval);
  }, []);

  // --- Global error handling for speech ---
  useEffect(() => {
    // Global error handler to clear any speech-related errors after a short time
    // This prevents transient errors from staying on screen
    if (error && (error.includes('Speech') || error.includes('speak') || error.includes('voice'))) {
      const errorTimer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(errorTimer);
    }
  }, [error]);

  // --- Improved voice loading ---
  useEffect(() => {
    if (!synth) return;

    const loadVoices = () => {
      return new Promise((resolve) => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          synthVoices = voices;
          console.log("Voices loaded:", voices.length);
          voicesLoadedRef.current = true;
          setVoicesLoaded(true);
          resolve(voices);
        } else {
          console.log("No voices available yet, waiting for voiceschanged event");
          
          const voicesChangedCallback = () => {
            const newVoices = synth.getVoices();
            synthVoices = newVoices;
            console.log("Voices changed event, voices:", newVoices.length);
            voicesLoadedRef.current = true;
            setVoicesLoaded(true);
            synth.removeEventListener('voiceschanged', voicesChangedCallback);
            resolve(newVoices);
          };
          
          synth.addEventListener('voiceschanged', voicesChangedCallback);
          
          // Fallback in case the event never fires (some browsers)
          setTimeout(() => {
            const fallbackVoices = synth.getVoices();
            if (fallbackVoices.length > 0 && !voicesLoadedRef.current) {
              synthVoices = fallbackVoices;
              console.log("Fallback voices loaded:", fallbackVoices.length);
              voicesLoadedRef.current = true;
              setVoicesLoaded(true);
              synth.removeEventListener('voiceschanged', voicesChangedCallback);
              resolve(fallbackVoices);
            }
          }, 2000);
        }
      });
    };

    loadVoices().then(voices => {
      console.log(`Successfully loaded ${voices.length} voices`);
    });

    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  // --- Voice Recognition Logic ---
  useEffect(() => {
    if (!recognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    recognition.onresult = (event) => {
      try {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("Speech recognized:", transcript);
        
        if (transcript && transcript.length > 0) {
          // Set the question field with the recognized text
      setQuestion(transcript);
          
          // Use a small delay to ensure the UI updates before submitting
          setTimeout(() => {
            // Only submit if it's a valid transcript
            if (transcript && transcript.length > 0) {
              handleSubmit(transcript);
            }
          }, 100);
        }
      } catch (err) {
        console.error("Error processing speech result:", err);
        setError("Error processing your speech. Please try again.");
      }
    };
    recognition.onerror = (event) => {
      let errorMsg = `Speech recognition error: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMsg = "No speech detected. Please try again.";
      } else if (event.error === 'audio-capture') {
        errorMsg = "Audio capture error. Make sure microphone is enabled and permissions are granted.";
      } else if (event.error === 'not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone access in browser settings.";
      }
      setError(errorMsg);
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    return () => {
      if (recognition) recognition.stop();
    };
  }, []);

  // --- Text-to-Speech Monitoring ---
  useEffect(() => {
    // Monitor speaking state
    const intervalId = setInterval(() => {
      if (synth && !synth.speaking && isSpeaking) {
        setIsSpeaking(false);
      }
    }, 300);

    return () => {
      clearInterval(intervalId);
      cancelSpeech();
    };
  }, [isSpeaking]);

  // --- Scroll to bottom on new message ---
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // --- Helper Functions ---
  const setErrorSafely = (message) => {
    // Don't show any speech interruption errors to the user
    if (message && (
      message.includes('interrupted') || 
      message.includes('cancel') || 
      (message.includes('Speech') && message.includes('error'))
    )) {
      console.log("Suppressing speech error message:", message);
      return;
    }
    setError(message);
  };

  const cancelSpeech = () => {
    if (synth && synth.speaking) {
      try {
        // Set flag before cancelling to ensure it's set during error callbacks
        setIntentionalCancel(true);
        
        // Pause first (helps prevent 'interrupted' errors in some browsers)
        synth.pause();
        
        // Small delay before cancel to allow pause to take effect
        setTimeout(() => {
          try {
            synth.cancel();
          } catch (e) {
            console.error("Error during cancel after pause:", e);
          }
          
          setIsSpeaking(false);
          
          // Longer delay before resetting flag to ensure it covers all potential callbacks
          setTimeout(() => {
            setIntentionalCancel(false);
          }, 500);
        }, 50);
      } catch (e) {
        console.error("Error cancelling speech:", e);
        setIsSpeaking(false);
        setIntentionalCancel(false);
      }
    }
  };

  // --- Find best available voice ---
  const getBestVoice = () => {
    if (!synth || synthVoices.length === 0) {
      console.log("No voices available for selection");
      return null;
    }
    
    // First priority: Female English voices with natural/premium quality
    const premiumVoice = synthVoices.find(voice => 
      voice.name.includes('Female') && 
      voice.lang.includes('en') &&
      (voice.name.includes('Natural') || voice.name.includes('Premium') || voice.name.includes('Wavenet'))
    );
    
    if (premiumVoice) {
      console.log("Using premium voice:", premiumVoice.name);
      return premiumVoice;
    }
    
    // Second priority: Any English female voice
    const femaleVoice = synthVoices.find(voice => 
      voice.name.includes('Female') && 
      voice.lang.includes('en')
    );
    
    if (femaleVoice) {
      console.log("Using female voice:", femaleVoice.name);
      return femaleVoice;
    }
    
    // Third priority: Any English voice
    const englishVoice = synthVoices.find(voice => voice.lang.includes('en'));
    
    if (englishVoice) {
      console.log("Using English voice:", englishVoice.name);
      return englishVoice;
    }
    
    // Fallback: First available voice
    console.log("Using default voice:", synthVoices[0].name);
    return synthVoices[0];
  };

  // --- Event Handlers ---
  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (textToSend = question) => {
    // Safely handle any type of input without circular reference issues
    let textToSubmit;
    
    if (textToSend === null || textToSend === undefined) {
      textToSubmit = '';
    } else if (typeof textToSend === 'string') {
      textToSubmit = textToSend;
    } else if (typeof textToSend === 'object') {
      // Avoid circular references by not using JSON.stringify on DOM elements
      try {
        if (textToSend instanceof Event || textToSend instanceof Node) {
          console.warn("DOM element passed to handleSubmit, using empty string instead");
          textToSubmit = '';
        } else {
          // For safe objects, try to stringify
          textToSubmit = JSON.stringify(textToSend);
        }
      } catch (err) {
        console.error("Error stringifying object:", err);
        textToSubmit = String(textToSend);
      }
    } else {
      // For other types (number, boolean, etc.)
      textToSubmit = String(textToSend);
    }
    
    if (!textToSubmit.trim()) {
      setError('Please enter a question or use the microphone.');
      return;
    }
    setIsLoading(true);
    setError('');
    cancelSpeech();
    
    // Add user message
    setMessages((prev) => [...prev, { owner: 'user', text: textToSubmit }]);
    setQuestion('');
    
    try {
      const res = await fetch('http://localhost:5001/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSubmit }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.answer || `HTTP error! Status: ${res.status}`);
      }
      
      setResponse(data.answer);
      setMessages((prev) => [...prev, { owner: 'bot', text: data.answer }]);
    } catch (err) {
      const errorMessage = err.message || 'Failed to connect to the AI service. Is the backend running?';
      setError(errorMessage);
      setResponse('');
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (replyText) => {
    setQuestion(replyText);
    handleSubmit(replyText);
  };

  const handleMicClick = () => {
    if (!recognition) {
      setError("Speech Recognition API not supported or enabled in this browser.");
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      setError('');
      try {
        // Clear the question field before starting to listen
        setQuestion('');
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone error:", err);
        setError("Could not start microphone. Check permissions.");
        setIsRecording(false);
      }
    }
  };

  // --- Improved speech synthesis handling ---
  const handleSpeakClick = () => {
    if (!synth) {
      setErrorSafely("Text-to-Speech API not supported in this browser.");
      return;
    }
    
    if (isSpeaking) {
      cancelSpeech();
      return;
    }
    
    if (!response || isLoading) {
      return;
    }
    
    // Make sure speech synthesis is ready
    if (!voicesLoadedRef.current && synthVoices.length === 0) {
      setErrorSafely("Voice synthesis is initializing. Please try again in a moment.");
      
      // Try to force load voices and retry
      try {
        synthVoices = synth.getVoices();
        if (synthVoices.length > 0) {
          voicesLoadedRef.current = true;
          setVoicesLoaded(true);
        } else {
          console.log("Waiting for voices to load before speaking...");
          return;
        }
      } catch (e) {
        console.error("Error loading voices:", e);
        return;
      }
    }
    
    // Reset any previous speech
    cancelSpeech();
    
    // Use a small delay to ensure previous speech is fully cancelled 
    // This helps avoid the "interrupted" error in some browsers
    setTimeout(() => {
      // Create and configure the utterance
      try {
        // Set UI state first
        setIsSpeaking(true);
        
        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(response);
        
        // Get best available voice
        const selectedVoice = getBestVoice();
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Set speech properties
        utterance.rate = 0.95;  // Slightly slower for better clarity
        utterance.pitch = 1.0;  // Normal pitch
        utterance.volume = 1.0; // Full volume
        
        // Add event handlers
        utterance.onstart = () => {
          console.log("Speech started successfully");
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log("Speech ended normally");
          setIsSpeaking(false);
          utteranceRef.current = null;
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event.error);
          
          // Always suppress error messages for interrupted and canceled errors,
          // whether intentional or not - these are usually just UI state changes, not real errors
          if (event.error === 'interrupted' || event.error === 'canceled' || intentionalCancel) {
            console.log("Speech was interrupted or cancelled - suppressing error message");
            setIsSpeaking(false);
            utteranceRef.current = null;
            return;
          }
          
          // Only show other types of errors
          let errorMessage = "Speech error occurred";
          
          if (event.error === 'network') {
            errorMessage = "Network error occurred. Check your connection.";
          } else if (event.error) {
            errorMessage = `Speech error: ${event.error}`;
          }
          
          setErrorSafely(errorMessage);
          setIsSpeaking(false);
          utteranceRef.current = null;
        };
        
        // Store ref before speaking
        utteranceRef.current = utterance;
        
        // Browser-specific workarounds
        if (window.navigator.userAgent.indexOf('Chrome') !== -1) {
          // Chrome sometimes needs a pause
          setTimeout(() => {
            try {
              synth.speak(utterance);
            } catch (err) {
              console.error("Error in Chrome speech:", err);
              setErrorSafely("Chrome speech error. Please try again.");
              setIsSpeaking(false);
            }
          }, 50);
        } else {
          // Other browsers
          try {
            synth.speak(utterance);
          } catch (err) {
            console.error("Error starting speech:", err);
            setErrorSafely("Could not start speech. Please try again.");
            setIsSpeaking(false);
          }
        }
        
        // Safety timeout to ensure speaking state is properly updated
        // If speaking doesn't start within 3 seconds, reset the state
        const safetyTimer = setTimeout(() => {
          if (utteranceRef.current && isSpeaking && !synth.speaking) {
            console.log("Speech safety timeout - forcing state update");
            setIsSpeaking(false);
            setErrorSafely("Speech failed to start. Please try again.");
            utteranceRef.current = null;
          }
        }, 3000);
        
        // Clean up safety timer when speech ends or component unmounts
        return () => clearTimeout(safetyTimer);
        
      } catch (err) {
        console.error("Speech synthesis failed:", err);
        setErrorSafely("Could not play audio. Your browser may not fully support text-to-speech.");
        setIsSpeaking(false);
      }
    }, 100); // Small delay before starting new speech
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  // Message grouping to display avatars only once per group
  const messageGroups = messages.reduce((groups, message, index) => {
    const prevMessage = messages[index - 1];
    
    if (!prevMessage || prevMessage.owner !== message.owner) {
      // Start a new group
      groups.push({
        owner: message.owner,
        messages: [message.text]
      });
    } else {
      // Add to the last group
      groups[groups.length - 1].messages.push(message.text);
    }
    
    return groups;
  }, []);

  return (
    <ChatRoot>
      <MainContainer>
        <Zoom in={true} timeout={500}>
          <ChatContainer elevation={3}>
            <Header>
              <HeaderLeft>
                <HeaderAvatar>
                  <PsychologyIcon fontSize="large" />
                </HeaderAvatar>
                <Box>
                  <Typography variant="h5" fontWeight={600} color="white" 
                    sx={{ textShadow: '0px 1px 2px rgba(0,0,0,0.1)' }}>
                    MIND WELLNESS SITE Therapy Assistant
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Your supportive companion for mental wellness
                  </Typography>
                </Box>
              </HeaderLeft>
              <HeaderRight>
                <StatusIndicator active={isSpeaking || isRecording}>
                  {isRecording ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
                </StatusIndicator>
              </HeaderRight>
            </Header>
            
            {error && (
              <Fade in={!!error}><ErrorMsg><ErrorOutlineIcon fontSize="small" />{error}</ErrorMsg></Fade>
            )}
            
            <ChatArea ref={chatAreaRef}>
              {/* Welcome message for empty state */}
              {messages.length === 0 && !isLoading && (
                <Fade in={true} timeout={1000}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    padding: 4,
                    margin: '30px auto',
                    maxWidth: '600px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.5)',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.04)'
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #7F7FD5 0%, #91EAE4 100%)'
                      }}
                    >
                      <VolunteerActivismIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Welcome to MIND WELLNESS SITE
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      I'm here to listen, support, and provide guidance for your mental wellbeing.
                      How are you feeling today?
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      You can type a message, use the suggestions below, or click the microphone to speak.
                    </Typography>
                  </Box>
                </Fade>
              )}
              
              {/* Therapy tip display */}
              {messages.length > 0 && (
                <Fade in={true}>
                  <TherapyTip elevation={0}>
                    {therapyTips[currentTip].icon}
                    <Typography variant="body2" color="textSecondary">
                      <strong>Mindfulness Tip:</strong> {therapyTips[currentTip].text}
                    </Typography>
                  </TherapyTip>
                </Fade>
              )}
              
              {/* Message groups with avatars */}
              {messageGroups.map((group, groupIndex) => (
                <Fade in={true} key={groupIndex} timeout={300}>
                  <Box>
                    {group.messages.map((text, msgIndex) => (
                      <BubbleContainer 
                        key={`${groupIndex}-${msgIndex}`} 
                        align={group.owner === 'user' ? 'right' : 'left'}
                      >
                        {group.owner !== 'user' && msgIndex === 0 && (
                          <BubbleAvatar>
                            <PsychologyIcon fontSize="small" />
                          </BubbleAvatar>
                        )}
                        <Bubble 
                          owner={group.owner} 
                          elevation={2}
                          sx={{ 
                            marginLeft: group.owner !== 'user' && msgIndex > 0 ? '34px' : 0,
                            marginRight: group.owner === 'user' && msgIndex > 0 ? '34px' : 0,
                          }}
                        >
                          {formatMessage(text)}
                        </Bubble>
                        {group.owner === 'user' && msgIndex === 0 && (
                          <BubbleAvatar isUser>
                            <Typography variant="body2">You</Typography>
                          </BubbleAvatar>
                        )}
                      </BubbleContainer>
                    ))}
                  </Box>
                </Fade>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <Fade in={true} timeout={800}>
                  <BubbleContainer align="left">
                    <BubbleAvatar>
                      <PsychologyIcon fontSize="small" />
                    </BubbleAvatar>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: '10px 20px',
                      borderRadius: 20,
                      background: 'rgba(207, 222, 243, 0.3)',
                    }}>
                      <CircularProgress size={16} thickness={4} sx={{ color: '#7F7FD5' }} />
                      <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                        Thinking...
                      </Typography>
                    </Box>
                  </BubbleContainer>
                </Fade>
              )}
            </ChatArea>
            
            {/* Quick reply suggestions */}
            <QuickReplies>
              {quickReplies.map((reply, index) => (
                <QuickReplyButton 
                  key={index} 
                  onClick={() => handleQuickReply(reply)}
                  variant="outlined"
                  size="small"
                  disabled={isLoading}
                  startIcon={index % 2 === 0 ? <VolunteerActivismIcon fontSize="small" /> : <LightbulbIcon fontSize="small" />}
                >
                  {reply}
                </QuickReplyButton>
              ))}
            </QuickReplies>
            
            {/* Input area */}
            <InputBar sx={{ position: 'relative' }}>
              {/* Recording indicator */}
              {isRecording && <RecordingIndicator />}
              
              <StyledTextField
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                variant="outlined"
                placeholder={isRecording ? "Listening to your voice..." : "Type your message here..."}
                value={question}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading || isRecording}
                sx={{ 
                  position: 'relative',
                  zIndex: 1
                }}
              />
              
              <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'} arrow placement="top">
                <span>
                  <ActionButton
                    color={isRecording ? 'error' : 'primary'}
                    onClick={handleMicClick}
                    disabled={isLoading || !recognition}
                    sx={{
                      background: isRecording 
                        ? 'linear-gradient(135deg, #FF6B6B 0%, #FFB88C 100%)'
                        : 'linear-gradient(135deg, #7F7FD5 0%, #91EAE4 100%)',
                      position: 'relative',
                      zIndex: 1,
                      ...(isRecording && {
                        animation: 'pulse-mic 1.5s infinite',
                      }),
                      '@keyframes pulse-mic': {
                        '0%': { boxShadow: '0 0 0 0 rgba(255, 107, 107, 0.7)' },
                        '70%': { boxShadow: '0 0 0 15px rgba(255, 107, 107, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(255, 107, 107, 0)' },
                      }
                    }}
                  >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                  </ActionButton>
                </span>
              </Tooltip>
              
              <Tooltip title={response ? (isSpeaking ? 'Stop Speaking' : 'Speak Response') : 'Send Message'} arrow placement="top">
                <span>
                  <ActionButton
                    color={isSpeaking ? 'warning' : 'primary'}
                    onClick={response && !isLoading ? handleSpeakClick : handleSubmit}
                    disabled={(response ? false : !question.trim()) || isLoading || isRecording}
                    sx={{ 
                      background: isSpeaking
                        ? 'linear-gradient(135deg, #FFB88C 0%, #FF6B6B 100%)'
                        : 'linear-gradient(135deg, #91EAE4 0%, #7F7FD5 100%)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {response && !isLoading ? (isSpeaking ? <StopIcon /> : <VolumeUpIcon />) : <SendIcon />}
                  </ActionButton>
                </span>
              </Tooltip>
            </InputBar>
          </ChatContainer>
        </Zoom>
      </MainContainer>
    </ChatRoot>
  );
}

export default Chatbot; 