import { body } from "express-validator";
import { AuthControllers } from "./auth-controllers.ts";
import { AppRoutesHandler } from "../lib/app-routes-middlewares.ts";

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
  private featureRoutes() {
    this.routes.post(
      "/login/google",
      this.getGoogleLoginValidationRules(),
      this.checkValidationResult,
      AuthControllers.loginUserWithGoogle,
    );

    this.routes.get(
      "/login/github",
      this.getGithubLoginValidationRules(),
      this.checkValidationResult,
      AuthControllers.loginUserWithGithub,
    );
  }

  /**
   * @private getGogleLoginValidationRules
   * @description Returns an array of validation rules for the google login endpoin.
   * @returns {Array} An array of express-validator middleware.
   */
  private getGoogleLoginValidationRules() {
    return [body("token").notEmpty().withMessage("token is required")];
  }

  private getGithubLoginValidationRules() {
    return [body("code").notEmpty().withMessage("code is required")];
  }
}
