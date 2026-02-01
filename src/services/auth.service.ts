import crypto from 'node:crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import config from '@/config/config';
import { prisma } from '@/config/prisma';
import type {
  RefreshTokenResult,
  RegisterUserInput,
  TokenPair,
  TokenPayload,
  TokenUser,
} from '@/types/auth.types';
import { AppError } from '@/utils/AppError';
import { generateAvatarUrl } from '@/utils/avatarGenerator';
import { generateUniqueUsername } from '@/utils/index';

/**
 * Generate JWT access token (short-lived, 5-15 min)
 * Access tokens are JWTs containing user info for stateless authentication
 */
export const generateAccessToken = (user: TokenUser): string => {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, config.secrets.jwtAccessSecret, {
    expiresIn: config.secrets.jwtAccessExpiration,
  } as jwt.SignOptions);
};

/**
 * Generate opaque refresh token (long-lived, 7-30 days)
 * Refresh tokens are random strings stored in DB for security
 */
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Hash refresh token before storing in database
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Store refresh token in database
 */
export const storeRefreshToken = async (userId: number, token: string) => {
  const hashedToken = hashToken(token);
  const expiresAt = new Date();

  // Parse expiration string (e.g., '7d', '30d')
  const expMatch = config.secrets.jwtRefreshExpiration.match(/^(\d+)([dhms])$/);
  if (expMatch?.[1]) {
    const value = Number.parseInt(expMatch[1], 10);
    const unit = expMatch[2];

    switch (unit) {
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
    }
  }

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt,
    },
  });

  return token; // Return unhashed token to send to client
};

/**
 * Verify and retrieve refresh token from database
 */
export const verifyRefreshToken = async (token: string) => {
  const hashedToken = hashToken(token);

  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  if (!refreshToken) {
    throw AppError.unauthorized('Invalid refresh token');
  }

  if (refreshToken.revoked) {
    // SECURITY: Token reuse detected - revoke all user tokens
    await revokeAllUserTokens(refreshToken.userId);
    throw AppError.unauthorized('Token reuse detected. All sessions revoked.');
  }

  if (refreshToken.expiresAt < new Date()) {
    throw AppError.unauthorized('Refresh token expired');
  }

  return refreshToken;
};

/**
 * Revoke (mark as used) a refresh token
 */
export const revokeRefreshToken = async (token: string) => {
  const hashedToken = hashToken(token);

  await prisma.refreshToken.update({
    where: { token: hashedToken },
    data: { revoked: true },
  });
};

/**
 * Revoke all refresh tokens for a user (force logout from all devices)
 */
export const revokeAllUserTokens = async (userId: number) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};

/**
 * Clean up expired tokens (can be run as a cron job)
 */
export const cleanupExpiredTokens = async () => {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
};

/**
 * Register new user
 */
export const registerUser = async (data: RegisterUserInput) => {
  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw AppError.conflict('Email already registered');
  }

  // Generate unique username from name (not email)
  const username = await generateUniqueUsername(data.name);

  // Generate avatar URL from name
  const avatar = generateAvatarUrl(data.name);

  // Hash password
  const hashedPassword = await argon2.hash(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username,
      name: data.name,
      password: hashedPassword,
      avatar,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Generate token pair (access + refresh)
 */
export const generateTokenPair = async (user: TokenUser): Promise<TokenPair> => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

/**
 * Refresh token rotation - issue new tokens and revoke old one
 */
export const rotateRefreshToken = async (oldToken: string): Promise<RefreshTokenResult> => {
  // Verify old token
  const tokenRecord = await verifyRefreshToken(oldToken);

  // Revoke old token
  await revokeRefreshToken(oldToken);

  // Generate new token pair
  const user: TokenUser = {
    id: tokenRecord.user.id,
    email: tokenRecord.user.email,
    username: tokenRecord.user.username,
  };

  const tokens = await generateTokenPair(user);

  return { tokens, user };
};
