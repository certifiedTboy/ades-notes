import { body } from "express-validator";
import { UserControllers } from "./user-controllers.js";
import { AppRoutesHandler } from "../lib/app-routes-middlewares.js";
/**
 * @class UserRoutes
 * @extends AppRoutesHandler
 * @description A class to handle user-related routes for the application.
 * It sets up endpoints for creating a new user, verifying an account, and fetching a user profile.
 */
export class UserRoutes extends AppRoutesHandler {
    constructor() {
        super();
        this.featureRoutes();
    }
    /**
     * @private featureRoutes
     * @description Sets up the specific routes for user features, including their validation and authentication middleware.
     */
    featureRoutes() {
        this.routes.post("/", this.getCreateUserValidationRules(), this.checkValidationResult, UserControllers.createNewUser);
        this.routes.patch("/verify", this.getVerifyUserValidationRules(), this.checkValidationResult, UserControllers.verifyUserAccount);
        this.routes.get("/profile", this.authGuard, UserControllers.getCurrentUserProfile);
        this.routes.get("/", this.adminGuard, UserControllers.getAllUsers);
        this.routes.delete("/delete", this.authGuard, UserControllers.deleteUserAccount);
        this.routes.post("/news-letters", this.getNewsLettersValidationRules(), this.checkValidationResult, UserControllers.addNewEmailToNewLetters);
        this.routes.delete("/news-letters", this.getNewsLettersValidationRules(), this.checkValidationResult, UserControllers.removeEmailFromNewsLetter);
        this.routes.get("/news-letters/all", this.adminGuard, UserControllers.getAllNewsLetterEmails);
    }
    /**
     * @private getCreateUserValidationRules
     * @description Returns an array of validation rules for the user creation endpoint.
     * @returns {Array} An array of express-validator middleware.
     */
    getCreateUserValidationRules() {
        return [
            body("firstName").notEmpty().withMessage("first name is required"),
            body("lastName").notEmpty().withMessage("last name is required"),
            body("email")
                .notEmpty()
                .withMessage("email is required")
                .isEmail()
                .withMessage("invalid email address"),
            body("password")
                .notEmpty()
                .withMessage("password is required")
                .matches(/^.{8,}$/)
                .withMessage("Password must be at least 8 characters long")
                .matches(/[a-z]/)
                .withMessage("Password must contain at least one lowercase letter")
                .matches(/[A-Z]/)
                .withMessage("Password must contain at least one uppercase letter")
                .matches(/[0-9]/)
                .withMessage("Password must contain at least one number")
                .matches(/[^A-Za-z0-9]/)
                .withMessage("Password must contain at least one special character"),
            body("confirmPassword").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords do not match");
                }
                return true;
            }),
        ];
    }
    /**
     * @private getVerifyUserValidationRules
     * @description Returns an array of validation rules for the user verification endpoint.
     * @returns {Array} An array of express-validator middleware.
     */
    getVerifyUserValidationRules() {
        return [
            body("otp")
                .notEmpty()
                .withMessage("otp is required")
                .matches(/^[0-9]{6}$/)
                .withMessage("Invalid otp"),
        ];
    }
    getNewsLettersValidationRules() {
        return [
            body("email")
                .notEmpty()
                .withMessage("email is required")
                .isEmail()
                .withMessage("invalid email address"),
        ];
    }
}
