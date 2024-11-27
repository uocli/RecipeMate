// frontend/src/components/About.js
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid2 as Grid, 
  Paper,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Fade,
  IconButton,
} from '@mui/material';
import {
  GitHub,
  Email,
  Restaurant,
  Update,
  Favorite
} from '@mui/icons-material';

const About = () => {
  const teamMembers = [
    {
      name: "Chenyang Li",
      role: "Full Stack Developer",
      image: "https://github.com/uocli.png",
      github: "https://github.com/uocli",
      email: "cli049@uottawa.ca"
    },
    {
      name: "Mingzhao Yu",
      role: "Full Stack Developer",
      image: "https://github.com/ivanivan999.png",
      github: "https://github.com/ivanivan999",
      email: "myu058@uottawa.ca"
    },
    {
      name: "Pouria Bahri",
      role: "Full Stack Developer",
      image: "https://github.com/p0ur1a.png",
      github: "https://github.com/p0ur1a",
      email: "pbahr076@uottawa.ca"
    },
    {
      name: "Xinye Zhu",
      role: "Full Stack Developer",
      image: "https://github.com/Xinye130.png",
      github: "https://github.com/Xinye130",
      email: "xzhu019@uottawa.ca"
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{
          height: { xs: '40vh', md: '60vh' }, // Shorter height on mobile
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          mb: { xs: 4, md: 8 }, // Less margin on mobile
          p: { xs: 2, md: 4 }, // Less padding on mobile
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' } // Responsive font size
            }}
          >
            RecipeMate
          </Typography>
        </Fade>
        <Typography 
          variant="h5" 
          sx={{ 
            maxWidth: '650px', 
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            px: { xs: 2, md: 0 } // Add padding on mobile
          }}
        >
          Transforming the way you cook with AI-powered recipe generation
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Mission
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            bgcolor: 'background.paper',
            transition: '0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}
        >
          <Typography variant="body1" align="center" sx={{ fontSize: '1.2rem' }}>
            To revolutionize home cooking by making it accessible, enjoyable, and sustainable 
            for everyone through AI-powered recipe suggestions and personalized experiences.
          </Typography>
        </Paper>
      </Box>

      {/* Features Grid */}
      <Box sx={{ mb: 9 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Features
        </Typography>
        <Grid container 
          spacing={{ xs: 2, md: 3 }}
          sx={{ width: '100%', mx: 'auto' }}
        >
          {[
            {
              icon: <Restaurant sx={{ fontSize: 40 }}/>,
              title: "AI Recipe Generation",
              desc: "Get your recipes based on your ingredients"
            },
            {
              icon: <Update sx={{ fontSize: 40 }}/>,
              title: "Real-time Updates",
              desc: "Save ingredients from favorites to shopping list"
            },
            {
              icon: <Favorite sx={{ fontSize: 40 }}/>,
              title: "Save Favorites",
              desc: "Build your personal recipe collection"
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index} sx={{ display: 'flex' }} >
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textAlign: 'center',
                  height: '100%'
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Team
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '100%',
                    position: 'relative',
                    bgcolor: 'grey.200'
                  }}
                >
                  <Avatar
                    src={member.image}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 120,
                      height: 120
                    }}
                  />
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">
                    {member.name}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    align="center"
                    gutterBottom
                  >
                    {member.role}
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    justifyContent="center"
                    mt={2}
                  >
                    <IconButton href={member.github} target="_blank">
                      <GitHub />
                    </IconButton>
                    <IconButton href={`mailto:${member.email}`}>
                      <Email />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About;