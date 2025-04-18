// server/config/env.js
const { z } = require('zod');

// 1) Define your expected schema
const envSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be an integer string")
    .transform((val) => Number(val)),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  SERVER_URL: z.string().url(),             // <-- add this
});

// 2) Validate process.env
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment:\n", parsed.error.format());
  process.exit(1);
}

// 3) Export the typed values
module.exports = {
  port: parsed.data.PORT,
  dbUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  serverUrl:  parsed.data.SERVER_URL, 
};
