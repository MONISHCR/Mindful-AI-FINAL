import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(to right, #667eea, #764ba2)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  color: "#fff",
}));

const IntroContainer = styled(Container)(({ theme }) => ({
  textAlign: "center",
  maxWidth: "700px",
}));

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <BackgroundBox>
      <IntroContainer>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Welcome to MindfulAI
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
          Your personal companion for mental wellness, journaling, mood tracking, art therapy,
          and interactive quizzes to better understand your emotions.
        </Typography>

        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: "30px",
            backgroundColor: "#fff",
            color: "#2a3042",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Get Started
        </Button>
      </IntroContainer>
    </BackgroundBox>
  );
};

export default IntroPage;
