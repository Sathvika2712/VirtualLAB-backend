import { z } from "zod";

const email = z.string().email();
const password = z.string().min(8);
const fullName = z.string().min(3);

export const registerSchema = z.object({
  body: z.object({
    email,
    password,
    fullName,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
});

