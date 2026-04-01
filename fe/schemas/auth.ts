import z from "zod";

export const signUpSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(30),
    confirmPassword: z.string().min(8).max(30),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password does not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(30),
  access_token_exp: z.string(),
  refresh_token_exp: z.string()
});
