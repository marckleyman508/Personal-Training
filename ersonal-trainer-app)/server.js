const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===== ELITE PERFORMANCE LAB DATABASE =====
// In-memory database for elite performance management
let clients = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 28,
    gender: 'M',
    height: 180, // cm
    targetWeight: 80, // kg
    athleteProfile: {
      sport: 'mixed',
      competitiveLevel: 'elite-amateur',
      injuryHistory: [],
      limitationNotes: ''
    },
    performanceLab: {
      clientSince: '2024-01-15',
      status: 'active',
      privacyLevel: 'elite'
    },
    trainingLogs: [],
    nutritionLogs: [],
    bodyMetrics: [],
    psychologicalState: [],
    recoveryLogs: [],
    performanceTrends: {}
  }
];

let trainingLogs = [];
let nutritionLogs = [];
let bodyMetrics = [];
let psychologicalStateLogs = [];
let recoveryLogs = [];
let performanceAnalytics = {};

// ===== CLIENT ENDPOINTS =====

// Get all clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// Get single client
app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client);
});

// Create new client
app.post('/api/clients', (req, res) => {
  const { name, email, age, gender, height, targetWeight, sport, athleteProfile } = req.body;
  
  if (!name || !email || !age) {
    return res.status(400).json({ error: 'Name, email, and age are required' });
  }
  
  const newClient = {
    id: uuidv4(),
    name,
    email,
    age,
    gender: gender || '',
    height: height || 0,
    targetWeight: targetWeight || 0,
    sport: sport || 'general',
    athleteProfile: athleteProfile || {
      sport: sport || 'general',
      targetWeight: targetWeight || 0
    },
    trainingLogs: [],
    nutritionLogs: [],
    bodyMetrics: [],
    psychologicalState: [],
    recoveryLogs: []
  };
  
  clients.push(newClient);
  res.status(201).json(newClient);
});

// Update client
app.put('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  Object.assign(client, req.body);
  res.json(client);
});

// Delete client
// ===== PERFORMANCE LAB ANALYTICS ENGINE =====

// Calculate BMI with athlete-specific context
function calculateBMIAnalysis(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client || !client.bodyMetrics.length) return null;
  
  const latestMetric = client.bodyMetrics[client.bodyMetrics.length - 1];
  const bmi = latestMetric.weight / ((client.height / 100) ** 2);
  const athleteProfile = client.athleteProfile;
  
  let assessment = '';
  let recommendation = '';
  
  // Athlete-specific BMI interpretation
  if (athleteProfile.sport === 'weightlifting' || athleteProfile.sport === 'rugby') {
    if (bmi < 22) assessment = 'Below optimal for strength athletes';
    else if (bmi <= 28) assessment = 'Optimal range for your sport';
    else assessment = 'Above typical range - monitor body composition';
  } else if (athleteProfile.sport === 'endurance' || athleteProfile.sport === 'distance-running') {
    if (bmi < 19) assessment = 'Optimal for endurance performance';
    else if (bmi <= 22) assessment = 'Good endurance range';
    else assessment = 'Consider composition analysis for your sport';
  } else {
    if (bmi < 18.5) assessment = 'Underweight';
    else if (bmi <= 24.9) assessment = 'Optimal weight range';
    else assessment = 'Above target - monitor composition';
  }
  
  return {
    bmi: parseFloat(bmi.toFixed(1)),
    weight: latestMetric.weight,
    assessment,
    timestamp: latestMetric.timestamp,
    trendDays: 30
  };
}

// Analyze psychological state impact on performance
function analyzePsychologicalTrend(clientId, daysBack = 14) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return null;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  
  const recentLogs = client.psychologicalState.filter(log => 
    new Date(log.timestamp) >= cutoffDate
  );
  
  if (!recentLogs.length) return null;
  
  const avgMood = (recentLogs.reduce((sum, log) => sum + log.mood, 0) / recentLogs.length).toFixed(1);
  const avgStress = (recentLogs.reduce((sum, log) => sum + log.stress, 0) / recentLogs.length).toFixed(1);
  const avgSleep = (recentLogs.reduce((sum, log) => sum + log.sleepHours, 0) / recentLogs.length).toFixed(1);
  
  let recommendation = '';
  if (avgStress > 7 || avgSleep < 6) {
    recommendation = 'Elevated stress and/or insufficient sleep detected. Recovery priority: increase sleep, reduce training volume, implement breathing protocols.';
  } else if (avgMood < 5) {
    recommendation = 'Low motivation trend. Consider shorter, higher-intensity sessions or complete rest day to restore nervous-system balance.';
  } else {
    recommendation = 'Psychological state optimal. Ready for intensity increases or competition preparation.';
  }
  
  return {
    periodDays: daysBack,
    avgMood: parseFloat(avgMood),
    avgStress: parseFloat(avgStress),
    avgSleep: parseFloat(avgSleep),
    recommendation,
    logCount: recentLogs.length
  };
}

