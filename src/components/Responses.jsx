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
  Paper,
  CircularProgress,
  Fade,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
}));

const AnimatedGrid = styled(motion.div)({
  width: '100%',
});

const Responses = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState({ journal: [], mood: [], quiz: [] });
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching responses:", err);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Fade in={true} timeout={1000}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          🧾 Your Wellness Journey
        </Typography>
      </Fade>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} mt={2}>
        {/* Mood Entries */}
                
        {/* Mood Entries */}
        <Grid item xs={12} md={4}>
          <AnimatedGrid
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard>
            <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>😊</span> Mood Entries
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {userData.mood.length > 0 ? (
                userData.mood.map((entry, idx) => (
                <Accordion key={idx} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">
                        📅 {new Date(entry.date || entry.createdAt || Date.now()).toLocaleDateString()}
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {Array.isArray(entry.responses) ? (
                        entry.responses.map((item, i) => (
                        <Box key={i} mb={2}>
                            <Typography variant="subtitle2" color="text.primary">
                            Q: {extractText(item.question)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            A: {extractText(item.answer)}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                        </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                        Invalid format for mood responses.
                        </Typography>
                    )}
                    </AccordionDetails>
                </Accordion>
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                No mood entries yet.
                </Typography>
            )}
            </CardContent>
            </StyledCard>
          </AnimatedGrid>
        </Grid>


        {/* Journal Entries */}
        {/* Journal Entries */}
        <Grid item xs={12} md={4}>
          <AnimatedGrid
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StyledCard>
    <CardContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>📔</span> Journal Entries
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {userData.journal.length > 0 ? (
        userData.journal.map((entry, idx) => (
          <Accordion key={idx} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">
                🗓️ {new Date(entry.date || entry.createdAt || Date.now()).toLocaleDateString()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
                {extractText(entry.content)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No journal entries yet.
        </Typography>
      )}
    </CardContent>
            </StyledCard>
          </AnimatedGrid>
        </Grid>


        {/* Quiz Answers */}
        <Grid item xs={12} md={4}>
          <AnimatedGrid
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <StyledCard>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🧠</span> Quiz Results
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {userData.quiz.length > 0 ? (
                userData.quiz.map((entry, idx) => (
                  <Accordion key={idx} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">
                        📊 {extractText(entry.resultText)} – Score: {entry.totalScore}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {Array.isArray(entry.answers) ? (
                        entry.answers.map((ans, i) => (
                          <Box key={i} mb={1}>
                            <Typography variant="body2">
                              Q: {extractText(ans.question)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Answered: {extractText(ans.selectedOption)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption" color="error">
                          Invalid answers format
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No quiz responses yet.
                </Typography>
              )}
            </CardContent>
            </StyledCard>
          </AnimatedGrid>
        </Grid>
      </Grid>
      )}
    </Box>
  );
};

export default Responses;
