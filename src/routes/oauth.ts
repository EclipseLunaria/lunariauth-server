import { Router } from "express";

const oAuthRoutes = Router();

//v used by client to obtain authorization from the user from owner of the resource
oAuthRoutes.get("/auth", (req, res) => {
  return res.json({ message: "Authentication Service Online" });
});

//Token Endpoint: used by client to exchange an authorization grant for an access token
oAuthRoutes.get("/token", (req, res) => {
  return res.json({ message: "Google OAuth Service Online" });
});

export default oAuthRoutes;