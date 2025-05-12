import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Fade,
  Tooltip,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Container,
  Alert,
  SwipeableDrawer,
  Backdrop,
  useMediaQuery,
  Grow,
  Zoom,
  Skeleton
} from "@mui/material";
import {
  Mic,
  MicOff,
  ArrowBack,
  ArrowForward,
  Send,
  Check,
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Refresh,
  Lightbulb,
  Psychology,
  BarChart,
  Insights,
  Spa,
  WavingHand,
  Favorite,
  FavoriteBorder,
  Help,
  Close,
  MoreVert
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import Lottie from "react-lottie-player";
import confettiAnimation from "../assets/confetti.json";
import meditationAnimation from "../assets/meditation.json";
import typingAnimation from "../assets/typing.json";

// Animations
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(106, 17, 203, 0.7); transform: scale(1); }
  70% { box-shadow: 0 0 0 15px rgba(106, 17, 203, 0); transform: scale(1.05); }
  100% { box-shadow: 0 0 0 0 rgba(106, 17, 203, 0); transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const breathe = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Styled components for enhanced UI
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(106, 17, 203, 0.1) inset'
    : '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 40px rgba(106, 17, 203, 0.05) inset',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, #2d3748 0%, #1a202c 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.01)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 50px rgba(106, 17, 203, 0.15) inset'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 50px rgba(106, 17, 203, 0.08) inset',
  },
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s infinite linear`,
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  background: theme.palette.mode === 'dark'
    ? 'rgba(45, 55, 72, 0.6)'
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const QuestionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  color: '#fff',
  borderRadius: '24px 24px 0 0',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.1), rgba(0,0,0,0))',
    zIndex: 1
  }
}));

const QuestionContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at top right, rgba(106, 17, 203, 0.1), transparent 70%)'
      : 'radial-gradient(circle at top right, rgba(106, 17, 203, 0.05), transparent 70%)',
    zIndex: -1
  }
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  padding: theme.spacing(1),
  borderRadius: 12,
  background: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.2)'
    : 'rgba(0, 0, 0, 0.03)',
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: -theme.spacing(3),
  fontSize: '0.875rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 10px rgba(106, 17, 203, 0.5)'
    : 'none',
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  padding: '15px 0',
  '& .MuiSlider-track': {
    border: 'none',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    boxShadow: '0 4px 8px rgba(106, 17, 203, 0.3)',
  },
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    border: '2px solid #6a11cb',
    boxShadow: '0 0 10px rgba(106, 17, 203, 0.5)',
    '&::before': {
      boxShadow: '0 0 1px 8px rgba(106, 17, 203, 0.1)',
    },
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(106, 17, 203, 0.2)',
    },
    '&::after': {
      width: 36,
      height: 36,
    },
  },
  '& .MuiSlider-valueLabel': {
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    borderRadius: '50% 50% 50% 0',
    padding: '6px 14px',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
      fontSize: '0.875rem',
      fontWeight: 700,
    },
  },
  '& .MuiSlider-mark': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
  },
  '& .MuiSlider-markActive': {
    backgroundColor: '#fff',
    boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
  },
}));

const EmotionButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5, 2.5),
  margin: theme.spacing(0.7),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(45, 55, 72, 0.5)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(5px)',
  '&.Mui-selected': {
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    color: '#fff',
    boxShadow: '0 5px 15px rgba(106, 17, 203, 0.4)',
    border: '1px solid rgba(106, 17, 203, 0.6)',
    animation: `${pulse} 2s infinite`,
    '&:hover': {
      background: 'linear-gradient(90deg, #5a0cb1 0%, #1565e0 100%)',
    },
  },
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    marginRight: theme.spacing(1),
    transition: 'transform 0.3s ease',
  },
  '&.Mui-selected .MuiSvgIcon-root': {
    transform: 'scale(1.2)',
  }
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.2, 3.5),
  textTransform: 'none',
  fontWeight: 700,
  letterSpacing: '0.5px',
  boxShadow: variant === 'contained'
    ? '0 8px 20px rgba(106, 17, 203, 0.3)'
    : '0 4px 10px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: variant === 'contained'
      ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)'
      : 'none',
    transform: 'translateX(-100%)',
    transition: 'transform 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px) scale(1.03)',
    boxShadow: variant === 'contained'
      ? '0 12px 25px rgba(106, 17, 203, 0.5)'
      : '0 8px 15px rgba(0, 0, 0, 0.1)',
    '&::before': {
      transform: 'translateX(100%)',
    }
  },
  '&:active': {
    transform: 'translateY(2px)',
  },
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiButton-startIcon': {
    transform: 'translateX(-3px)',
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(3px)',
  }
}));

const MicButton = styled(IconButton)(({ theme, active }) => ({
  backgroundColor: active ? '#f44336' : theme.palette.primary.main,
  backgroundImage: active
    ? 'linear-gradient(135deg, #ff5252, #d32f2f)'
    : 'linear-gradient(135deg, #6a11cb, #2575fc)',
  color: '#fff',
  width: 64,
  height: 64,
  boxShadow: active
    ? '0 8px 20px rgba(244, 67, 54, 0.4), 0 0 0 0 rgba(244, 67, 54, 0.8)'
    : '0 8px 20px rgba(106, 17, 203, 0.4), 0 0 0 0 rgba(106, 17, 203, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    padding: 4,
    background: active
      ? 'linear-gradient(135deg, #ff5252, #d32f2f)'
      : 'linear-gradient(135deg, #6a11cb, #2575fc)',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    opacity: 0.5,
  },
  '&:hover': {
    backgroundColor: active ? '#d32f2f' : '#5a0cb1',
    transform: 'scale(1.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.8rem',
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.2)',
  },
  ...(active && {
    animation: `${pulse} 1.5s infinite`,
  }),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    transition: 'all 0.3s ease',
    background: theme.palette.mode === 'dark'
      ? 'rgba(45, 55, 72, 0.3)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(5px)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.05)',
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(106, 17, 203, 0.2)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    },
    '&:hover': {
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: 8,
  }
}));

const ModeToggleContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -theme.spacing(2.5),
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50%',
    height: 1,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)'
      : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 50%, transparent)',
  },
  '& .MuiToggleButtonGroup-root': {
    borderRadius: 30,
    padding: 2,
    background: theme.palette.mode === 'dark'
      ? 'rgba(45, 55, 72, 0.5)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
      : '0 8px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.7) inset',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(106, 17, 203, 0.1), rgba(37, 117, 252, 0.1))',
      opacity: 0.5,
      zIndex: 0,
    }
  },
  '& .MuiToggleButton-root': {
    border: 'none',
    padding: theme.spacing(1.2, 4),
    fontWeight: 700,
    fontSize: '0.95rem',
    textTransform: 'none',
    zIndex: 1,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      color: '#fff',
      '&::before': {
        opacity: 1,
        transform: 'scale(1)',
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,
      borderRadius: 20,
      background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
      opacity: 0,
      transform: 'scale(0.9)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: -1,
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
    }
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1))',
}));

const GlowingText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 3s linear infinite`,
  display: 'inline-block',
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 20px rgba(106, 17, 203, 0.5)'
    : 'none',
}));

const BreathingBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at center, #2d3748 0%, #1a202c 100%)'
    : 'radial-gradient(circle at center, #f5f7fa 0%, #e4e7eb 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmax',
    height: '100vmax',
    background: 'radial-gradient(circle at center, rgba(106, 17, 203, 0.1) 0%, transparent 70%)',
    animation: `${breathe} 8s ease-in-out infinite`,
  }
}));

// Emotion options with icons
const emotionOptions = [
  { value: "Very Happy", icon: <SentimentVerySatisfied />, label: "Very Happy" },
  { value: "Happy", icon: <SentimentSatisfied />, label: "Happy" },
  { value: "Neutral", icon: <SentimentNeutral />, label: "Neutral" },
  { value: "Sad", icon: <SentimentDissatisfied />, label: "Sad" },
  { value: "Very Sad", icon: <SentimentVeryDissatisfied />, label: "Very Sad" },
  { value: "Anxious", icon: <SentimentDissatisfied />, label: "Anxious" },
  { value: "Excited", icon: <SentimentSatisfiedAlt />, label: "Excited" },
  { value: "Tired", icon: <SentimentDissatisfied />, label: "Tired" },
];

const MoodAnalysis = () => {
  const theme = useTheme();
  // State for user type, persisted in localStorage
  const [isStudent, setIsStudent] = useState(() => localStorage.getItem("isStudent") === "true");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState(null);

  const recognitionRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Fallback questions if API fails (generic set)
  const fallbackQuestions = [
    { text: "How do you feel right now?", type: "emotion" },
    { text: "How would you rate your intensity of level of emotions?", type: "slider" },
    { text: "How was your sleep last night?", type: "text" },
    { text: "Tell me about your meals today.", type: "text" },
    { text: "Any notable social interactions?", type: "text" },
    { text: "Is anything worrying you at the moment?", type: "text" },
    { text: "What's one thing you're grateful for?", type: "text" },
    { text: "What are you looking forward to?", type: "text" },
    { text: "If you could change one thing about today, what would it be?", type: "text" },
    { text: "Did anything particular stand out today?", type: "text" },
  ];

  // Function to fetch questions from the backend
  const fetchQuestionsFromBackend = async (studentMode) => {
    setIsLoadingQuestions(true);
    setQuestionError(null);
    setQuestions([]); // Clear previous questions
    setCurrentIndex(0); // Reset index
    setAnswers({}); // Clear previous answers

    const userType = studentMode ? "student" : "general";
    try {
      console.log(`Fetching questions for userType: ${userType}`);
      const response = await axios.get(`http://localhost:5003/generate-questions?user_type=${userType}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setQuestions(response.data);
        console.log("Fetched questions:", response.data);
      } else {
        console.warn("API returned invalid data or no questions for ${userType}, using fallback.");
        setQuestionError(`Could not load ${userType}-specific questions. Using a default set.`);
        setQuestions(fallbackQuestions);
      }
    } catch (error) {
      console.error(`Error fetching ${userType} questions from backend:`, error);
      let errorMessage = "Could not load questions. Using a default set. Please try refreshing later.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Error: ${error.response.data.error}. Using default questions.`;
        if(error.response.data.details) errorMessage += ` Details: ${error.response.data.details}`;
      }
      setQuestionError(errorMessage);
      setQuestions(fallbackQuestions);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Effect to fetch questions when component mounts or isStudent changes
  useEffect(() => {
    fetchQuestionsFromBackend(isStudent);
  }, [isStudent]); // Re-fetch when isStudent changes

  // Effect to initialize Speech Recognition (runs once on mount)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const index = currentIndexRef.current;
        setAnswers((prev) => ({
          ...prev,
          [index]: prev[index] ? prev[index] + " " + transcript : transcript,
        }));
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []); // Empty dependency array: run once for speech recognition setup

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // REMOVE the local generateQuestions function:
  // const generateQuestions = (studentMode) => { ... };

  const handleModeChange = (_, newModeValue) => {
    if (newModeValue === null) return; // If user clicks the already active button
    const newIsStudent = newModeValue === "student";
    localStorage.setItem("isStudent", newIsStudent.toString()); // Store as string
    setIsStudent(newIsStudent);
    // The useEffect listening to `isStudent` will trigger fetchQuestionsFromBackend
  };

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: "[Skipped]" }));
    if (currentIndex < questions.length - 1) {
        handleNext();
    } else {
        handleSubmit(); // Skip last question and submit
    }
  };

  const handleSubmit = async () => {
    // Ensure there are questions to submit, otherwise it's an edge case (e.g. API failed and fallback also failed)
    if (questions.length === 0) {
        console.error("No questions to submit.");
        setSubmitted(true); // Or handle as an error
        return;
    }
    try {
      const token = localStorage.getItem("token");
      const responses = questions.map((q, i) => ({
        question: q.text,
        answer: answers[i] || "[No answer]",
      }));
      console.log("Submitting responses:", JSON.stringify({ responses }, null, 2));
      const response = await axios.post(
        "http://localhost:3001/mood", // Your Node.js backend for submission
        { responses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("LLM scores from Node.js backend:", response.data.scores);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting data:", error);
      // You might want to show an error message to the user here
    }
  };


  // Responsive design adjustments
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.between('sm', 'md'));

  // Memoized animation data
  const lottieOptions = useMemo(() => ({
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }), []);

  if (isLoadingQuestions) {
    return (
      <>
        <BreathingBackground />
        <Container maxWidth="md" sx={{ py: 8, position: 'relative' }}>
          <ModeToggleContainer>
            <ToggleButtonGroup
              value={isStudent ? "student" : "non-student"}
              exclusive
              onChange={handleModeChange}
              aria-label="user type selection"
              disabled={true}
            >
              <ToggleButton value="non-student" aria-label="non-student mode">
                General Mode
              </ToggleButton>
              <ToggleButton value="student" aria-label="student mode">
                Student Mode
              </ToggleButton>
            </ToggleButtonGroup>
          </ModeToggleContainer>

          <FloatingElement>
            <StyledCard sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                opacity: 0.05,
                background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%236a11cb" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")'
              }} />

              <Box sx={{ width: 150, height: 150, mb: 3 }}>
                <Lottie
                  loop
                  animationData={meditationAnimation}
                  play
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>

              <GlowingText variant="h4" sx={{ mb: 2 }}>
                Preparing Your Assessment
              </GlowingText>

              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{
                  maxWidth: '80%',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                We're customizing questions based on your profile to provide the most accurate mood analysis...
              </Typography>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                border: '1px dashed',
                borderColor: 'primary.main',
                maxWidth: '80%'
              }}>
                <CircularProgress size={24} thickness={4} />
                <Typography variant="body2" color="primary" fontWeight={500}>
                  This will only take a moment...
                </Typography>
              </Box>
            </StyledCard>
          </FloatingElement>
        </Container>
      </>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <>
      <BreathingBackground />
      <Container maxWidth="md" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <ModeToggleContainer>
          <ToggleButtonGroup
            value={isStudent ? "student" : "non-student"}
            exclusive
            onChange={handleModeChange}
            aria-label="user type selection"
          >
            <ToggleButton value="non-student" aria-label="non-student mode">
              General Mode
            </ToggleButton>
            <ToggleButton value="student" aria-label="student mode">
              Student Mode
            </ToggleButton>
          </ToggleButtonGroup>
        </ModeToggleContainer>

        {questionError && (
          <Fade in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="warning"
                variant="filled"
                sx={{
                  borderRadius: 16,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  animation: `${pulse} 2s infinite`
                }}
                icon={<SentimentDissatisfied />}
              >
                <Typography fontWeight={600}>{questionError}</Typography>
              </Alert>
            </Box>
          </Fade>
        )}

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          >
            <StyledCard>
              <QuestionHeader sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700}>
                  Assessment Complete
                </Typography>
              </QuestionHeader>
              <QuestionContent sx={{ textAlign: "center", py: 6, position: 'relative' }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  zIndex: 0
                }}>
                  <Lottie
                    loop={false}
                    animationData={confettiAnimation}
                    play
                    style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      opacity: 0.7
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'success.main',
                      margin: '0 auto',
                      mb: 3,
                      boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                      animation: `${pulse} 2s infinite`
                    }}
                  >
                    <Check sx={{ fontSize: 60 }} />
                  </Avatar>

                  <GlowingText variant="h4" sx={{ mb: 2 }}>
                    Thank You!
                  </GlowingText>

                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Your mood assessment has been successfully completed
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mb: 5,
                      maxWidth: '80%',
                      mx: 'auto',
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    }}
                  >
                    Your responses have been recorded and will help us understand your emotional state better.
                    This information will be used to provide personalized insights and recommendations.
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                  }}>
                    <ActionButton
                      variant="contained"
                      onClick={() => window.location.reload()}
                      startIcon={<Refresh />}
                      sx={{ minWidth: 200 }}
                    >
                      Start New Assessment
                    </ActionButton>

                    {/* <ActionButton
                      variant="outlined"
                      onClick={() => navigate('/dashboard/responses')}
                      sx={{ minWidth: 200 }}
                    >
                      View All Responses
                    </ActionButton> */}
                  </Box>
                </Box>
              </QuestionContent>
            </StyledCard>
          </motion.div>
        ) : (
          // Only render question UI if questions are loaded and currentQuestion exists
          questions.length > 0 && currentQuestion ? (
            <motion.div
              key={`${isStudent}-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            >
              <StyledCard>
                <QuestionHeader>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" fontWeight={700}>
                      Question {currentIndex + 1} <span style={{ opacity: 0.7 }}>of {questions.length}</span>
                    </Typography>
                    <Chip
                      label={`${Math.round(progress)}% Complete`}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: '20px',
                        px: 1,
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Box>
                </QuestionHeader>

                <QuestionContent>
                  <ProgressContainer>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                          borderRadius: 5,
                          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                        },
                      }}
                    />
                    <ProgressLabel>{Math.round(progress)}%</ProgressLabel>
                  </ProgressContainer>

                  <Box sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 4,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? 'inset 0 0 15px rgba(0,0,0,0.2)'
                      : 'inset 0 0 15px rgba(0,0,0,0.05)',
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(255,255,255,0.05)'
                      : '1px solid rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0.03,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.mode === 'dark' ? 'ffffff' : '000000'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      zIndex: 0
                    }} />

                    <GlowingText variant="h5" sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                      {currentQuestion.text}
                    </GlowingText>
                  </Box>

                  {currentQuestion.type === "emotion" && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          textAlign: 'center',
                          fontWeight: 500,
                          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                        }}
                      >
                        Select the emotion that best describes how you feel:
                      </Typography>
                      <ToggleButtonGroup
                        value={answers[currentIndex] || ""}
                        exclusive
                        onChange={(_, val) => {if (val !== null) handleAnswerChange(val);}}
                        aria-label="emotion selection"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          flexWrap: "wrap",
                          gap: 1.5
                        }}
                      >
                        {emotionOptions.map((emotion) => (
                          <EmotionButton
                            key={emotion.value}
                            value={emotion.value}
                            aria-label={emotion.label}
                          >
                            {emotion.icon} {emotion.label}
                          </EmotionButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                  )}

                  {currentQuestion.type === "slider" && (
                    <Box sx={{ mt: 4, px: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          textAlign: 'center',
                          fontWeight: 500,
                          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                        }}
                      >
                        Rate your intensity level:
                      </Typography>
                      <Box sx={{ px: 3, pt: 2, pb: 5 }}>
                        <StyledSlider
                          aria-label="Intensity"
                          value={Number(answers[currentIndex]) || 5}
                          onChange={(_, val) => handleAnswerChange(val.toString())}
                          step={1}
                          marks={[
                            { value: 0, label: 'Very Low' },
                            { value: 2, label: 'Low' },
                            { value: 5, label: 'Medium' },
                            { value: 8, label: 'High' },
                            { value: 10, label: 'Very High' },
                          ]}
                          min={0}
                          max={10}
                          valueLabelDisplay="on"
                        />
                      </Box>
                    </Box>
                  )}

                  {currentQuestion.type === "text" && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          textAlign: 'center',
                          fontWeight: 500,
                          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                        }}
                      >
                        Please share your thoughts:
                      </Typography>

                      <StyledTextField
                        fullWidth
                        multiline
                        rows={4}
                        value={answers[currentIndex] || ""}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder="Type your answer here..."
                        variant="outlined"
                        sx={{ mb: 3 }}
                      />

                      {recognitionRef.current && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                          <Tooltip title={isListening ? "Stop recording" : "Record your answer"}>
                            <MicButton
                              onClick={isListening ? stopListening : startListening}
                              aria-label={isListening ? "stop listening" : "start listening"}
                              active={isListening}
                            >
                              {isListening ? <MicOff /> : <Mic />}
                            </MicButton>
                          </Tooltip>

                          {isListening && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 60, height: 30 }}>
                                <Lottie
                                  loop
                                  animationData={typingAnimation}
                                  play
                                  style={{ width: '100%', height: '100%' }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'error.main',
                                  fontWeight: 600
                                }}
                              >
                                Listening...
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}

                  <Divider sx={{
                    my: 4,
                    '&::before, &::after': {
                      borderColor: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.1)',
                    }
                  }}>
                    <Chip
                      label="Navigation"
                      sx={{
                        fontWeight: 600,
                        bgcolor: theme.palette.mode === 'dark'
                          ? 'rgba(106, 17, 203, 0.2)'
                          : 'rgba(106, 17, 203, 0.1)',
                        color: theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.8)'
                          : 'rgba(0,0,0,0.7)',
                      }}
                    />
                  </Divider>

                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <ActionButton
                      variant="outlined"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      startIcon={<ArrowBack />}
                    >
                      Previous
                    </ActionButton>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <ActionButton
                        variant="outlined"
                        onClick={handleSkip}
                      >
                        {currentIndex === questions.length - 1 ? "Skip & Submit" : "Skip"}
                      </ActionButton>

                      {currentIndex === questions.length - 1 ? (
                        <ActionButton
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={!answers[currentIndex] && !(answers[currentIndex] === "[Skipped]")}
                          endIcon={<Send />}
                        >
                          Submit
                        </ActionButton>
                      ) : (
                        <ActionButton
                          variant="contained"
                          onClick={handleNext}
                          disabled={!answers[currentIndex] && !(answers[currentIndex] === "[Skipped]")}
                          endIcon={<ArrowForward />}
                        >
                          Next
                        </ActionButton>
                      )}
                    </Box>
                  </Box>
                </QuestionContent>
              </StyledCard>
            </motion.div>
          ) : (
            // Show if no questions loaded and not loading
            !isLoadingQuestions && !submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <StyledCard>
                  <QuestionHeader sx={{
                    background: 'linear-gradient(90deg, #d32f2f, #f44336)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.1,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                    <Typography variant="h5" fontWeight={700} sx={{ position: 'relative', zIndex: 1 }}>
                      No Questions Available
                    </Typography>
                  </QuestionHeader>
                  <QuestionContent sx={{ textAlign: "center", py: 5 }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      <SentimentDissatisfied sx={{ fontSize: 60, color: 'error.main', opacity: 0.8 }} />

                      <Typography variant="h6" sx={{ mb: 1 }}>
                        We couldn't load your assessment questions
                      </Typography>

                      <Typography variant="body1" sx={{ mb: 3, maxWidth: '80%', color: 'text.secondary' }}>
                        This could be due to a connection issue or server problem. Please check your internet connection or try changing the user mode.
                      </Typography>

                      <ActionButton
                        variant="contained"
                        onClick={() => fetchQuestionsFromBackend(isStudent)}
                        startIcon={<Refresh />}
                        sx={{ minWidth: 200 }}
                      >
                        Try Again
                      </ActionButton>
                    </Box>
                  </QuestionContent>
                </StyledCard>
              </motion.div>
            )
          )
        )}
      </Container>
    </>
  );
};

export default MoodAnalysis;