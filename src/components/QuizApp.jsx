import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  LinearProgress,
  Button,
  Alert
} from '@mui/material';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

const QuizApp = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true); // State to handle loading

  // Load quiz on mount
  useEffect(() => {
    axios.get('http://localhost:3001/quiz')
      .then(res => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(err => {
        console.error("Error fetching quiz:", err);
        setLoading(false); // Set loading to false even on error
      });
  }, []);

  const handleOptionChange = (score) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = score;
    setAnswers(updatedAnswers);

    // Move to next question
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    const updatedAnswers = [...answers];
  
    // Mark as skipped (null) if not already set
    if (updatedAnswers[currentQuestion] === null) {
      updatedAnswers[currentQuestion] = null;
    }
  
    setAnswers(updatedAnswers);
  
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    axios.post(
      'http://localhost:3001/quiz/submit',
      {
        quizId: quiz.id,
        answers: answers.map(ans => ans ?? 0)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {
      setResult(res.data.result);
      setSubmitted(true);
    })
    .catch(err => {
      console.error("Error submitting quiz:", err.response?.data || err.message);
    });
  };

  const getProgress = () => {
    const answeredOrSkipped = answers.filter(ans => ans !== null || ans === 0).length;
    return (answeredOrSkipped / answers.length) * 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <BeatLoader type="Puff" color="#00BFFF" height={100} width={100} />
      </Box>
    ); // Show loader while loading
  }

  if (!quiz) return <Typography variant="h6" align="center" mt={4}>Error loading quiz...</Typography>;

  const currentQ = quiz.questions[currentQuestion];

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    //   sx={{
    //     background: "linear-gradient(to right, #8360c3, #2ebf91)",
    //     py: 4,
    //   }}
    >
      <Box maxWidth="sm" width="100%" bgcolor="white" p={3} borderRadius={2} boxShadow={5}>
        <Box mb={3} textAlign="center">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            {quiz.title}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="caption" display="block" mt={1}>
            {Math.round(getProgress())}% completed{" "}
            {getProgress() < 50 ? "🧠" : getProgress() < 100 ? "🚀" : "🎉"}
          </Typography>
        </Box>
  
        {!submitted ? (
          <>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Q{currentQuestion + 1}. {currentQ.question}
                </Typography>
                <RadioGroup
                  value={answers[currentQuestion] ?? ''}
                  onChange={(e) => handleOptionChange(parseInt(e.target.value))}
                >
                  {currentQ.options.map((option, i) => (
                    <FormControlLabel
                      key={i}
                      value={currentQ.scores[i]}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
  
                {((currentQuestion + 1) % 3 === 0) && (
                  <Typography mt={2} fontStyle="italic" fontSize="0.9rem" color="gray">
                    🌟 “Every step you take brings you closer to self-discovery.”
                  </Typography>
                )}
  
                <Box display="flex" justifyContent="space-between" mt={3}>
                  <Button
                    variant="outlined"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                  >
                    Back
                  </Button>
  
                  <Box>
                    {currentQuestion < quiz.questions.length - 1 ? (
                      <>
                        <Button variant="text" onClick={handleSkip} sx={{ mr: 1 }}>
                          Skip
                        </Button>
                        
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={answers.every(ans => ans === null)}
                      >
                        Submit Quiz
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        ) : (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="h6">Your Result:</Typography>
            <Typography>{result}</Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
  
};

export default QuizApp;