// Analyze training-recovery correlation
function analyzeRecoveryCorrelations(clientId, daysBack = 30) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return null;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  
  const recentTraining = client.trainingLogs.filter(log => 
    new Date(log.timestamp) >= cutoffDate
  );
  const recentRecovery = client.recoveryLogs.filter(log => 
    new Date(log.timestamp) >= cutoffDate
  );
  
  if (!recentTraining.length || !recentRecovery.length) return null;
  
  // Correlate high-intensity days with recovery metrics
  let highIntensityCount = recentTraining.filter(t => t.intensity === 'high' || t.intensity === 'very-high').length;
  let avgRecoveryScore = (recentRecovery.reduce((sum, log) => sum + log.readinessScore, 0) / recentRecovery.length).toFixed(1);
  
  let insight = '';
  if (highIntensityCount > 6 && avgRecoveryScore < 6) {
    insight = 'High training frequency with compromised recovery. Recommend: increase sleep 1-2 hours, add mobility work, reduce next week intensity by 20%.';
  } else if (highIntensityCount <= 2 && avgRecoveryScore > 7) {
    insight = 'Excellent recovery. Capacity exists to increase training stimulus.';
  } else {
    insight = 'Recovery-training balance is appropriate. Maintain current structure.';
  }
  
  return {
    periodDays: daysBack,
    highIntensitySessions: highIntensityCount,
    avgRecoveryScore: parseFloat(avgRecoveryScore),
    insight,
    sessionsAnalyzed: recentTraining.length
  };
}

// Generate integrated performance report
function generatePerformanceReport(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return null;
  
  const bmiAnalysis = calculateBMIAnalysis(clientId);
  const psychTrend = analyzePsychologicalTrend(clientId);
  const recoveryAnalysis = analyzeRecoveryCorrelations(clientId);
  
  let report = {
    clientId,
    generatedAt: new Date().toISOString(),
    clientName: client.name,
    status: client.performanceLab.status,
    sections: {}
  };
  
  if (bmiAnalysis) {
    report.sections.bodyComposition = {
      title: 'Body Composition & Weight Management',
      bmi: bmiAnalysis.bmi,
      currentWeight: bmiAnalysis.weight,
      targetWeight: client.targetWeight,
      assessment: bmiAnalysis.assessment,
      note: 'Athlete-specific interpretation applied based on your sport profile.'
    };
  }
  
  if (psychTrend) {
    report.sections.psychologicalState = {
      title: 'Psychological State & Recovery Readiness',
      avgMood: psychTrend.avgMood,
      avgStress: psychTrend.avgStress,
      avgSleep: psychTrend.avgSleep,
      recommendation: psychTrend.recommendation
    };
  }
  
  if (recoveryAnalysis) {
    report.sections.recoveryAnalysis = {
      title: 'Training-Recovery Integration',
      highIntensitySessions: recoveryAnalysis.highIntensitySessions,
      avgRecoveryScore: recoveryAnalysis.avgRecoveryScore,
      insight: recoveryAnalysis.insight
    };
  }
  
  return report;
}

// ===== CLIENT ENDPOINTS =====

app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client);
});

// Create elite performance client
app.post('/api/clients', (req, res) => {
  const { name, email, age, gender, height, targetWeight, athleteProfile } = req.body;
  
  const newClient = {
    id: uuidv4(),
    name,
    email,
    age,
    gender,
    height,
    targetWeight,
    athleteProfile: athleteProfile || {
      sport: 'mixed',
      competitiveLevel: 'amateur',
      injuryHistory: [],
      limitationNotes: ''
    },
    performanceLab: {
      clientSince: new Date().toISOString().split('T')[0],
      status: 'active',
      privacyLevel: 'elite'
    },
    trainingLogs: [],
    nutritionLogs: [],
    bodyMetrics: [],
    psychologicalState: [],
    recoveryLogs: [],
    performanceTrends: {}
  };
  
  clients.push(newClient);
  res.status(201).json(newClient);
});

