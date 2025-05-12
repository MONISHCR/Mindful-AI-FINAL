import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import JournalComponent from "./components/JournalComponent";
import ArtTherapy from "./components/ArtTherapy";
import QuizApp from "./components/QuizApp";
import Home from "./components/Home";
import Login from "./components/Login";
import IntroPage from "./components/IntroPage";
import MoodAnalysis from "./components/MoodAnalysis";
import ReportGenerator from "./components/ReportGenerator";
import Chatbot from "./components/Chatbot";
import MusicTherapy from "./components/MusicTherapy";
import Responses from "./components/Responses";

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/intro" element={<IntroPage />} />

        {/* Redirect root to intro page (landing page) */}
        <Route path="/" element={<Navigate to="/intro" />} />

        {/* Protected routes - all sidebar-layout routes go here */}
        <Route path="/dashboard" element={
          isAuthenticated() ? <Layout /> : <Navigate to="/login" />
        }>
          <Route index element={<Home />} />
          <Route path="mood" element={<MoodAnalysis />} />
          <Route path="journal" element={<JournalComponent />} />
          <Route path="art-therapy" element={<ArtTherapy />} />
          <Route path="music" element={<MusicTherapy />} />
          <Route path="quiz" element={<QuizApp />} />
          <Route path="responses" element={<Responses />} />
          <Route path="report" element={<ReportGenerator />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
