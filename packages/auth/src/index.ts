import prisma from "@operahh/db";
import { env } from "@operahh/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const isProduction = env.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CORS_ORIGIN, env.BETTER_AUTH_URL],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: env.BETTER_AUTH_COOKIE_DOMAIN,
    },
    cookies: {
      session_token: {
        attributes: {
          domain: env.BETTER_AUTH_COOKIE_DOMAIN,
          path: "/",
          sameSite: isProduction ? "none" : "lax",
          secure: isProduction,
          httpOnly: true,
        },
      },
    },
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
    },
  },
  plugins: [],
});
