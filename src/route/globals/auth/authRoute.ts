import express , {Router} from "express"
import AuthController from "../../../controller/globals/auth/auth.controller";
// import { registerUser } from "../../../controller/globals/auth/auth.controller";

const router:Router = express.Router();

// router.route("/register").post( AuthController.registerUser)
// router.route("/login").post(AuthController.loginUser)

router.route("/register").post((req, res) => AuthController.registerUser(req, res));
router.route("/login").post((req, res) => AuthController.loginUser(req, res));
router.post('/auth/reset-password', AuthController.forgotPasswordLimiter, AuthController.resetPassword);

export default router;