import bcrypt from "bcryptjs";
import { Secret, SignOptions, sign } from "jsonwebtoken";
import { appEnv } from "../../config/env";
import { ApiError } from "../../middleware/errorHandler";
import { userService } from "../users/user.service";

const SALT_ROUNDS = 10;

const toPayload = (user: { id: string; email: string; fullName: string; role: string }) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  role: user.role,
});

const signToken = (payload: ReturnType<typeof toPayload>) =>
  sign(
    payload,
    appEnv.jwtSecret as Secret,
    { expiresIn: appEnv.jwtExpiresIn } as SignOptions,
  );

export const authService = {
  register: async (params: { email: string; password: string; fullName: string }) => {
    const existing = await userService.findByEmail(params.email);
    if (existing) {
      throw new ApiError(409, "Email already in use");
    }

    const passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);
    const user = await userService.create({
      email: params.email,
      passwordHash,
      fullName: params.fullName,
    });

    const token = signToken(toPayload(user));
    return { token, user: toPayload(user) };
  },

  login: async (params: { email: string; password: string }) => {
    const user = await userService.findByEmail(params.email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(params.password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken(toPayload(user));
    return { token, user: toPayload(user) };
  },
};

