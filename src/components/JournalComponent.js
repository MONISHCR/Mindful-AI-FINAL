import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./JournalComponent.css";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Fade,
  Zoom,
  Grow,
  Divider,
  Paper,
  Container,
  Grid,
  Avatar,
  Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Delete,
  Close,
  CalendarToday,
  AccessTime,
  Favorite,
  FavoriteBorder,
  ContentCopy,
  FormatQuote,
  CloudUpload
} from "@mui/icons-material";
import Lottie from "react-lottie-player";
import writingAnimation from "../assets/writing.json";

const CHAR_LIMIT = 1000; // Increased character limit

// Styled components
const JournalContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2.5rem',
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    borderRadius: '2px',
  }
}));

const JournalGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(6),
}));

const JournalCard = styled(Card)(() => ({
  height: '100%',
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 30px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  }
}));

const CardActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(0.5),
  opacity: 0,
  transition: 'opacity 0.2s ease',
  zIndex: 10,
  '.MuiCard-root:hover &': {
    opacity: 1,
  }
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  }
}));

const CardDate = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  marginBottom: theme.spacing(1),
}));

const CardPreview = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.95rem',
  lineHeight: 1.6,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
}));

const EditorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  position: 'relative',
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, #2d3748 0%, #1a202c 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(106, 17, 203, 0.05), transparent 70%)',
    zIndex: 0,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(106, 17, 203, 0.2)',
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '16px',
    fontSize: '1rem',
    lineHeight: 1.6,
  }
}));

const CharCounter = styled(Box)(({ theme, warning }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  color: warning ? theme.palette.warning.main : theme.palette.text.secondary,
  fontWeight: warning ? 600 : 400,
  transition: 'color 0.3s ease',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: theme.spacing(1.2, 3.5),
  textTransform: 'none',
  fontWeight: 700,
  letterSpacing: '0.5px',
  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  boxShadow: '0 8px 20px rgba(106, 17, 203, 0.3)',
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
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px) scale(1.03)',
    boxShadow: '0 12px 25px rgba(106, 17, 203, 0.5)',
    '&::before': {
      transform: 'translateX(100%)',
    }
  },
  '&:active': {
    transform: 'translateY(2px)',
  },
}));

const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '20px',
  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(4),
  maxWidth: '600px',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(106, 17, 203, 0.3)',
    borderRadius: '4px',
  }
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(3),
  position: 'relative',
  paddingBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    borderRadius: '1.5px',
  }
}));

const ModalText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.8,
  color: theme.palette.text.primary,
  whiteSpace: 'pre-line',
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  textAlign: 'center',
}));

