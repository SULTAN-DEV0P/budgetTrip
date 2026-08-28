import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧭 BudgetTrip Backend Server is running on port ${PORT}`);
  console.log(`👉 Local:   http://localhost:${PORT}/`);
  console.log(`👉 Health:  http://localhost:${PORT}/health`);
  console.log(`👉 API:     http://localhost:${PORT}/api/destinations`);
});
