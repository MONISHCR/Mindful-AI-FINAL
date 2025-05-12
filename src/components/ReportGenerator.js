import React, { useState, useRef } from "react";
import { Button, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import html2canvas from "html2canvas";  
import JSZip from "jszip";


const ReportGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState("");  
    const [scores, setScores] = useState(null);  
    const [error, setError] = useState(null);
    const chartRef = useRef(null);  

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        setAnalysis("");
        setScores(null);

        try {
            const endpoint = "http://localhost:3001/api/generate-analysis";
            const response = await fetch(endpoint, { method: "GET" });

            if (response.ok) {
                const data = await response.json();
                setAnalysis(data.analysis || "No analysis text found.");
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

    const downloadReport = async () => {
        try {
            const chartCanvas = await html2canvas(chartRef.current);
            const chartImage = chartCanvas.toDataURL("image/png"); 

            // Combine analysis text and chart image into a downloadable report (e.g., as a zip or image+text)
            const zip = new JSZip(); 
            
            // Add the text file to the zip
            zip.file("analysis_report.txt", analysis);

            // Add the chart image to the zip
            zip.file("chart_image.png", chartImage.split(',')[1], { base64: true });

            // Generate the zip file and download
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
                                            <Bar dataKey="value" fill="#1976d2" barSize={30}>
                                                <LabelList dataKey="value" position="right" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </Paper>
                    )
                )}
            </Box>
        </Box>
    );
};

export default ReportGenerator;
