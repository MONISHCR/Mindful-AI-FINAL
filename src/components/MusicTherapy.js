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
  backgroundColor: '#f9f9f9',
  color: '#333',
  overflow: 'hidden',
  position: 'relative',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  background: 'linear-gradient(90deg, #7F7FD5, #91EAE4)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
}));

const HeaderAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  backgroundColor: 'rgba(255,255,255,0.3)',
  border: '2px solid rgba(255,255,255,0.8)',
}));

const MainContent = styled(Container)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(10), // Space for player bar
  },
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  borderBottom: '1px solid #e0e0e0',
}));

const TabItem = styled(Button)(({ theme, active }) => ({
  padding: theme.spacing(1.5, 2),
  fontWeight: active ? 600 : 400,
  color: active ? '#7F7FD5' : '#757575',
  borderBottom: active ? '2px solid #7F7FD5' : 'none',
  borderRadius: 0,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(127, 127, 213, 0.08)',
  },
  transition: 'all 0.2s',
}));

const MoodGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const MoodCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 100,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
  borderLeft: `4px solid ${color || '#7F7FD5'}`,
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'white',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7F7FD5',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#7F7FD5',
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: '#7F7FD5',
  color: 'white',
  '&:hover': {
    backgroundColor: '#6F6FC5',
  },
}));

const NowPlayingBar = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 3),
  height: 80,
  backgroundColor: 'white',
  borderTop: '1px solid #e0e0e0',
  width: '100%',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  transform: active ? 'translateY(0)' : 'translateY(100%)',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
  [theme.breakpoints.down('sm')]: {
    height: 70,
    padding: theme.spacing(1, 2),
  },
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
  '&:hover': {
    backgroundColor: '#6F6FC5',
  },
  width: 40,
  height: 40,
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
  },
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
  marginBottom: theme.spacing(2),
  fontSize: '1.5rem',
  color: '#333',
}));

const FavoriteCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
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
          <Box>
            <SectionTitle>Welcome to Music Therapy</SectionTitle>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Music therapy uses the power of music to improve your mental and emotional well-being.
              Choose a mood to find the perfect music that resonates with how you're feeling.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setActiveTab('discover')}
              sx={{ 
                bgcolor: '#7F7FD5', 
                borderRadius: 8,
                padding: '10px 20px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#6F6FC5' }
              }}
            >
              Start Listening
            </Button>
          </Box>
        );
      
      case 'favorites':
        return (
          <Box>
            <SectionTitle>Your Favorites</SectionTitle>
            {favorites.length === 0 ? (
              <Typography variant="body1" sx={{ color: '#666' }}>
                You haven't added any favorites yet. Play a song and click the heart icon to add it here.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {favorites.map((favorite, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FavoriteCard
                      onClick={() => handlePlayFavorite(favorite)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: moods.find(m => m.label === favorite.mood)?.color || '#7F7FD5',
                              mr: 2
                            }}
                          >
                            <MusicNoteIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {favorite.mood} • {favorite.language}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                              Added on {new Date(favorite.timestamp).toLocaleDateString()}
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
        <BackButton color="inherit" onClick={() => navigate('/')}>
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