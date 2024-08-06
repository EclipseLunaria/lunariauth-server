import { hash, compare } from "bcrypt";
import { AppDataSource } from "./data-source";

const encryptPassword = async (password: string) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

const validatePassword = async (password: string, hashedPassword: string) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const getUsers = async () => {
  // get users logic here
  return AppDataSource.manager.getRepository("User").find();
};

export { encryptPassword, validatePassword, getUsers };
