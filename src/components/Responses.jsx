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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Responses = () => {
  const [userData, setUserData] = useState({ journal: [], mood: [], quiz: [] });

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        🧾 Your Dashboard
      </Typography>

      <Grid container spacing={3} mt={2}>
        {/* Mood Entries */}
                
        {/* Mood Entries */}
        <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
            <Typography variant="h6" gutterBottom>😊 Mood Entries</Typography>
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
        </Card>
        </Grid>


        {/* Journal Entries */}
        {/* Journal Entries */}
<Grid item xs={12} md={4}>
  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>📔 Journal Entries</Typography>
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
  </Card>
</Grid>


        {/* Quiz Answers */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🧠 Quiz Results</Typography>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Responses;
