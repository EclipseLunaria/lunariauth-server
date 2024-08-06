import { AppDataSource } from "./data-source";
import express from "express";
import routes from "./routes";
import cors from "cors";
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    const PORT = process.env.SERVICE_PORT || 6700;
    console.log("starting express server"); // this will be logged before the server starts
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(routes);

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
