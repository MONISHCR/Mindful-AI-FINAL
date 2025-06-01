import React, { useState, useRef } from "react";
import { 
    Button, 
    Typography, 
    Box, 
    CircularProgress, 
    Paper,
    Container,
    Fade,
    Grow,
    IconButton,
    Tooltip,
    useTheme
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
    minHeight: '100vh',
    padding: 0,
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 50%, #f5f9ff 100%)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.514 8.485 20.93 9.9l8.485-8.485h-1.415zM32.372 0L26.8 5.657 28.214 7.07 34.8 0h-2.428zM43.4 0L34.915 8.485 36.33 9.9l8.485-8.485h-1.414zm-9.258 0L25.657 8.485 27.072 9.9l8.485-8.485h-1.415zM38.257 0L29.77 8.485l1.415 1.415 8.485-8.485h-1.414zM0 5.373l.828-.83L2.243 5.96 0 8.2V5.374zm0 5.657l.828-.83L2.243 11.6 0 13.84V11.03zm0 5.657l.828-.83L2.243 17.256 0 19.497v-2.827zm0 5.657l.828-.83L2.243 22.913 0 25.154v-2.827zm0 5.657l.828-.83L2.243 28.57 0 30.81v-2.827zm0 5.657l.828-.83L2.243 34.227 0 36.468v-2.827zm0 5.657l.828-.83L2.243 39.884 0 42.125v-2.827zm0 5.657l.828-.83L2.243 45.54 0 47.782v-2.827zm0 5.657l.828-.83L2.243 51.198 0 53.44v-2.827zm0 5.657l.828-.83L2.243 56.854 0 59.096v-2.827zm60-5.657l-.828.83L57.757 51.2 60 53.44v-2.827zm0-5.657l-.828.83L57.757 45.54 60 47.782v-2.827zm0-5.657l-.828.83L57.757 39.884 60 42.125v-2.827zm0-5.657l-.828.83L57.757 34.227 60 36.468v-2.827zm0-5.657l-.828.83L57.757 28.57 60 30.81v-2.827zm0-5.657l-.828.83L57.757 22.913 60 25.154v-2.827zm0-5.657l-.828.83L57.757 17.256 60 19.497v-2.827zm0-5.657l-.828.83L57.757 11.6 60 13.84v-2.827zm0-5.657l-.828.83L57.757 5.96 60 8.2V5.374zm0-5.657l-.828.83L57.757.3 60 2.544V0h-.1z' fill='%23${theme.palette.mode === 'dark' ? '404040' : 'e0e0e0'}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none'
    }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    padding: theme.spacing(4),
    background: theme.palette.mode === 'dark'
        ? 'rgba(26, 32, 44, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(4),
    overflowY: 'auto',
    height: 'calc(100vh - 200px)', // Adjust based on header height
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
        '&:hover': {
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        }
    }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(26, 32, 44, 0.8)'
        : 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
        : '0 8px 32px rgba(31, 38, 135, 0.15)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)'}`,
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
    }
}));

const AnimatedButton = styled(motion.div)({
    display: 'inline-block'
});

const ColorBox = styled(Box)(({ color }) => ({
    width: 20,
    height: 20,
    backgroundColor: color,
    borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}));

const ReportGenerator = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState("");
    const [feedback, setFeedback] = useState("");
    const [scores, setScores] = useState(null);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);
    const reportRef = useRef(null);

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
        if (value >= 7) return "#f44336"; // Green
        if (value >= 4) return "#ffeb3b"; // Yellow
        return "#4caf50"; // 
    };

    const downloadReport = async () => {
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;

            // Add title
            pdf.setFontSize(24);
            pdf.setTextColor(106, 17, 203);
            const title = "Mental Wellness Report";
            const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
            const titleX = (pageWidth - titleWidth) / 2;
            pdf.text(title, titleX, margin + 10);

            // Add date
            pdf.setFontSize(12);
            pdf.setTextColor(100, 100, 100);
            const date = new Date().toLocaleDateString();
            pdf.text(`Generated on: ${date}`, margin, margin + 20);

            // Add analysis text
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text("Analysis:", margin, margin + 35);
            
            const splitAnalysis = pdf.splitTextToSize(analysis, pageWidth - 2 * margin);
            pdf.setFontSize(12);
            pdf.text(splitAnalysis, margin, margin + 45);

            // Add chart
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                const chartImage = canvas.toDataURL('image/png');
                const chartWidth = pageWidth - 2 * margin;
                const chartHeight = (canvas.height * chartWidth) / canvas.width;
                
                // Check if we need a new page for the chart
                if (pdf.internal.getCurrentPageInfo().pageNumber * pageHeight - pdf.internal.getNumberOfPages() < chartHeight + margin) {
                    pdf.addPage();
                }
                
                pdf.addImage(chartImage, 'PNG', margin, pdf.internal.getCurrentPageInfo().pageNumber * pageHeight - chartHeight - margin, chartWidth, chartHeight);
            }

            // Add feedback on a new page
            if (feedback) {
                pdf.addPage();
                pdf.setFontSize(14);
                pdf.setTextColor(25, 118, 210);
                pdf.text("Personalized Recommendations:", margin, margin + 10);
                
                pdf.setFontSize(12);
                pdf.setTextColor(0, 0, 0);
                const splitFeedback = pdf.splitTextToSize(feedback, pageWidth - 2 * margin);
                pdf.text(splitFeedback, margin, margin + 25);
            }

            // Add footer with page numbers
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - margin);
            }

            // Save the PDF
            pdf.save('mental_wellness_report.pdf');
        } catch (err) {
            console.error("Error generating PDF:", err);
            setError("Failed to generate PDF report");
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    return (
        <StyledContainer maxWidth="xl">
            <HeaderSection>
                <Typography 
                    variant="h3" 
                    align="center"
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: theme.palette.mode === 'dark'
                            ? '0 2px 10px rgba(106, 17, 203, 0.3)'
                            : '0 2px 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Mental Wellness Analysis
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <AnimatedButton
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateReport}
                            disabled={loading}
                            startIcon={<AssessmentIcon />}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #5a0cb7 0%, #1565e8 100%)',
                                }
                            }}
                        >
                            Generate Analysis Report
                        </Button>
                    </AnimatedButton>

                    {analysis && (
                        <AnimatedButton
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={downloadReport}
                                startIcon={<DownloadIcon />}
                                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                            >
                                Download Report
                            </Button>
                        </AnimatedButton>
                    )}
                </Box>
            </HeaderSection>

            <ScrollableContent ref={reportRef}>
                {loading ? (
                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        gap: 2,
                        py: 8
                    }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" color="text.secondary">
                            Analyzing your wellness data...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Fade in>
                        <StyledPaper sx={{ 
                            p: 3, 
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(244, 67, 54, 0.1)' 
                                : 'rgba(244, 67, 54, 0.05)',
                            border: '1px solid rgba(244, 67, 54, 0.2)'
                        }}>
                            <Typography color="error">{error}</Typography>
                        </StyledPaper>
                    </Fade>
                ) : (
                    (analysis || scores) && (
                        <Grow in>
                            <StyledPaper>
                                {analysis && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography 
                                            variant="h5" 
                                            gutterBottom
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            Mental Wellness Report
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                whiteSpace: "pre-wrap",
                                                lineHeight: 1.8
                                            }}
                                        >
                                            {analysis}
                                        </Typography>
                                    </Box>
                                )}

                                {scores && (
                                    <Box sx={{ mt: 4 }}>
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            Wellness Metrics
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            Higher scores indicate areas that may need attention
                                        </Typography>
                                        <Box sx={{ height: 300 }} ref={chartRef}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={chartData}
                                                    layout="vertical"
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid 
                                                        strokeDasharray="3 3" 
                                                        stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                                                    />
                                                    <XAxis 
                                                        type="number" 
                                                        domain={[0, 10]}
                                                        tick={{ fill: theme.palette.text.primary }}
                                                    />
                                                    <YAxis 
                                                        type="category" 
                                                        dataKey="name" 
                                                        width={150}
                                                        tick={{ fill: theme.palette.text.primary }}
                                                    />
                                                    <ChartTooltip
                                                        contentStyle={{
                                                            backgroundColor: theme.palette.background.paper,
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                    <Bar dataKey="value" barSize={30}>
                                                        <LabelList 
                                                            dataKey="value" 
                                                            position="right"
                                                            fill={theme.palette.text.primary}
                                                        />
                                                        {chartData.map((entry, index) => (
                                                            <Cell 
                                                                key={`cell-${index}`} 
                                                                fill={getBarColor(entry.value)}
                                                                style={{
                                                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                                                }}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>

                                        <Box sx={{ 
                                            mt: 3,
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.mode === 'dark' 
                                                ? 'rgba(255,255,255,0.05)'
                                                : 'rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            gap: 3,
                                            justifyContent: 'center',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ColorBox color="#4caf50" />
                                                <Typography variant="body2">Good (0-4)</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ColorBox color="#ffeb3b" />
                                                <Typography variant="body2">Moderate (4-6.9)</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ColorBox color="#f44336" />
                                                <Typography variant="body2">Needs Attention (7-10)</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </StyledPaper>
                        </Grow>
                    )
                )}

                {feedback && (
                    <Fade in>
                        <Box sx={{ marginTop: 3 }}>
                            <StyledPaper sx={{ 
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(25, 118, 210, 0.1)'
                                    : 'rgba(25, 118, 210, 0.05)'
                            }}>
                                <Typography 
                                    variant="h5" 
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.primary.main
                                    }}
                                >
                                    Personalized Recommendations
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.8
                                    }}
                                >
                                    {feedback}
                                </Typography>
                            </StyledPaper>
                        </Box>
                    </Fade>
                )}
            </ScrollableContent>
        </StyledContainer>
    );
};

export default ReportGenerator;
