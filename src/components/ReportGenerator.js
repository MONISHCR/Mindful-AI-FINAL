import React, { useState, useRef } from "react";
import { Button, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from "recharts";
import html2canvas from "html2canvas";
import JSZip from "jszip";

const ReportGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState("");
    const [feedback, setFeedback] = useState("");
    const [scores, setScores] = useState(null);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        setAnalysis("");
        setFeedback("");
        setScores(null);

        try {
            const endpoint = "http://localhost:3001/api/generate-analysis";
            const response = await fetch(endpoint, { method: "GET" });

            if (response.ok) {
                const data = await response.json();
                console.log("API response data:", data);
                setAnalysis(data.analysis || "No analysis text found.");
                setFeedback(data.feedback || "No feedback available.");
                setScores(data.scores || null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to generate report.");
            }
        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const chartData = scores
        ? Object.entries(scores).map(([key, value]) => ({
              name: key.replace(/_/g, " ").toUpperCase(),
              value: value,
          }))
        : [];

    const getBarColor = (value) => {
        if (value >= 7) return "#4caf50"; // Green
        if (value >= 4) return "#ffeb3b"; // Yellow
        return "#f44336"; // Red
    };

    const downloadReport = async () => {
        try {
            const chartCanvas = await html2canvas(chartRef.current);
            const chartImage = chartCanvas.toDataURL("image/png");

            const zip = new JSZip();
            zip.file("analysis_report.txt", analysis);
            zip.file("chart_image.png", chartImage.split(',')[1], { base64: true });

            zip.generateAsync({ type: "blob" }).then(function(content) {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(content);
                link.download = "analysis_report.zip";
                link.click();
            });
        } catch (err) {
            console.error("Error downloading report:", err);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Generate Analysis Report
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={generateReport}
                    sx={{ marginRight: 2 }}
                    disabled={loading}
                >
                    {"Generate Analysis Report"}
                </Button>

                {analysis && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={downloadReport}
                    >
                        Download Report
                    </Button>
                )}
            </Box>

            <Box sx={{ marginTop: 3 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    (analysis || scores) && (
                        <Paper elevation={3} sx={{ padding: 4, backgroundColor: "#ffffff", borderRadius: 3 }}>
                            {analysis && (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Mental Wellness Report
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", marginBottom: 4 }}>
                                        {analysis}
                                    </Typography>
                                </>
                            )}

                            {scores && (
                                <>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                        Note: Higher scores indicate better well-being.
                                    </Typography>
                                    <Box sx={{ height: 300 }} ref={chartRef}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={chartData}
                                                layout="vertical"
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 10]} />
                                                <YAxis type="category" dataKey="name" width={150} />
                                                <Tooltip />
                                                <Bar dataKey="value" barSize={30}>
                                                    <LabelList dataKey="value" position="right" />
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Color Legend */}
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 20, height: 20, bgcolor: '#4caf50' }} />
                                            <Typography variant="body2">Good (7-10)</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 20, height: 20, bgcolor: '#ffeb3b' }} />
                                            <Typography variant="body2">Okay (4-6.9)</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 20, height: 20, bgcolor: '#f44336' }} />
                                            <Typography variant="body2">Danger (0-4)</Typography>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Paper>
                    )
                )}
            </Box>

            {feedback && (
                <Box sx={{ marginTop: 3 }}>
                    <Paper elevation={3} sx={{ padding: 4, backgroundColor: "#f0f0f0", borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Feedback
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                            {feedback}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default ReportGenerator;
