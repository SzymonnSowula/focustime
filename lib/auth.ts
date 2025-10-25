import { headers } from 'next/headers';
import { whopsdk } from './whop-sdk';

/**
 * Verify Whop user token from request headers
 * Returns userId if valid, throws error if invalid
 */
export async function verifyWhopUser(): Promise<string> {
  try {
    const { userId } = await whopsdk.verifyUserToken(await headers());
    
    if (!userId) {
      const error = new Error('Invalid user token');
      (error as any).statusCode = 401;
      throw error;
    }
    
    return userId;
  } catch (error) {
    console.error('Whop authentication error:', error);
    const authError = new Error('Unauthorized');
    (authError as any).statusCode = 401;
    throw authError;
  }
}
