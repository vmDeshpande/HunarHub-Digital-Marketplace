import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/mongoose';
import User from '@/lib/db/models/user.model';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectToDatabase();

        const user = await User.findOne({ 
          email: credentials.email.toString().toLowerCase() 
        }).select('+password');

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (user.status === 'suspended') {
          throw new Error('Your account has been suspended');
        }

        const isPasswordValid = await user.comparePassword(
          credentials.password.toString()
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectToDatabase();

        // Check if user exists
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user for Google sign-in
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId,
            emailVerified: new Date(),
            role: 'customer',
            status: 'active',
          });
        } else if (!existingUser.googleId) {
          // Link Google account to existing user
          existingUser.googleId = account.providerAccountId;
          existingUser.emailVerified = new Date();
          if (!existingUser.image && user.image) {
            existingUser.image = user.image;
          }
          await existingUser.save();
        }

        if (existingUser.status === 'suspended') {
          return false; // Prevent sign-in for suspended users
        }

        // Update user object with role from database
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
      }

      return true;
    },
  },
  events: {
    async signIn({ user }) {
      // You can add logging or analytics here
      console.log(`User signed in: ${user.email}`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
