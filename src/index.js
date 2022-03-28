import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as yup from "yup";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const config = {
  secret: process.env.SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN,
};

const users = [];

class User {
  constructor({ username, email, password, age }) {
    this.uuid = uuidv4();
    this.age = age;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdOn = new Date();
  }
}

const createUserShape = yup.object().shape({
  username: yup.string().required(),
  uuid: yup.string().default(() => {
    uuidv4();
  }),
  age: yup.number().integer().positive().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .transform((psw) => bcrypt.hashSync(psw, 10)),
  createdOn: yup.date().default(() => {
    new Date();
  }),
});

const createLoginShape = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const createUpdateShape = yup.object().shape({
  password: yup
    .string()
    .required()
    .transform((psw) => bcrypt.hashSync(psw, 10)),
});

//------midlewares---------

const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }
    req.username = decoded.username;
    next();
  });
};

const validateShape = (shape) => async (req, res, next) => {
  try {
    const validated = await shape.validate(req.body, { abortEarly: false });
    req.validated = validated;
    return next();
  } catch (e) {
    return res.status(422).json({ message: e.errors });
  }
};

const verifyUuid = async (req, res, next) => {
  const uuid = req.params.uuid;

  const user = await users.find((person) => person.uuid == uuid);

  if (!user) {
    return res.status(404).json({ message: "not found user" });
  }

  req.user = user;
  return next();
};

const verifyUsernameExists = async (req, res, next) => {
  const { username } = req.body;

  const user = await users.find((person) => person.username == username);

  if (!user) {
    return res.status(404).json({ message: " user not exists" });
  }
  req.user = user;
  return next();
};

const verifyUserExists = async (req, res, next) => {
  const { email, username } = req.body;

  const user = await users.find((person) => person.email == email);

  if (user) {
    return res.status(404).json({ message: "user already exists" });
  }
  req.user = user;
  return next();
};
//-------routes---------

app.post(
  "/signup",
  verifyUserExists,
  validateShape(createUserShape),
  (req, res) => {
    const user = new User(req.validated);

    users.push(user);

    return res.status(201).json({
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      age: user.age,
      createdOn: user.createdOn,
    });
  }
);

app.get("/users", validateToken, (_, res) => {
  return res.status(200).json(users);
});

app.post(
  "/login",
  validateShape(createLoginShape),
  verifyUsernameExists,
  async (req, res) => {
    const { password, username } = req.body;
    const password_user = req.user.password;

    const match = await bcrypt.compare(password, password_user);

    const token = jwt.sign({ username }, config.secret, {
      expiresIn: config.expiresIn,
    });
    if (!match) {
      return res.status(401).json({ message: "invalid password" });
    }
    res.status(200).json({ token: token });
  }
);

app.put(
  "/users/:uuid/password",
  validateShape(createUpdateShape),
  validateToken,
  verifyUuid,
  (req, res) => {
    const user = req.user;
    const username = req.username;
    const newPassword = bcrypt.hashSync(req.body.password, 10);

    if (user.username != username) {
      return res
        .status(403)
        .json({
          message:
            "Unable to complete this update using this profile, PERMISSION DENIED! ",
        });
    }

    user.password = newPassword;

    return res.status(204).json();
  }
);
app.listen(3000, () => console.log("running in port 3000"));
