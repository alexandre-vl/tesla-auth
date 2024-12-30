import express from 'express';
import teslaAuthRoutes from './routes/tesla-auth.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', teslaAuthRoutes);

app.listen(port, () => {
  console.log(`Tesla Auth API is running on port ${port}`);
}); 