
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales requeridas');
        }

        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email,
            isActive: true,
          },
          include: {
            company: true,
          },
        });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error('Contraseña incorrecta');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyId: user.companyId,
          companyName: user.company?.name || null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.companyId = user.companyId;
        token.companyName = user.companyName;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }

      // Check for impersonation will be handled by a server action
      // This callback runs in a different context without access to request cookies
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
        (session.user as any).companyId = token.companyId;
        (session.user as any).companyName = token.companyName;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        session.user.name = token.name || `${token.firstName} ${token.lastName}`;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the user is signing in, redirect based on their role
      if (url.startsWith(`${baseUrl}/auth/signin`) || url === `${baseUrl}/auth/signin`) {
        return baseUrl;
      }
      
      // Allow any URL if it starts with the base URL
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // For relative URLs, return them as is
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
