/**
 * JWT Token Payload
 * Used for access token generation and verification
 */
export interface TokenPayload {
  sub: number; // user id
  email: string;
  username: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * User data for token generation
 */
export interface TokenUser {
  id: number;
  email: string;
  username: string;
}

/**
 * Token pair response
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Passport Local Strategy done callback
 */
export type PassportLocalDone = (
  error: Error | null,
  user?: Express.User | false,
  options?: { message: string }
) => void;

/**
 * Passport JWT Strategy done callback
 */
export type PassportJwtDone = (error: Error | null, user?: Express.User | false) => void;

/**
 * Register user input
 */
export interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

/**
 * Refresh token rotation result
 */
export interface RefreshTokenResult {
  tokens: TokenPair;
  user: TokenUser;
}
