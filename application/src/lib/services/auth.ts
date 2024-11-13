import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterFormData } from "@/lib/types/auth";
import jwt from "jsonwebtoken";

export async function checkUserExists(email: string) {
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });
  return existingUser;
}

export async function registerUser(data: RegisterFormData) {
  try {
    //Needed for JWT signing
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    //Return token valid for a week
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    return { success: true, user, token };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    //Same check for register
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return { success: false, message: "Server configuration error" };
    }

    //Find user and their password hash
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      select: {
        id: true, //Need for token
        email: true, //Need for token
        password: true,
      },
    });

    //Check password match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Invalid credentials" };
    }

    //Tracklast logged in
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    //New token
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword, token };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, message: "Authentication failed" };
  }
}
