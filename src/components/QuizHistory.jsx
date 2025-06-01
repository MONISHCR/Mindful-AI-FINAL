import { useEffect, useState } from "react";
import axios from "axios";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        try {
          const res = await axios.get("https://mindful-ai-backend-1.onrender.com/quiz/history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setHistory(res.data);
        } catch (error) {
          console.error("Error fetching history:", error.response?.data || error.message);
        }
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Your Quiz History</h2>
      {history.map((entry, idx) => (
        <div key={idx}>
          <p><strong>Quiz:</strong> {entry.quizTitle}</p>
          <p><strong>Result:</strong> {entry.result}</p>
          <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default QuizHistory;
