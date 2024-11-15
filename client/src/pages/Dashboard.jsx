// src/pages/Dashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Extension as ExtensionIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Dados mockados para exemplo (substitua por dados reais da API)
  const progressData = {
    level: 'Intermediate',
    xp: 2500,
    nextLevelXp: 5000,
    streak: 7,
    completedLessons: 45,
    totalLessons: 100,
    achievements: 12,
  };

  const nextLessons = [
    { id: 1, title: 'Past Perfect Tense', difficulty: 'Intermediate', duration: '20 min' },
    { id: 2, title: 'Business Vocabulary', difficulty: 'Advanced', duration: '25 min' },
    { id: 3, title: 'Common Idioms', difficulty: 'Intermediate', duration: '15 min' },
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Study 7 days in a row', icon: <TimerIcon /> },
    { id: 2, title: 'Perfect Score', description: 'Get 100% in a lesson', icon: <StarIcon /> },
    { id: 3, title: 'Quick Learner', description: 'Complete 5 lessons in a day', icon: <SchoolIcon /> },
  ];

  return (
    <Box className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="mb-2">
          Welcome back, {user?.name || 'Student'}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Continue your learning journey
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Progress Overview */}
        <Grid item xs={12} md={8}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Your Progress
            </Typography>
            <Grid container spacing={3}>
              {/* Level Progress */}
              <Grid item xs={12}>
                <Box className="mb-4">
                  <Box className="flex justify-between mb-1">
                    <Typography variant="body2">Level Progress</Typography>
                    <Typography variant="body2">
                      {progressData.xp}/{progressData.nextLevelXp} XP
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(progressData.xp / progressData.nextLevelXp) * 100} 
                    className="h-2 rounded"
                  />
                </Box>
              </Grid>

              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent className="text-center">
                    <SchoolIcon color="primary" className="text-4xl mb-2" />
                    <Typography variant="h6">{progressData.level}</Typography>
                    <Typography variant="body2" color="textSecondary">Current Level</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent className="text-center">
                    <TimerIcon color="primary" className="text-4xl mb-2" />
                    <Typography variant="h6">{progressData.streak} Days</Typography>
                    <Typography variant="body2" color="textSecondary">Current Streak</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent className="text-center">
                    <TrophyIcon color="primary" className="text-4xl mb-2" />
                    <Typography variant="h6">{progressData.achievements}</Typography>
                    <Typography variant="body2" color="textSecondary">Achievements</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Next Lessons */}
        <Grid item xs={12} md={4}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Next Lessons
            </Typography>
            <List>
              {nextLessons.map((lesson) => (
                <React.Fragment key={lesson.id}>
                  <ListItem 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ExtensionIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={lesson.title}
                      secondary={`${lesson.difficulty} • ${lesson.duration}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4">
              Recent Achievements
            </Typography>
            <Grid container spacing={3}>
              {achievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card>
                    <CardContent className="flex items-center space-x-4">
                      <Box className="p-2 bg-primary-light rounded">
                        {achievement.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1">{achievement.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;