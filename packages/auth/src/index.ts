import prisma from "@operahh/db";
import { env } from "@operahh/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const isProduction = env.NODE_ENV === "production";
const cookieDomain = env.BETTER_AUTH_COOKIE_DOMAIN;
const baseCookieAttributes = {
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  secure: isProduction,
  httpOnly: true,
};
const sessionTokenAttributes = {
  ...baseCookieAttributes,
  path: "/",
  ...(isProduction && cookieDomain ? { domain: cookieDomain } : {}),
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN, env.BETTER_AUTH_URL],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    ...(isProduction && cookieDomain
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: cookieDomain,
          },
        }
      : {}),
    cookies: {
      session_token: {
        attributes: sessionTokenAttributes,
      },
    },
    defaultCookieAttributes: baseCookieAttributes,
  },
  plugins: [],
});
