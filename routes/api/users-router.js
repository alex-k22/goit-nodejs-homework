import express from "express";
import authControllers from "../../controllers/auth-controllers.js";
import usersSchemas from "../../schemas/users-schemas.js";
import {validateBody} from "../../decorators/index.js";
import {upload, authentificate} from "../../middlewares/index.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(usersSchemas.userSignupSchema), authControllers.register);

usersRouter.post("/login", validateBody(usersSchemas.userSigninSchema), authControllers.login);

usersRouter.get("/current", authentificate, authControllers.getCurrent);

usersRouter.post("/logout", authentificate, authControllers.logout);

usersRouter.patch("/avatars", authentificate, upload.single('avatarURL'), authControllers.addAvatar)

export default usersRouter;