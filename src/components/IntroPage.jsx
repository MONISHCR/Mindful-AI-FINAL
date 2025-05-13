import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  Zoom,
  Grow,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/system";
import {
  Psychology,
  SelfImprovement,
  Spa,
  Favorite,
  Edit,
  BarChart,
  Brush,
  QuestionAnswer,
  ArrowForward,
  GitHub,
  LinkedIn,
  Twitter
} from "@mui/icons-material";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); transform: scale(1); }
  70% { box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); transform: scale(1.05); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
  position: "relative",
  overflow: "hidden",
  color: "#fff",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 30%, rgba(76, 29, 149, 0.4) 0%, transparent 70%), radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.4) 0%, transparent 70%)",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    opacity: 0.5,
    zIndex: 0,
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
    "& .card-icon": {
      transform: "scale(1.2) rotate(10deg)",
    }
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #8b5cf6, #d946ef, #8b5cf6)",
    backgroundSize: "200% 100%",
    animation: `${shimmer} 3s infinite linear`,
  }
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: "60px",
  height: "60px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(217, 70, 239, 0.8))",
  boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)",
  transition: "all 0.3s ease",
  "& svg": {
    fontSize: "30px",
    color: "#fff",
  }
}));

const FloatingElement = styled(Box)(({ delay = 0 }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const GlowingText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: "linear-gradient(90deg, #8b5cf6, #d946ef, #8b5cf6)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${shimmer} 3s linear infinite`,
  display: "inline-block",
  textShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
  letterSpacing: "-1px",
}));

const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "16px 32px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "1.1rem",
  letterSpacing: "0.5px",
  background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
    transform: "translateX(-100%)",
    transition: "transform 0.5s ease",
  },
  "&:hover": {
    transform: "translateY(-5px) scale(1.03)",
    boxShadow: "0 15px 30px rgba(139, 92, 246, 0.6)",
    "&::before": {
      transform: "translateX(100%)",
    }
  },
  "&:active": {
    transform: "translateY(2px)",
  },
}));

const OrbitingDot = styled(Box)(({ index, total }) => {
  const angle = (360 / total) * index;
  const delay = index * 0.5;

  return {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
    boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
    animation: `${rotate} 20s linear infinite`,
    animationDelay: `-${delay}s`,
    transform: `rotate(${angle}deg) translateX(150px)`,
  };
});

const TeamMemberCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  position: "relative",
  padding: theme.spacing(3),
  textAlign: "center",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
  },
}));

const TeamMemberAvatar = styled(Box)(({ theme }) => ({
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2.5rem",
  fontWeight: 700,
  color: "#fff",
  boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)",
  animation: `${pulse} 3s infinite`,
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: "#fff",
  background: "rgba(255, 255, 255, 0.1)",
  margin: theme.spacing(0.5),
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-3px)",
  }
}));

const IntroPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Refs for scroll animations
  const featuresRef = useRef(null);
  const teamRef = useRef(null);

  // State for animations
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);

  // Check if elements are in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === featuresRef.current && entry.isIntersecting) {
            setFeaturesVisible(true);
          }
          if (entry.target === teamRef.current && entry.isIntersecting) {
            setTeamVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (teamRef.current) observer.observe(teamRef.current);

    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (teamRef.current) observer.unobserve(teamRef.current);
    };
  }, []);

  // Features data
  const features = [
    {
      icon: <Psychology />,
      title: "Mental Wellness",
      description: "Track and improve your mental health with personalized insights and recommendations."
    },
    {
      icon: <Edit />,
      title: "Journaling",
      description: "Document your thoughts and feelings in a secure, private digital journal."
    },
    {
      icon: <Favorite />,
      title: "Mood Tracking",
      description: "Monitor your emotional patterns and identify triggers for better self-awareness."
    },
    {
      icon: <Brush />,
      title: "Art Therapy",
      description: "Express yourself through creative digital art exercises designed for emotional healing."
    },
    {
      icon: <QuestionAnswer />,
      title: "Interactive Quizzes",
      description: "Gain insights about yourself through scientifically-designed psychological assessments."
    },
    {
      icon: <BarChart />,
      title: "Progress Reports",
      description: "Visualize your wellness journey with comprehensive analytics and reports."
    },
  ];

  // Team members data
  const team = [
    { name: "Manvitha" },
    { name: "Isha"},
    { name: "Monish" },
  ];

  return (
    <BackgroundBox>
      {/* Animated background elements */}
      {[...Array(10)].map((_, i) => (
        <OrbitingDot key={i} index={i} total={10} />
      ))}

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography variant="overline" sx={{
                  color: "#d8b4fe",
                  letterSpacing: "3px",
                  fontWeight: 600,
                  mb: 2,
                  display: "block"
                }}>
                  ELEVATE YOUR MENTAL WELLBEING
                </Typography>

                <GlowingText variant="h1" sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                  mb: 2,
                  lineHeight: 1.1
                }}>
                  Welcome to MindWellness
                </GlowingText>

                <Typography variant="h6" sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 4,
                  maxWidth: "600px",
                  lineHeight: 1.6
                }}>
                  Your personal companion for mental wellness, journaling, mood tracking,
                  art therapy, and interactive quizzes to better understand your emotions.
                </Typography>

                <HeroButton
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  endIcon={<ArrowForward />}
                >
                  Get Started
                </HeroButton>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5}>
            <FloatingElement>
              <Box sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", md: "400px" },
                display: { xs: "none", sm: "block" }
              }}>
                <Box sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(217, 70, 239, 0.8) 100%)",
                  filter: "blur(40px)",
                  opacity: 0.6,
                }} />

                <Box sx={{
                  position: "absolute",
                  top: "30%",
                  left: "20%",
                  width: "100px",
                  height: "100px",
                  borderRadius: "24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: `${float} 6s ease-in-out infinite`,
                  animationDelay: "0.5s",
                }}>
                  <SelfImprovement sx={{ fontSize: 50, color: "#d8b4fe" }} />
                </Box>

                <Box sx={{
                  position: "absolute",
                  top: "60%",
                  right: "20%",
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: `${float} 6s ease-in-out infinite`,
                  animationDelay: "1s",
                }}>
                  <Spa sx={{ fontSize: 40, color: "#d8b4fe" }} />
                </Box>

                <Box sx={{
                  position: "absolute",
                  top: "20%",
                  right: "10%",
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: `${float} 6s ease-in-out infinite`,
                  animationDelay: "1.5s",
                }}>
                  <Favorite sx={{ fontSize: 30, color: "#d8b4fe" }} />
                </Box>
              </Box>
            </FloatingElement>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box ref={featuresRef} sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="overline" sx={{
              color: "#d8b4fe",
              letterSpacing: "3px",
              fontWeight: 600,
              mb: 2,
              display: "block"
            }}>
              FEATURES
            </Typography>

            <GlowingText variant="h2" sx={{ mb: 2 }}>
              Comprehensive Wellness Tools
            </GlowingText>

            <Typography variant="h6" sx={{
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "700px",
              mx: "auto"
            }}>
              Explore our suite of tools designed to support your mental health journey
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Zoom in={featuresVisible} style={{ transitionDelay: `${index * 100}ms` }}>
                  <GlassCard>
                    <CardContent sx={{ p: 4 }}>
                      <FeatureIcon className="card-icon">
                        {feature.icon}
                      </FeatureIcon>

                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        {feature.title}
                      </Typography>

                      <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box ref={teamRef} sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="overline" sx={{
              color: "#d8b4fe",
              letterSpacing: "3px",
              fontWeight: 600,
              mb: 2,
              display: "block"
            }}>
              OUR TEAM
            </Typography>

            <GlowingText variant="h2" sx={{ mb: 2 }}>
              Meet the Creators
            </GlowingText>

            <Typography variant="h6" sx={{
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "700px",
              mx: "auto"
            }}>
              The talented individuals behind MindWellness
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in={teamVisible} style={{ transformOrigin: "center bottom", transitionDelay: `${index * 200}ms` }}>
                  <TeamMemberCard>
                    <TeamMemberAvatar>
                      {member.name.charAt(0)}
                    </TeamMemberAvatar>

                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {member.name}
                    </Typography>

                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}>
                      {member.role}
                    </Typography>

                    <Box>
                      <SocialIconButton size="small">
                        <GitHub fontSize="small" />
                      </SocialIconButton>
                      <SocialIconButton size="small">
                        <LinkedIn fontSize="small" />
                      </SocialIconButton>
                      <SocialIconButton size="small">
                        <Twitter fontSize="small" />
                      </SocialIconButton>
                    </Box>
                  </TeamMemberCard>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{
        py: 4,
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        zIndex: 1
      }}>
        <Container>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
            © {new Date().getFullYear()} MindWellness. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "rgba(255, 255, 255, 0.4)" }}>
            Developed by Manvitha, Isha, and Monish as a Major Project
          </Typography>
        </Container>
      </Box>
    </BackgroundBox>
  );
};

export default IntroPage;