app.delete('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const deleted = clients.splice(index, 1);
  res.json(deleted[0]);
});

// ===== TRAINING LOG ENDPOINTS =====

// Get all training logs for client
app.get('/api/clients/:id/training-logs', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client.trainingLogs);
});

// Log training session with complete context
app.post('/api/clients/:id/training-logs', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const {
    date,
    trainingType, // strength, conditioning, mobility, skill, endurance, mixed
    intensity, // low, moderate, high, very-high
    duration, // minutes
    exercises, // array of {name, sets, reps/duration, notes}
    preTrainingMood,
    preTrainingStress,
    postTrainingMood,
    postTrainingMusclesoreness,
    postTrainingEnergy,
    notes,
    personalContext // notes about life situation, stress outside training
  } = req.body;
  
  const trainingLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    date,
    trainingType,
    intensity,
    duration,
    exercises,
    preTrainingMood,
    preTrainingStress,
    postTrainingMood,
    postTrainingMusclesoreness: postTrainingMusclesoreness,
    postTrainingEnergy,
    notes,
    personalContext,
    psychologicalContext: {
      description: `Pre-session mood: ${preTrainingMood}/10, stress: ${preTrainingStress}/10. Post-session mood: ${postTrainingMood}/10, energy: ${postTrainingEnergy}/10`
    }
  };
  
  client.trainingLogs.push(trainingLog);
  trainingLogs.push(trainingLog);
  res.status(201).json(trainingLog);
});

app.delete('/api/clients/:id/training-logs/:logId', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const index = client.trainingLogs.findIndex(log => log.id === req.params.logId);
  if (index === -1) {
    return res.status(404).json({ error: 'Training log not found' });
  }
  
  const deleted = client.trainingLogs.splice(index, 1);
  res.json(deleted[0]);
});

// ===== NUTRITION LOG ENDPOINTS =====

// Get nutrition logs for client
app.get('/api/clients/:id/nutrition-logs', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client.nutritionLogs);
});

// Log nutrition with physiological & psychological context
app.post('/api/clients/:id/nutrition-logs', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const {
    date,
    mealTime, // breakfast, lunch, dinner, snack, pre-workout, post-workout
    foods, // array with calories, macros, quality notes
    totalCalories,
    macros, // {protein, carbs, fat, fiber}
    hydration, // liters consumed
    timing, // hours from training, hours from sleep
    appetite,
    cravings,
    digestiveNotes,
    moodAfterMeal,
    notes,
    psychologicalContext // stress eating, performance fueling, etc
  } = req.body;
  
  const nutritionLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    date,
    mealTime,
    foods,
    totalCalories,
    macros,
    hydration,
    timing,
    appetite,
    cravings,
    digestiveNotes,
    moodAfterMeal,
    notes,
    psychologicalContext,
    analysis: `Meal timing: ${timing}. Quality: nutrient-dense fueling. Psychological drivers: ${psychologicalContext || 'performance optimization'}`
  };
  
  client.nutritionLogs.push(nutritionLog);
  nutritionLogs.push(nutritionLog);
  res.status(201).json(nutritionLog);
});

app.delete('/api/clients/:id/nutrition-logs/:logId', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const index = client.nutritionLogs.findIndex(log => log.id === req.params.logId);
  if (index === -1) {
    return res.status(404).json({ error: 'Nutrition log not found' });
  }
  
  const deleted = client.nutritionLogs.splice(index, 1);
  res.json(deleted[0]);
});

// ===== BODY METRICS ENDPOINTS =====

// Get body metrics for client
app.get('/api/clients/:id/body-metrics', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client.bodyMetrics);
});

// Log body metrics with trend context
app.post('/api/clients/:id/body-metrics', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const {
    date,
    weight, // kg
    bodyFatPercentage,
    measurements, // {chest, waist, arms, thighs, etc}
    notes
  } = req.body;
  
  const metric = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    date,
    weight,
    bodyFatPercentage,
    measurements,
    notes
  };
  
  client.bodyMetrics.push(metric);
  bodyMetrics.push(metric);
  res.status(201).json(metric);
});

app.delete('/api/clients/:id/body-metrics/:metricId', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const index = client.bodyMetrics.findIndex(m => m.id === req.params.metricId);
  if (index === -1) {
    return res.status(404).json({ error: 'Body metric not found' });
  }
  
  const deleted = client.bodyMetrics.splice(index, 1);
  res.json(deleted[0]);
});

// ===== PSYCHOLOGICAL STATE ENDPOINTS =====

