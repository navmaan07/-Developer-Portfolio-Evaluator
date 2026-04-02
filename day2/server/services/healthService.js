export function healthStatus() {
  return {
    status: 'ok',
    day: 2,
    timestamp: new Date().toISOString(),
  };
}
