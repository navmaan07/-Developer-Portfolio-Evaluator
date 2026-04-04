import healthService from '../services/healthService.js';

const getHealth = (req, res) => {
  const healthData = healthService.getHealthStatus();
  res.json(healthData);
};

export default { getHealth };