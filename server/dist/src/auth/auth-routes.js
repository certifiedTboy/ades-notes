import { body } from "express-validator";
import { AuthControllers } from "./auth-controllers.js";
import { AppRoutesHandler } from "../lib/app-routes-middlewares.js";
/**
 * @class AuthRoutes
 * @extends AppRoutesHandler
 * @description A class to handle the authentication-related routes for the application.
 * It sets up endpoints for user login, password reset requests, and password updates.
 */
export class AuthRoutes extends AppRoutesHandler {
    constructor() {
        super();
        this.featureRoutes();
    }
    /**
     * @private featureRoutes
     * @description Sets up the specific routes for authentication features, including their validation middleware.
     */
    featureRoutes() {
        this.routes.post("/login/google", this.getGoogleLoginValidationRules(), this.checkValidationResult, AuthControllers.loginUserWithGoogle);
        this.routes.post("/login/github", this.getGithubLoginValidationRules(), this.checkValidationResult, AuthControllers.loginUserWithGithub);
        this.routes.post("/logout", this.adminGuard, AuthControllers.logoutUser);
    }
    /**
     * @private getGogleLoginValidationRules
     * @description Returns an array of validation rules for the google login endpoin.
     * @returns {Array} An array of express-validator middleware.
     */
    getGoogleLoginValidationRules() {
        return [
            body("token").notEmpty().withMessage("token is required"),
            body("acceptTerms")
                .notEmpty()
                .withMessage("You must agree to the Privacy Policy to continue")
                .isBoolean()
                .withMessage("acceptTerms must be a boolean value")
                .equals("true")
                .withMessage("You must agree to the Privacy Policy to continue"),
        ];
    }
    getGithubLoginValidationRules() {
        return [
            body("code").notEmpty().withMessage("code is required"),
            body("acceptTerms")
                .notEmpty()
                .withMessage("You must agree to the Privacy Policy to continue")
                .isBoolean()
                .withMessage("acceptTerms must be a boolean value")
                .equals("true")
                .withMessage("You must agree to the Privacy Policy to continue"),
        ];
    }
}
