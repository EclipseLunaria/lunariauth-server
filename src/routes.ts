import { Router } from "express";
import { handleLogin, registerUser, verifyToken } from "./services";
const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Authentication Service Online" });
});

routes.post("/login", async (req, res) => {
  const loginForm: {username, password} = req.body;
  console.log(loginForm);
  const loginResponse = await handleLogin(loginForm);
  if (loginResponse.error) {
    return res.status(400).json({ error: loginResponse.error });
  }
  return res.json(loginResponse);
});

routes.post("/register", async (req, res) => {
  const registrationForm = req.body;
  const registrationResponse = await registerUser(registrationForm);
  console.log(registrationResponse);
  if (!registrationResponse.success) {
    return res.status(409).json({ error: registrationResponse.error });
  }
  return res.json({ message: "Registration successful" });
});

routes.post("/auth", async (req, res) => {
  const token = req.headers.authorization;
  return res.json(await verifyToken(token));
});

export default routes;
