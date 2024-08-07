import bcrypt from 'bcryptjs';
import * as User from "../models/user.js";
import * as UserToken from "../models/user_token.js";
import * as Role from "../models/role.js";
import generateToken from '../helpers/generateToken.js';

export const getAuthRoutes = async (req, res) => {
  console.log("getAuthRoutes");
  res.status(200).send({
    route1: 'router.get("", controller.getAuthRoutes)',
    route2: 'router.post("/login", controller.login)',
    route3: 'router.post("/logout", controller.logout);',
   });
};

export const login = async (req, res) => {
	try {
		const { name, password } = req.body;

		const user = await User.findOne(name);
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if(!user) return res.status(400).send({ message: "Такого пользователя не существует" });
		if(!isPasswordCorrect) return res.status(400).send({ message: "Неверный пароль" });

    const token = generateToken(user.id);
    await UserToken.updateWhere({ user_id: user.id }, { token });

    const role = await Role.getForUser(user.id);
    user.role = role;

		res.status(200).send({ message: "Successfully login", user, token });
	}	catch (err) {
		console.log("Error in login controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.status(200).send({ message: "Successfully logout" });
	}	catch (err) {
		console.log("Error in logout controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};
