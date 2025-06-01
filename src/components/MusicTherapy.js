import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Avatar, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fade,
  Zoom,
  Tooltip,
  Slider,
  useTheme,
  Chip,
  Snackbar,
  Alert,
  Grid,
  Divider,
  Container,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/system';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/Home';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// Styled components for light UI theme
const TherapyRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f2f5',
  backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  color: '#333',
  overflow: 'hidden',
  position: 'relative',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  color: '#1a237e',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
}));

const HeaderAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  backgroundColor: 'rgba(255,255,255,0.3)',
  border: '2px solid rgba(255,255,255,0.8)',
}));

const MainContent = styled(Container)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(10),
  },
  '& > *': {
    animation: 'fadeIn 0.5s ease-out',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  borderBottom: '1px solid #e0e0e0',
}));

const TabItem = styled(Button)(({ theme, active }) => ({
  padding: theme.spacing(2, 3),
  fontWeight: active ? 600 : 400,
  color: active ? '#7F7FD5' : '#757575',
  borderBottom: active ? '3px solid #7F7FD5' : 'none',
  borderRadius: '12px 12px 0 0',
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: active ? 'rgba(127,127,213,0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(127,127,213,0.05)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease',
}));

const MoodGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const MoodCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: color || '#7F7FD5',
    transition: 'height 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
    '&:before': {
      height: '100%',
      opacity: 0.1,
    },
  },
  '& .MuiTypography-root': {
    position: 'relative',
    zIndex: 1,
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&.Mui-focused': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: '#7F7FD5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7F7FD5',
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1.1rem',
  background: 'linear-gradient(45deg, #7F7FD5 30%, #91EAE4 90%)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(127,127,213,0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #6F6FC5 30%, #81DAD4 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(127,127,213,0.4)',
  },
  transition: 'all 0.3s ease',
}));

const NowPlayingBar = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 4),
  height: 90,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(0,0,0,0.05)',
  width: '100%',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  transform: active ? 'translateY(0)' : 'translateY(100%)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 -4px 30px rgba(0,0,0,0.05)',
}));

const SongInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: 3,
  [theme.breakpoints.down('md')]: {
    flex: 2,
  },
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  },
}));

const PlayerControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 4,
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flex: 3,
  },
  [theme.breakpoints.down('sm')]: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));

const VolumeControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: 3,
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flex: 2,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const AlbumArt = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  marginRight: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
  },
}));

const PlayPauseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#7F7FD5',
  color: 'white',
  width: 48,
  height: 48,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#6F6FC5',
    transform: 'scale(1.1)',
  },
  boxShadow: '0 4px 15px rgba(127,127,213,0.3)',
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: '#757575',
  '&:hover': {
    color: '#333',
  },
  [theme.breakpoints.down('sm')]: {
    padding: 6,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  fontSize: '2rem',
  color: '#1a237e',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    background: 'linear-gradient(90deg, #7F7FD5, #91EAE4)',
    borderRadius: 2,
  }
}));

const FavoriteCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
  cursor: 'pointer',
  overflow: 'visible',
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  backgroundColor: 'rgba(255,255,255,0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.3)',
  }
}));

const ScrollToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 90,
  right: 20,
  backgroundColor: 'white',
  color: '#7F7FD5',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  zIndex: 900,
  [theme.breakpoints.down('sm')]: {
    bottom: 80,
    right: 10,
  },
}));

// Predefined mood options with colors
const moods = [
  { label: 'Happy', color: '#4CAF50' },
  { label: 'Sad', color: '#5C6BC0' },
  { label: 'Energetic', color: '#FF9800' },
  { label: 'Calm', color: '#26A69A' },
  { label: 'Relaxed', color: '#7CB342' },
  { label: 'Motivated', color: '#F44336' },
  { label: 'Focused', color: '#42A5F5' },
  { label: 'Sleepy', color: '#9575CD' },
  { label: 'Romantic', color: '#EC407A' },
  { label: 'Anxious', color: '#78909C' },
  { label: 'Confident', color: '#FF7043' }
];

