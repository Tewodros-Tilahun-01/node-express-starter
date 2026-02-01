import argon2 from 'argon2';
import type { Request } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '@/config/config';
import { prisma } from '@/config/prisma';
import type {
  PassportJwtDone,
  PassportLocalDone,
  TokenPayload,
} from '@/types/auth.types';
import { AppError } from '@/utils/AppError';

/**
 * Local Strategy - for login with username/email and password
 * Allows login with either username OR email
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'identifier', // Can be username or email
      passwordField: 'password',
    },
    async (identifier, password, done: PassportLocalDone) => {
      try {
        // Find user by username or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: identifier }, { email: identifier }],
          },
        });

        if (!user) {
          return done(AppError.unauthorized('Invalid credentials'), false);
        }

        // Verify password
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
          return done(AppError.unauthorized('Invalid credentials'), false);
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

/**
 * JWT Strategy - for protecting routes with access tokens
 * Extracts JWT from cookies (primary) or Authorization header (fallback)
 */
const cookieExtractor = (req: Request): string | null => {
  if (req?.cookies) {
    return req.cookies.accessToken || null;
  }
  return null;
};

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.secrets.jwtAccessSecret,
      passReqToCallback: false,
    },
    async (payload: TokenPayload, done: PassportJwtDone) => {
      try {
        // Minimal DB check - just verify user exists
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
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

        if (!user) {
          return done(AppError.unauthorized('User not found'), false);
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

export default passport;
