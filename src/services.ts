import { AppDataSource } from "./data-source";
import { User, AccessToken } from "./entities";
import { encryptPassword, validatePassword } from "./utils";
interface IRegistration {
  email: string;
  username: string;
  password: string;
}

export const registerUser = async (registrationForm: IRegistration) => {
  const registrationVerification = await verifyRegistration(registrationForm);
  if (!registrationVerification.success) {
    return registrationVerification;
  }
  // encrypt password here
  const user = new User();
  user.email = registrationForm.email.toLowerCase();
  user.username = registrationForm.username.toLocaleLowerCase();
  user.passwordHash = await encryptPassword(registrationForm.password);
  user.isVerified = false;

  const repository = AppDataSource.manager.getRepository("User");
  await repository.save(user);
  await sendVerificationEmail(user.email);
  return { success: true };
};

const verifyRegistration = async (registrationForm: IRegistration) => {
  // verify all fields are present
  if (
    !registrationForm.email ||
    !registrationForm.username ||
    !registrationForm.password
  ) {
    return { error: "All fields are required", success: false };
  }
  const repository = AppDataSource.manager.getRepository("User");
  // check if the email is already in use
  const emailExists = await repository.findOne({
    where: { email: registrationForm.email },
  });
  if (emailExists) {
    console.log(emailExists);
    return { error: "Email already in use", success: false };
  }
  // check if the username is already in use
  const usernameExists = await repository.findOne({
    where: { username: registrationForm.username },
  });
  if (usernameExists) {
    return { error: "Username already in use", success: false };
  }
  return { success: true };
};

const sendVerificationEmail = async (email: string) => {
  // send email logic here
  console.log(`Email sent to ${email}`);
};

export const handleLogin = async (loginForm:{username:string, password:string}) => {
  // delete old tokens
  const repository = AppDataSource.manager.getRepository("User");

  const user = await repository.findOne({
    where: { username: loginForm.username },
  });
  console.log(user);
  if (!user) {
    return { error: "User not found", success: false };
  }
  const isValid = await validatePassword(loginForm.password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid password", success: false };
  }
  const token = await generateAccessToken(user as User);
  return { success: true, ...token };
};

export const verifyToken = async (token: string) => {
  const repository = AppDataSource.manager.getRepository("AccessToken");
  const accessToken = await repository.findOne({
    where: { token },
    relations: ["user"],
  });
  if (!accessToken) {
    return { error: "Invalid token", success: false };
  }
  if (accessToken.expiresAt < new Date()) {
    return { error: "Token expired", success: false };
  }
  return { success: true };
};

const generateAccessToken = async (user: User) => {
  await removeOldTokens(user);
  const token = new AccessToken();
  token.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  token.token = Math.random().toString(36).substring(2);
  token.user = user;
  const repository = AppDataSource.manager.getRepository("AccessToken");
  repository.save(token);
  return token;
};
const removeOldTokens = async (user: User) => {
  const repository = AppDataSource.manager.getRepository("AccessToken");
  const oldToken = await repository.findOne({ where: { user } });
  if (oldToken) {
    console.log("Old tokens found");
    await repository.delete(oldToken);
  } else {
    console.log("No old tokens found");
  }
};