// Get psychological state logs
app.get('/api/clients/:id/psychological-state', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client.psychologicalState);
});

// Log psychological state with full context
app.post('/api/clients/:id/psychological-state', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const {
    date,
    mood, // 1-10 scale
    stress, // 1-10 scale
    motivation, // 1-10 scale
    sleepHours,
    sleepQuality,
    nervousSystemState, // sympathetic-dominant, parasympathetic-dominant, balanced
    personalContext, // work stress, relationships, life events
    anxietyLevel,
    recoveryPerception,
    notes
  } = req.body;
  
  const psychLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    date,
    mood,
    stress,
    motivation,
    sleepHours,
    sleepQuality,
    nervousSystemState,
    personalContext,
    anxietyLevel,
    recoveryPerception,
    notes,
    contextSummary: `Mood: ${mood}/10 | Stress: ${stress}/10 | Sleep: ${sleepHours}h (${sleepQuality}) | Nervous system: ${nervousSystemState}`
  };
  
  client.psychologicalState.push(psychLog);
  psychologicalStateLogs.push(psychLog);
  res.status(201).json(psychLog);
});

app.delete('/api/clients/:id/psychological-state/:logId', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const index = client.psychologicalState.findIndex(log => log.id === req.params.logId);
  if (index === -1) {
    return res.status(404).json({ error: 'Psychological log not found' });
  }
  
  const deleted = client.psychologicalState.splice(index, 1);
  res.json(deleted[0]);
});

// ===== RECOVERY ENDPOINTS =====

// Get recovery logs
app.get('/api/clients/:id/recovery-logs', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(client.recoveryLogs);
});

// Log recovery metrics
app.post('/api/clients/:id/recovery-logs', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const {
    date,
    readinessScore, // 1-10
    sleepDuration,
    sleepQuality,
    soreness, // 1-10
    injuryNotes,
    recoveryMethods, // stretching, massage, ice bath, sauna, etc
    nutrition,
    hydration,
    notes
  } = req.body;
  
  const recoveryLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    date,
    readinessScore,
    sleepDuration,
    sleepQuality,
    soreness,
    injuryNotes,
    recoveryMethods,
    nutrition,
    hydration,
    notes
  };
  
  client.recoveryLogs.push(recoveryLog);
  recoveryLogs.push(recoveryLog);
  res.status(201).json(recoveryLog);
});

app.delete('/api/clients/:id/recovery-logs/:logId', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const index = client.recoveryLogs.findIndex(log => log.id === req.params.logId);
  if (index === -1) {
    return res.status(404).json({ error: 'Recovery log not found' });
  }
  
  const deleted = client.recoveryLogs.splice(index, 1);
  res.json(deleted[0]);
});

// ===== ANALYTICS & INSIGHTS ENDPOINTS =====

// Get comprehensive performance report
app.get('/api/clients/:id/performance-report', (req, res) => {
  const report = generatePerformanceReport(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.json(report);
});

// Get BMI analysis with athlete context
app.get('/api/clients/:id/bmi-analysis', (req, res) => {
  const analysis = calculateBMIAnalysis(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: 'No metrics available' });
  }
  res.json(analysis);
});

// Get psychological trends
app.get('/api/clients/:id/psychological-trends', (req, res) => {
  const daysBack = req.query.daysBack || 14;
  const trends = analyzePsychologicalTrend(req.params.id, parseInt(daysBack));
  if (!trends) {
    return res.status(404).json({ error: 'Insufficient data' });
  }
  res.json(trends);
});

// Get recovery-training correlation
app.get('/api/clients/:id/recovery-analysis', (req, res) => {
  const daysBack = req.query.daysBack || 30;
  const analysis = analyzeRecoveryCorrelations(req.params.id, parseInt(daysBack));
  if (!analysis) {
    return res.status(404).json({ error: 'Insufficient data' });
  }
  res.json(analysis);
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✦ Kleyman Performance Institute - Private Performance Platform ✦`);
  console.log(`Running at http://localhost:${PORT}`);
  console.log(`\nCapabilities:`);
  console.log(`  • Integrated training, nutrition, body metrics tracking`);
  console.log(`  • Psychological state & nervous system monitoring`);
  console.log(`  • Recovery-training correlation analysis`);
  console.log(`  • Athlete-specific performance insights`);
  console.log(`  • Holistic trend analysis & recommendations`);
  console.log(`\nReady to optimize elite human performance.\n`);
});
