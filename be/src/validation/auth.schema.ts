import z from "zod";

// const emailSchema = z
//   .string()
//   .email("Email Không đúng định dạng")
//   .refine(
//     async (email) => {
//       const existingUser = await isEmailExist(email);
//       return !existingUser;
//     },
//     {
//       message: "Email đã được sử dụng",
//       path: ["email"],
//     },
//   );

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(30),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password does not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(30),
});
