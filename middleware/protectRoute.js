import * as User from '../models/user.js';
import * as UserToken from '../models/user_token.js';
import * as Role from '../models/role.js';

const protectRoute = async (req, res, next) => {
  try {
    console.log(req.cookies)
    console.log(req.cookies.refreshToken)
    // const refreshToken = req.cookies.refreshToken;
    // if (!refreshToken) return res.status(401).send({
    //   error: "Unauthorized - No Refresh Token Provided"
    // });

    // const user_token = await UserToken.findByToken(refreshToken);
    // if(!user_token) return res.status(401).send({
    //   error: "Unauthorized - No User Token Provided"
    // });

    // const user = await User.find(user_token.user_id);
    // if (!user) return res.status(401).send({ error: "User not found" });

    // const role = await Role.getForUser(user.id);
    // if (!role) return res.status(401).send({ error: "User role nor found" });

    // user.role = role
    // req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute controller", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default protectRoute;
