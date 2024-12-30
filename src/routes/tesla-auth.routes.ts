import { Router } from 'express';
import { TeslaAuthService } from '../services/tesla-auth.service';

const router = Router();
const teslaAuthService = new TeslaAuthService();

router.get('/auth/url', (req, res) => {

  const challenge = teslaAuthService.generateChallenge();
  const authUrl = teslaAuthService.generateAuthUrl(
    challenge.code_challenge,
    challenge.state
  );
  
  res.json({ 
    success: true, 
    url: authUrl,
    ...challenge
  });
});

router.post('/auth/login', async (req, res) => {
  const { webUrl, codeVerifier } = req.body;

  if (!webUrl || !codeVerifier) {
    return res.status(400).json({ 
      success: false, 
      message: 'Web URL and code verifier are required' 
    });
  }

  const result = await teslaAuthService.login(webUrl, codeVerifier);
  res.json(result);
});

router.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ 
      success: false, 
      message: 'Refresh token is required' 
    });
  }

  const result = await teslaAuthService.refreshToken(refreshToken);
  res.json(result);
});

export default router; 