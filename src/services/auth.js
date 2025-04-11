import { LoginFormSchema, RegisterFormSchema } from "@/lib/rules";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/clientApp";

// test user: ric@gmail.com password: 1a#567

export async function register(state, formData) {
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPass: formData.get("confirmPass"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { redirect: true };
  } catch (e) {
    console.log(e);

    if (e.code === "auth/email-already-in-use") {
      return {
        errors: { email: "Este correo ya está registrado." },
      };
    }
    return {
      errors: { email: "El correo ya está registrado o ha ocurrido un error." },
    };
  }
}

export async function login(state, formData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    return { success: true };
  } catch (e) {
    console.log(e);
    if (e.code === "auth/invalid-credential") {
      return {
        errors: { email: "Este correo no está registrado." },
      };
    }

    if (e.code === "auth/wrong-password") {
      return {
        errors: { email: "La contraseña es incorrecta." },
      };
    }

    return {
      errors: {
        email: "Ocurrió un error al iniciar sesión. Intente nuevamente.",
      },
    };
  }
}
