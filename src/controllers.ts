import { Request, Response } from "express";
import { registerUser } from "./services";

const handleRegistration = async (req: Request, res: Response) => {
  const registrationForm = req.body;
  const registrationResponse = await registerUser(registrationForm);
  if (!registrationResponse.success) {
    return res.status(400).json({ error: registrationResponse.error });
  }
  return res.json({ message: "Registration successful" });
};

const handleLogin = async (req: Request, res: Response) => {
    return res.json({ message: "Login route" });
    };