// Predefined language options with popularity
const languages = [
  { label: 'English', popular: true },
  { label: 'Spanish', popular: true },
  { label: 'Hindi', popular: true },
  { label: 'Telugu', popular: true },
  { label: 'Tamil', popular: true },
  { label: 'Korean', popular: false },
  { label: 'Japanese', popular: false },
  { label: 'French', popular: false },
  { label: 'German', popular: false },
  { label: 'Italian', popular: false },
  { label: 'Portuguese', popular: false },
  { label: 'Arabic', popular: false }
];

// YouTube Player API integration
const loadYouTubeAPI = () => {
  if (window.YT) return Promise.resolve();

  return new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
};

const MusicTherapy = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [mood, setMood] = useState('');
  const [language, setLanguage] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [previousPlayState, setPreviousPlayState] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Handle scroll events to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Load YouTube API when component mounts
  useEffect(() => {
    loadYouTubeAPI().catch(err => {
      console.error("Failed to load YouTube API:", err);
      setError("Failed to load YouTube player. Please try again later.");
    });
    
    // Load favorite songs from localStorage
    try {
      const savedFavorites = localStorage.getItem('musicFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
    
    // Clean up function
    return () => {
      if (player) {
        try {
          player.stopVideo();
          player.destroy();
        } catch (err) {
          console.error("Error destroying player:", err);
        }
      }
    };
  }, []);

  // Initialize player when videoId changes
  useEffect(() => {
    if (!videoId || !window.YT || !window.YT.Player) return;
    
    // Create hidden player container if it doesn't exist
    let playerContainer = document.getElementById('youtube-player-container');
    if (!playerContainer) {
      playerContainer = document.createElement('div');
      playerContainer.id = 'youtube-player-container';
      playerContainer.style.display = 'none';
      document.body.appendChild(playerContainer);
    }
    
    try {
      // Destroy existing player if any
      if (player) {
        player.destroy();
      }
      
      // Create new player instance
      const newPlayer = new window.YT.Player('youtube-player-container', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            event.target.playVideo();
            setPlayer(event.target);
            setIsPlaying(true);
            
            // Show notification
            setNotification({
              open: true,
              message: 'Now playing your music therapy track',
              severity: 'success'
            });
          },
          onStateChange: (event) => {
            // 1 = playing, 2 = paused, 0 = ended
            setIsPlaying(event.data === 1);
            
            // Auto-play next song when current one ends
            if (event.data === 0) {
              handleNextSong();
            }
          },
          onError: (event) => {
            console.error("YouTube Player Error:", event.data);
            setError("An error occurred while playing the video. Please try again.");
            setNotification({
              open: true,
              message: 'Error playing song. Finding another one...',
              severity: 'error'
            });
            
            // Try to get a new song automatically
            setTimeout(() => {
              handleNextSong();
            }, 2000);
          }
        }
      });
      
      setPlayer(newPlayer);
    } catch (err) {
      console.error("Error creating YouTube player:", err);
      setError("Failed to create YouTube player. Please try again.");
    }
  }, [videoId]);

  // Update volume when it changes
  useEffect(() => {
    if (player) {
      try {
        player.setVolume(isMuted ? 0 : volume);
      } catch (err) {
        console.error("Error setting volume:", err);
      }
    }
  }, [volume, isMuted, player]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async () => {
    if (!mood || !language) {
      setError('Please select both mood and language.');
      setNotification({
        open: true,
        message: 'Please select both mood and language',
        severity: 'warning'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Clean up existing player before searching for a new song
    if (player) {
      try {
        player.stopVideo();
        player.destroy();
        setPlayer(null);
      } catch (err) {
        console.error("Error cleaning up player:", err);
      }
    }
    
    setVideoId(null);

    try {
      // Call your Flask backend API
      const backendUrl = `http://localhost:5003/api/search_song?mood=${encodeURIComponent(mood)}&language=${encodeURIComponent(language)}`;
      
      const response = await fetch(backendUrl);
      
      if (!response.ok) {
        let errorMsg = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          // Ignore if response wasn't JSON
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      
      if (data.success && data.videoId) {
        setVideoId(data.videoId);
      } else {
        setError(data.error || 'Failed to find a suitable song.');
        setNotification({
          open: true,
          message: data.error || 'Failed to find a suitable song',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'An error occurred while fetching data.');
      setNotification({
        open: true,
        message: err.message || 'Network error while finding song',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    if (language) {
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  };

  const handleTogglePlay = () => {
    if (!player) return;
    
    try {
      if (isPlaying) {
        player.pauseVideo();
        setPreviousPlayState(true);
        setNotification({
          open: true,
          message: 'Music paused',
          severity: 'info'
        });
      } else {
        player.playVideo();
        setPreviousPlayState(false);
        setNotification({
          open: true,
          message: 'Music resumed',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error("Error toggling play state:", err);
      setError("Failed to control playback. Please try again.");
    }
  };

  const handleNextSong = () => {
    // Save previous play state to resume automatically if it was playing
    if (player) {
      setPreviousPlayState(isPlaying);
    }
    
    // Search for a new song with the same parameters
    handleSearch();
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    setIsMuted(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    
    setNotification({
      open: true,
      message: isMuted ? 'Sound on' : 'Sound muted',
      severity: 'info'
    });
  };

  const handleToggleFavorite = () => {
    if (!videoId) return;
    
    const isFavorite = favorites.some(fav => fav.videoId === videoId);
    let newFavorites;
    
    if (isFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter(fav => fav.videoId !== videoId);
      setNotification({
        open: true,
        message: 'Removed from favorites',
        severity: 'info'
      });
    } else {
      // Add to favorites
      const newFavorite = {
        videoId,
        mood,
        language,
        timestamp: new Date().toISOString()
      };
      newFavorites = [...favorites, newFavorite];
      setNotification({
        open: true,
        message: 'Added to favorites!',
        severity: 'success'
      });
    }
    
    setFavorites(newFavorites);
    
    // Save to localStorage
    try {
      localStorage.setItem('musicFavorites', JSON.stringify(newFavorites));
    } catch (err) {
      console.error("Error saving favorites:", err);
    }
  };

  const handlePlayFavorite = (favorite) => {
    setMood(favorite.mood);
    setLanguage(favorite.language);
    setVideoId(favorite.videoId);
  };

  const isFavorite = videoId && favorites.some(fav => fav.videoId === videoId);
  
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({...notification, open: false});
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMuteIcon />;
    if (volume < 50) return <VolumeDownIcon />;
    return <VolumeUpIcon />;
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SectionTitle variant="h3" gutterBottom>
              Welcome to Music Therapy
            </SectionTitle>
            <Typography variant="h6" sx={{ mb: 4, color: '#555', maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
              Experience the healing power of music. Our AI-powered platform helps you find the perfect melodies 
              to match your mood and improve your mental well-being.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setActiveTab('discover')}
              sx={{ 
                background: 'linear-gradient(45deg, #7F7FD5 30%, #91EAE4 90%)',
                borderRadius: 12,
                padding: '12px 36px',
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(127,127,213,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6F6FC5 30%, #81DAD4 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(127,127,213,0.4)',
                }
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        );
      
      case 'favorites':
        return (
          <Box>
            <SectionTitle>Your Favorites</SectionTitle>
            {favorites.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center',
                  py: 8,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <FavoriteIcon sx={{ fontSize: 60, color: '#7F7FD5', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  Your favorites list is empty
                </Typography>
                <Typography variant="body1" sx={{ color: '#888' }}>
                  Play a song and click the heart icon to add it to your favorites
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {favorites.map((favorite, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FavoriteCard onClick={() => handlePlayFavorite(favorite)}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 56,
                              height: 56,
                              bgcolor: moods.find(m => m.label === favorite.mood)?.color || '#7F7FD5',
                              mr: 2
                            }}
                          >
                            <MusicNoteIcon sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {favorite.mood}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: '#666' }}>
                              {favorite.language}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 0.5 }}>
                              Added {new Date(favorite.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </FavoriteCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );
      
      case 'discover':
      default:
        return (
          <Box>
            <SectionTitle>Find Your Perfect Music</SectionTitle>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                How are you feeling today?
              </Typography>
              
              <MoodGrid container spacing={2}>
                {moods.map((moodOption) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={moodOption.label}>
                    <MoodCard 
                      color={moodOption.color}
                      onClick={() => handleMoodSelect(moodOption.label)}
                      sx={{
                        borderLeft: mood === moodOption.label ? `4px solid ${moodOption.color}` : `4px solid ${moodOption.color}`,
                        transform: mood === moodOption.label ? 'scale(1.05)' : 'none',
                        borderTop: mood === moodOption.label ? `1px solid ${moodOption.color}` : 'none',
                        borderRight: mood === moodOption.label ? `1px solid ${moodOption.color}` : 'none',
                        borderBottom: mood === moodOption.label ? `1px solid ${moodOption.color}` : 'none',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} sx={{ color: moodOption.color }}>
                        {moodOption.label}
                      </Typography>
                    </MoodCard>
                  </Grid>
                ))}
              </MoodGrid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Preferred Language
                </Typography>
                <StyledFormControl fullWidth id="language-select">
                  <InputLabel id="language-select-label">Select Language</InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={language}
                    label="Select Language"
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isLoading}
                  >
                    <MenuItem disabled value="" sx={{ opacity: 0.7 }}>
                      <em>Popular Languages</em>
                    </MenuItem>
                    
                    {languages
                      .filter(lang => lang.popular)
                      .map((lang) => (
                        <MenuItem key={lang.label} value={lang.label}>
                          {lang.label}
                        </MenuItem>
                    ))}
                    
                    <MenuItem disabled value="" sx={{ opacity: 0.7 }}>
                      <em>Other Languages</em>
                    </MenuItem>
                    
                    {languages
                      .filter(lang => !lang.popular)
                      .map((lang) => (
                        <MenuItem key={lang.label} value={lang.label}>
                          {lang.label}
                        </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <SearchButton
                    variant="contained"
                    onClick={handleSearch}
                    disabled={isLoading || !mood || !language}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  >
                    {isLoading ? 'Finding the perfect song...' : 'Find Music for My Mood'}
                  </SearchButton>
                  
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  return (
    <TherapyRoot>
      {/* Header */}
      <Header>
        <BackButton color="inherit" onClick={() => navigate('/home')}>
          <ArrowBackIcon />
        </BackButton>
        <HeaderAvatar>
          <MusicNoteIcon fontSize="medium" />
        </HeaderAvatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Music Therapy
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Find music that matches your mood
          </Typography>
        </Box>
      </Header>

      {/* Main Content */}
      <MainContent maxWidth="lg">
        <TabsContainer>
          <TabItem 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')}
            startIcon={<HomeIcon />}
          >
            Home
          </TabItem>
          
          <TabItem 
            active={activeTab === 'discover'} 
            onClick={() => setActiveTab('discover')}
            startIcon={<SearchIcon />}
          >
            Discover
          </TabItem>
          
          <TabItem 
            active={activeTab === 'favorites'} 
            onClick={() => setActiveTab('favorites')}
            startIcon={<FavoriteIcon />}
          >
            Favorites
          </TabItem>
        </TabsContainer>
        
        {renderContent()}
      </MainContent>

      {/* Now Playing Bar */}
      <NowPlayingBar active={!!videoId}>
        <SongInfo>
          <AlbumArt
            sx={{
              bgcolor: moods.find(m => m.label === mood)?.color || '#7F7FD5',
            }}
          >
            <MusicNoteIcon />
          </AlbumArt>
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {mood} Mood Music
            </Typography>
            <Typography variant="body2" sx={{ color: '#777' }}>
              {language} • Music Therapy
            </Typography>
          </Box>
        </SongInfo>
        
        <PlayerControls>
          <ActionIconButton onClick={handleToggleFavorite}>
            <FavoriteIcon color={isFavorite ? 'error' : 'inherit'} />
          </ActionIconButton>
          
          <PlayPauseButton onClick={handleTogglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </PlayPauseButton>
          
          <ActionIconButton onClick={handleNextSong}>
            <SkipNextIcon />
          </ActionIconButton>
        </PlayerControls>
        
        <VolumeControl>
          <ActionIconButton onClick={handleToggleMute}>
            {getVolumeIcon()}
          </ActionIconButton>
          <Slider
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-labelledby="volume-slider"
            sx={{
              color: '#7F7FD5',
              width: 100,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              }
            }}
          />
        </VolumeControl>
      </NowPlayingBar>
      
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Zoom in={showScrollToTop}>
          <ScrollToTopButton onClick={scrollToTop}>
            <KeyboardArrowUpIcon />
          </ScrollToTopButton>
        </Zoom>
      )}
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </TherapyRoot>
  );
};

export default MusicTherapy; 