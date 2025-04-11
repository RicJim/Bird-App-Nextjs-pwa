import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Ingresa un email valido." }).trim(),
  password: z.string().min(1, { message: "Ingrese la contraseña." }).trim(),
});

export const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: "Ingresa un email valido." }).trim(),
    password: z
      .string()
      .min(1, { message: "No puede estar vacio" })
      .min(5, { message: "Debe ser mayor a 5 caracteres" })
      .regex(/[a-zA-Z]/, { message: "Debe contener por lo menos una letra" })
      .regex(/[0-9]/, { message: "Debe contener por lo menos un numero." })
      .regex(/[^a-zA-Z]/, {
        message: "Debe contener por lo menos un caracter especial.",
      })
      .trim(),
    confirmPass: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPass) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las constraseñas no coinciden",
        path: ["confirmPass"],
      });
    }
  });
