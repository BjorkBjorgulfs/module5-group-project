import { NextResponse as res } from "next/server";
import { connectToDatabase } from "@/utils/mongoose-connector";
import { User, UserType } from "@/models/user";
import bcrypt from "bcrypt";

interface Success {
  message: string;
}

type RequestWithBody = Request & {
  body: UserType;
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Creates a new user
 *     responses:
 *      200:
 *       description: User created successfully
 *      400:
 *       description: Bad request - Invalid user data
 *   get:
 *     description: Returns all users
 *     responses:
 *       200:
 *         description: Successfully returned all users
 *       404:
 *         description: No users found
 */


export const POST = async (req:Request) => {
  await connectToDatabase();
  const body = await req.json()
  console.log("this is body",body);
  // TODO: Add logic to create a user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);
  body.password = hashedPassword;
  User.create(body);
  return res.json({ message: "User created successfully" }, { status: 200 });
}

export const GET = async () => {
  const users = await User.find();
  if (users === null) {
    return res.json({ message: "User not found" }, { status: 404 });
  }
  return res.json(users, { status: 200 });
}