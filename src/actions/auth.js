"use server";
/*
import { LoginFormSchema, RegisterFormSchema } from "@/lib/rules";
import { getCollection } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/sessions";
import bcrypt from "bcrypt";

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
  const userCollection = await getCollection("users");

  if (!userCollection) {
    return { error: { email: "Server error!" } };
  }
  const existUser = await userCollection.findOne({ email });
  if (existUser) {
    return { error: "El email proporcionado esta registrado" };
  }

  const hashPass = await bcrypt.hash(password, 10);

  const results = await userCollection.insertOne({ email, password: hashPass });

  await createSession(results.insertedId.toString());
  redirect("/");
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

  const userCollection = await getCollection("users");
  if (!userCollection) return { error: { email: "Server error!" } };

  const existUser = await userCollection.findOne({ email });
  if (!existUser) {
    return {
      error: {
        email: "Los datos introducidos no son válidos.",
      },
    };
  }

  const checkPass = await bcrypt.compare(password, existUser.password);

  if (!checkPass) {
    return { errors: { password: "Los datos introducidos no son válidos." } };
  }

  await createSession(existUser._id.toString());
  redirect("/");
}
*/