const JournalComponent = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [favoriteEntries, setFavoriteEntries] = useState([]);
  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get("http://localhost:3001/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Format the entries with proper dates
        const formattedEntries = response.data.map(entry => ({
          ...entry,
          formattedDate: new Date(entry.createdAt || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          formattedTime: new Date(entry.createdAt || Date.now()).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

        setJournalEntries(formattedEntries);
      } catch (error) {
        console.error("Error fetching journal entries", error);
        setError(error.message || "Failed to load journal entries");
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, [refresh]);

  const handleInputChange = (e) => {
    const text = e.target.value;

    if (text.length <= CHAR_LIMIT) {
      setNewEntry(text);
    } else {
      alert(`Character limit of ${CHAR_LIMIT} exceeded!`);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEntry.trim()) {
      setError("Journal content cannot be empty");
      return;
    }

    if (newEntry.length > CHAR_LIMIT) {
      setError(`Character limit of ${CHAR_LIMIT} exceeded!`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        "http://localhost:3001/journal",
        { content: newEntry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Journal Entry Response:", response.data);

      if (response.data && response.data.message) {
        setNewEntry(""); // Clear the input field
        setSuccess(true);

        // Show success message briefly
        setTimeout(() => {
          setSuccess(false);
        }, 3000);

        // Refresh the entries list
        setRefresh(prev => !prev);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
      setError(error.message || "Failed to save journal entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId, event) => {
    // Stop event propagation to prevent opening the modal
    if (event) {
      event.stopPropagation();
    }

    if (!window.confirm("Are you sure you want to delete this journal entry?")) {
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.delete(`http://localhost:3001/journal/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Trigger refresh after deleting an entry
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error deleting journal entry", error);
      setError(error.message || "Failed to delete journal entry");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (entryId, event) => {
    if (event) {
      event.stopPropagation();
    }

    setFavoriteEntries(prev => {
      if (prev.includes(entryId)) {
        return prev.filter(id => id !== entryId);
      } else {
        return [...prev, entryId];
      }
    });
  };

  const handleCardClick = (entry) => {
    setSelectedEntry(entry);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEntry(null);
  };



  return (
    <JournalContainer>
      <PageTitle variant="h2">My Journal</PageTitle>

      {/* Error and Success Messages */}
      {error && (
        <Fade in={Boolean(error)}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={success}>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            onClose={() => setSuccess(false)}
          >
            Journal entry saved successfully!
          </Alert>
        </Fade>
      )}

      {/* Journal Entries Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : journalEntries.length === 0 ? (
        <EmptyState>
          <Box sx={{ mb: 3, opacity: 0.7 }}>
            <Lottie
              loop
              animationData={writingAnimation}
              play
              style={{ width: 200, height: 200 }}
            />
          </Box>
          <Typography variant="h5" gutterBottom>No Journal Entries Yet</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '600px' }}>
            Start documenting your thoughts and feelings. Regular journaling can help improve mental clarity and emotional well-being.
          </Typography>
        </EmptyState>
      ) : (
        <JournalGrid>
          {journalEntries.slice().reverse().map((entry, index) => (
            <Zoom in={true} key={entry._id} style={{ transitionDelay: `${index * 50}ms` }}>
              <JournalCard onClick={() => handleCardClick(entry)}>
                <CardActions>
                  <Tooltip title="Favorite">
                    <ActionIconButton onClick={(e) => toggleFavorite(entry._id, e)}>
                      {favoriteEntries.includes(entry._id) ?
                        <Favorite fontSize="small" color="error" /> :
                        <FavoriteBorder fontSize="small" />
                      }
                    </ActionIconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <ActionIconButton onClick={(e) => handleDelete(entry._id, e)}>
                      <Delete fontSize="small" color="error" />
                    </ActionIconButton>
                  </Tooltip>
                </CardActions>

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Entry {journalEntries.length - index}
                    </Typography>
                  </Box>

                  <CardDate>
                    <CalendarToday fontSize="small" />
                    {entry.formattedDate} • <AccessTime fontSize="small" /> {entry.formattedTime}
                  </CardDate>

                  <Divider sx={{ my: 1.5 }} />

                  <CardPreview>
                    {entry.content}
                  </CardPreview>
                </CardContent>
              </JournalCard>
            </Zoom>
          ))}
        </JournalGrid>
      )}

      {/* New Entry Form */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatQuote sx={{ transform: 'rotate(180deg)', color: 'primary.main' }} />
          Add a New Journal Entry
          <FormatQuote sx={{ color: 'primary.main' }} />
        </Typography>

        <EditorContainer>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              multiline
              rows={6}
              value={newEntry}
              onChange={handleInputChange}
              placeholder="Write your thoughts here..."
              variant="outlined"
              disabled={submitting}
            />

            <CharCounter warning={newEntry.length > CHAR_LIMIT * 0.9}>
              {newEntry.length} / {CHAR_LIMIT} characters
            </CharCounter>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <SubmitButton
                type="submit"
                variant="contained"
                disabled={submitting || !newEntry.trim() || newEntry.length > CHAR_LIMIT}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
              >
                {submitting ? "Saving..." : "Save Entry"}
              </SubmitButton>
            </Box>
          </form>
        </EditorContainer>
      </Box>

      {/* Full Entry Modal */}
      <StyledModal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{
          backdrop: Fade
        }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={openModal}>
          <ModalContent>
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Close />
            </IconButton>

            <ModalTitle>
              {selectedEntry &&
                `Journal Entry - ${new Date(selectedEntry.createdAt || Date.now()).toLocaleDateString()}`
              }
            </ModalTitle>

            <ModalText>
              {selectedEntry ? selectedEntry.content : ""}
            </ModalText>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() => {
                  if (selectedEntry) {
                    navigator.clipboard.writeText(selectedEntry.content);
                    alert("Content copied to clipboard!");
                  }
                }}
              >
                Copy
              </Button>

              <Button
                variant="contained"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          </ModalContent>
        </Fade>
      </StyledModal>
    </JournalContainer>
  );
};

export default JournalComponent;
