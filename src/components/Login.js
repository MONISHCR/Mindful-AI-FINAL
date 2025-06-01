import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Container,
  Fade,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SpaIcon from '@mui/icons-material/Spa';

// Breathing animation keyframes
const breatheAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const rippleAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const BreathingCircle = styled(Box)(({ theme, isBreathing }) => ({
  position: 'absolute',
  bottom: '-120px',
  left: 0,
  width: '100%',
  height: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 0,
  '& .circle': {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? '#4B6CB7' : '#667eea',
    animation: isBreathing ? `${breatheAnimation} 4s ease-in-out infinite` : 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: 'inherit',
      animation: isBreathing ? `${rippleAnimation} 4s ease-in-out infinite` : 'none',
    },
    '&::before': {
      animationDelay: '-1s',
    },
    '& svg': {
      fontSize: '24px',
      color: '#fff',
      zIndex: 1,
    },
  },
  '& .text': {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    color: theme.palette.mode === 'dark' ? '#fff' : '#667eea',
    textAlign: 'center',
    width: '200px',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
}));

const StyledProgress = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.mode === 'dark' ? '#4B6CB7' : '#667eea',
  opacity: 0.2,
}));

const LoginWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)`
    : `linear-gradient(45deg, #667eea 0%, #764ba2 100%)`,
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(15),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    opacity: 0.6,
    zIndex: 0,
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 450,
  width: "100%",
  borderRadius: 20,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 40px rgba(0,0,0,0.4)'
    : '0 10px 40px rgba(0,0,0,0.2)',
  background: theme.palette.mode === 'dark'
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '80px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  '& svg': {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.9)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(255,255,255,1)',
    },
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.2)'
        : 'rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.3)'
        : theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.7)'
      : 'inherit',
  },
  '& .MuiInputAdornment-root': {
    '& .MuiIconButton-root': {
      color: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.7)'
        : 'inherit',
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #4B6CB7 0%, #182848 100%)'
    : 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 15px rgba(0,0,0,0.3)'
    : '0 4px 15px rgba(102,126,234,0.3)',
  border: 'none',
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 20px rgba(0,0,0,0.4)'
      : '0 6px 20px rgba(102,126,234,0.4)',
  }
}));

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  // Breathing exercise timer
  useEffect(() => {
    let timer;
    if (isBreathing) {
      timer = setInterval(() => {
        setBreathCount(prev => {
          if (prev >= 3) {
            setIsBreathing(false);
            return 0;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per breath cycle
    }
    return () => clearInterval(timer);
  }, [isBreathing]);

  const handleBreathingClick = () => {
    setIsBreathing(true);
    setBreathCount(0);
  };

  const getBreathingText = () => {
    if (!isBreathing) return "Click to start a quick breathing exercise";
    return breathCount % 2 === 0 ? "Breathe in..." : "Breathe out...";
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      const response = await axios.post("https://mindful-ai-backend-1.onrender.com/login", {
        username,
        password,
      });

      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <LoginWrapper>
      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <Fade in={true} timeout={1000}>
          <StyledPaper elevation={6}>
            <LogoBox>
              <PsychologyIcon />
              <Typography 
                variant="h4" 
                gutterBottom 
                align="center" 
                fontWeight={600}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #9f7aea, #4B6CB7)'
                    : 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome to MIND WELLNESS SITE
              </Typography>
              <Typography 
                variant="body1" 
                align="center" 
                color="textSecondary" 
                sx={{ mb: 3, maxWidth: 300 }}
              >
                Your personal companion for mental wellness and growth
              </Typography>
            </LogoBox>

            {error && (
              <Fade in={true}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,82,82,0.1)' 
                      : 'rgba(255,82,82,0.1)',
                    color: theme.palette.mode === 'dark'
                      ? '#ff5252'
                      : '#d32f2f',
                    '& .MuiAlert-icon': {
                      color: theme.palette.mode === 'dark'
                        ? '#ff5252'
                        : '#d32f2f'
                    }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <StyledTextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledButton
              fullWidth
              onClick={handleLogin}
            >
              Sign In
            </StyledButton>

            <Typography 
              align="center" 
              sx={{ 
                mt: 3,
                color: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.7)'
                  : 'inherit'
              }}
            >
              Don&apos;t have an account?{" "}
              <Link 
                to="/signup" 
                style={{ 
                  color: theme.palette.mode === 'dark' 
                    ? theme.palette.primary.light 
                    : theme.palette.primary.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </StyledPaper>
        </Fade>
        
        <BreathingCircle isBreathing={isBreathing}>
          <Box className="circle" onClick={handleBreathingClick}>
            <SpaIcon />
            <StyledProgress 
              variant="determinate" 
              value={isBreathing ? ((breathCount % 2) * 50) + 50 : 0} 
              size={70} 
            />
          </Box>
          <Typography className="text" variant="body2">
            {getBreathingText()}
          </Typography>
        </BreathingCircle>
      </Container>
    </LoginWrapper>
  );
};

export default Login;
