import { createHash } from 'crypto';
import axios from 'axios';
import { TESLA_CONFIG } from '../config/tesla.config';
import { AuthChallenge, TeslaAuthResponse, ApiResponse } from '../types/tesla.types';

export class TeslaAuthService {
  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    
    return Array.from(randomBytes)
      .map(byte => charset[byte % charset.length])
      .join('');
  }

  public generateChallenge(): AuthChallenge {
    const codeVerifier = this.generateRandomString(TESLA_CONFIG.CODE_VERIFIER_LENGTH);
    const hash = createHash('sha256').update(codeVerifier).digest('base64');
    const codeChallenge = hash
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const state = Buffer.from(this.generateRandomString(12))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return {
      code_verifier: codeVerifier,
      code_challenge: codeChallenge,
      state
    };
  }

  public generateAuthUrl(codeChallenge: string, state: string): string {
    const params = new URLSearchParams({
      audience: '',
      client_id: 'ownerapi',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      locale: 'en-US',
      prompt: 'login',
      redirect_uri: TESLA_CONFIG.REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email offline_access',
      state
    });

    return `${TESLA_CONFIG.OAUTH2_BASE_URL}/authorize?${params.toString()}`;
  }

  public async login(webUrl: string, codeVerifier: string): Promise<ApiResponse<TeslaAuthResponse>> {
    try {
      const url = new URL(webUrl);
      const code = url.searchParams.get('code');

      if (!code) {
        return { success: false, message: 'Something is wrong ... Code does not exist' };
      }

      const response = await axios.post(
        `${TESLA_CONFIG.OAUTH2_BASE_URL}/token`,
        {
          grant_type: 'authorization_code',
          client_id: 'ownerapi',
          code,
          code_verifier: codeVerifier,
          redirect_uri: TESLA_CONFIG.REDIRECT_URI
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': TESLA_CONFIG.USER_AGENT
          }
        }
      );

      const tokens: TeslaAuthResponse = {
        ...response.data,
        created_at: Math.floor(Date.now() / 1000)
      };

      return { success: true, message: tokens };
    } catch (error) {
      return { 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      };
    }
  }

  public async refreshToken(refreshToken: string): Promise<ApiResponse<TeslaAuthResponse>> {
    try {
      const response = await axios.post(
        `${TESLA_CONFIG.OAUTH2_BASE_URL}/token`,
        {
          grant_type: 'refresh_token',
          client_id: 'ownerapi',
          refresh_token: refreshToken,
          scope: 'openid email offline_access'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const tokens: TeslaAuthResponse = {
        ...response.data,
        created_at: Math.floor(Date.now() / 1000)
      };

      return { success: true, message: tokens };
    } catch (error) {
      return { 
        success: false, 
        message: `Error refreshing token: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      };
    }
  }
} 