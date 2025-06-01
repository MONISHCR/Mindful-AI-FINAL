import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Fade,
  useTheme,
  Container,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import MoodIcon from '@mui/icons-material/Mood';
import BookIcon from '@mui/icons-material/Book';
import QuizIcon from '@mui/icons-material/Quiz';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 50%, #f5f9ff 100%)',
  backgroundAttachment: 'fixed',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.514 8.485 20.93 9.9l8.485-8.485h-1.415zM32.372 0L26.8 5.657 28.214 7.07 34.8 0h-2.428zM43.4 0L34.915 8.485 36.33 9.9l8.485-8.485h-1.414zm-9.258 0L25.657 8.485 27.072 9.9l8.485-8.485h-1.415zM38.257 0L29.77 8.485l1.415 1.415 8.485-8.485h-1.414zM0 5.373l.828-.83L2.243 5.96 0 8.2V5.374zm0 5.657l.828-.83L2.243 11.6 0 13.84V11.03zm0 5.657l.828-.83L2.243 17.256 0 19.497v-2.827zm0 5.657l.828-.83L2.243 22.913 0 25.154v-2.827zm0 5.657l.828-.83L2.243 28.57 0 30.81v-2.827zm0 5.657l.828-.83L2.243 34.227 0 36.468v-2.827zm0 5.657l.828-.83L2.243 39.884 0 42.125v-2.827zm0 5.657l.828-.83L2.243 45.54 0 47.782v-2.827zm0 5.657l.828-.83L2.243 51.198 0 53.44v-2.827zm0 5.657l.828-.83L2.243 56.854 0 59.096v-2.827zm60-5.657l-.828.83L57.757 51.2 60 53.44v-2.827zm0-5.657l-.828.83L57.757 45.54 60 47.782v-2.827zm0-5.657l-.828.83L57.757 39.884 60 42.125v-2.827zm0-5.657l-.828.83L57.757 34.227 60 36.468v-2.827zm0-5.657l-.828.83L57.757 28.57 60 30.81v-2.827zm0-5.657l-.828.83L57.757 22.913 60 25.154v-2.827zm0-5.657l-.828.83L57.757 17.256 60 19.497v-2.827zm0-5.657l-.828.83L57.757 11.6 60 13.84v-2.827zm0-5.657l-.828.83L57.757 5.96 60 8.2V5.374zm0-5.657l-.828.83L57.757.3 60 2.544V0h-.1z' fill='%23${theme.palette.mode === 'dark' ? '404040' : 'e0e0e0'}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    opacity: 0.5,
    zIndex: 0,
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 20,
  background: theme.palette.mode === 'dark'
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.4)'
      : '0 20px 40px rgba(0,0,0,0.1)',
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(255,255,255,0.7)',
  borderRadius: '12px !important',
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.02)',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(2),
    background: theme.palette.mode === 'dark'
      ? 'rgba(0,0,0,0.2)'
      : 'rgba(255,255,255,0.7)',
    borderRadius: '0 0 12px 12px',
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(0,0,0,0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: '8px',
  fontWeight: 500,
  background: color || (theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(0,0,0,0.05)'),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(3),
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    borderRadius: 2,
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.02)',
  borderRadius: 12,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const AnimatedAvatar = styled(motion(Avatar))(({ theme }) => ({
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
}));

const AnimatedGrid = styled(motion.div)({
  width: '100%',
});

const Responses = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState({ journal: [], mood: [], quiz: [] });
  const [loading, setLoading] = useState(true);
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageScore: 0,
    positiveResponses: 0,
    streak: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [journalRes, moodRes, quizRes] = await Promise.all([
          fetch(`http://localhost:3001/journal/${userId}`, { headers }),
          fetch(`http://localhost:3001/mood/${userId}`, { headers }),
          fetch(`http://localhost:3001/quiz/${userId}`, { headers }),
        ]);

        const [journal, mood, quiz] = await Promise.all([
          journalRes.json(),
          moodRes.json(),
          quizRes.json(),
        ]);

        setUserData({ journal, mood, quiz });

        // Calculate stats
        const totalEntries = journal.length + mood.length + quiz.length;
        const quizScores = quiz.map(q => q.totalScore || 0);
        const averageScore = quizScores.length 
          ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length 
          : 0;
        
        const positiveResponses = mood.reduce((count, entry) => {
          const positiveAnswers = entry.responses?.filter(r => 
            r.answer && typeof r.answer === 'string' && 
            r.answer.toLowerCase().includes('good')
          ).length || 0;
          return count + positiveAnswers;
        }, 0);

        setStats({
          totalEntries,
          averageScore: Math.round(averageScore),
          positiveResponses,
          streak: calculateStreak(journal.concat(mood, quiz))
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching responses:", err);
      }
    };

    fetchData();
  }, []);

  const calculateStreak = (entries) => {
    if (!entries.length) return 0;
    let streak = 1;
    const today = new Date().setHours(0, 0, 0, 0);
    const sortedDates = entries
      .map(e => new Date(e.date || e.createdAt).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);
    
    if (sortedDates[0] < today) return 0;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diff = (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };

  const extractText = (value) => {
    if (value == null) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.map(extractText).join(", ");
      }
      return value.text || JSON.stringify(value);
    }
    return String(value);
  };

  const getProgressValue = (entry) => {
    if (entry.totalScore) return entry.totalScore;
    if (entry.responses) {
      const positiveResponses = entry.responses.filter(r => 
        r.answer && typeof r.answer === 'string' && 
        r.answer.toLowerCase().includes('good')
      ).length;
      return (positiveResponses / entry.responses.length) * 100;
    }
    return 50;
  };

  return (
    <PageContainer maxWidth="xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 6,
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: theme.palette.mode === 'dark'
                ? '0 2px 10px rgba(106, 17, 203, 0.3)'
                : '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            Your Wellness Journey
          </Typography>

          {/* Stats Overview */}
          {!loading && (
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} md={3}>
                <StatCard>
                  <AnimatedAvatar
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TimelineIcon />
                  </AnimatedAvatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalEntries}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Entries
                    </Typography>
                  </Box>
                </StatCard>
              </Grid>
              <Grid item xs={12} md={3}>
                
              </Grid>
              <Grid item xs={12} md={3}>
               
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard>
                  <AnimatedAvatar
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <EmojiEventsIcon />
                  </AnimatedAvatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.streak}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Day Streak
                    </Typography>
                  </Box>
                </StatCard>
              </Grid>
            </Grid>
          )}

          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} my={8}>
              <CircularProgress size={60} thickness={4} />
              <Typography variant="h6" color="text.secondary">
                Loading your wellness data...
              </Typography>
              {/* Skeleton loading states */}
              <Grid container spacing={4} sx={{ mt: 4 }}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Mood Section */}
              <Grid item xs={12} md={4}>
                <AnimatedGrid
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <StyledCard elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <MoodIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <SectionTitle variant="h5">
                          Mood Tracking
                        </SectionTitle>
                      </Box>

                      {userData.mood.length > 0 ? (
                        userData.mood.map((entry, idx) => (
                          <StyledAccordion
                            key={idx}
                            expanded={expandedPanel === `mood-${idx}`}
                            onChange={() => setExpandedPanel(expandedPanel === `mood-${idx}` ? false : `mood-${idx}`)}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                  <Typography variant="body2">
                                    {new Date(entry.date || entry.createdAt || Date.now()).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <ProgressBar
                                  variant="determinate"
                                  value={getProgressValue(entry)}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              {Array.isArray(entry.responses) ? (
                                entry.responses.map((item, i) => (
                                  <Box key={i} mb={2}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>
                                      {extractText(item.question)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {extractText(item.answer)}
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                  </Box>
                                ))
                              ) : (
                                <Typography variant="body2" color="error">
                                  Invalid format for mood responses
                                </Typography>
                              )}
                            </AccordionDetails>
                          </StyledAccordion>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <MoodIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography color="text.secondary">
                            No mood entries recorded yet
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </StyledCard>
                </AnimatedGrid>
              </Grid>

              {/* Journal Section */}
              <Grid item xs={12} md={4}>
                <AnimatedGrid
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <StyledCard elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <BookIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <SectionTitle variant="h5">
                          Journal Entries
                        </SectionTitle>
                      </Box>

                      {userData.journal.length > 0 ? (
                        userData.journal.map((entry, idx) => (
                          <StyledAccordion
                            key={idx}
                            expanded={expandedPanel === `journal-${idx}`}
                            onChange={() => setExpandedPanel(expandedPanel === `journal-${idx}` ? false : `journal-${idx}`)}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="body2">
                                      {new Date(entry.date || entry.createdAt || Date.now()).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="body2">
                                      {new Date(entry.date || entry.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {extractText(entry.content).substring(0, 50)}...
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'pre-line',
                                  color: theme.palette.mode === 'dark' ? '#fff' : 'text.primary',
                                }}
                              >
                                {extractText(entry.content)}
                              </Typography>
                            </AccordionDetails>
                          </StyledAccordion>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography color="text.secondary">
                            No journal entries yet
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </StyledCard>
                </AnimatedGrid>
              </Grid>

              {/* Quiz Section */}
              <Grid item xs={12} md={4}>
                <AnimatedGrid
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <StyledCard elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <QuizIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <SectionTitle variant="h5">
                          Quiz Results
                        </SectionTitle>
                      </Box>

                      {userData.quiz.length > 0 ? (
                        userData.quiz.map((entry, idx) => (
                          <StyledAccordion
                            key={idx}
                            expanded={expandedPanel === `quiz-${idx}`}
                            onChange={() => setExpandedPanel(expandedPanel === `quiz-${idx}` ? false : `quiz-${idx}`)}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                  <StyledChip
                                    icon={<TrendingUpIcon />}
                                    label={`Score: ${entry.totalScore}`}
                                    size="small"
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {extractText(entry.resultText)}
                                  </Typography>
                                </Box>
                                <ProgressBar
                                  variant="determinate"
                                  value={entry.totalScore}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              {Array.isArray(entry.answers) ? (
                                entry.answers.map((ans, i) => (
                                  <Box key={i} mb={2}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>
                                      {extractText(ans.question)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Selected: {extractText(ans.selectedOption)}
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                  </Box>
                                ))
                              ) : (
                                <Typography variant="caption" color="error">
                                  Invalid answers format
                                </Typography>
                              )}
                            </AccordionDetails>
                          </StyledAccordion>
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <QuizIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography color="text.secondary">
                            No quiz responses yet
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </StyledCard>
                </AnimatedGrid>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
};

export default Responses;
