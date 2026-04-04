import { healthStatus } from '../services/healthService.js';

export function getHealth(req, res) {
  const payload = healthStatus();
  res.json(payload);
}
