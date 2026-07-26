import { HttpException } from "../lib/exceptions/http-exception.ts";
import { type IUser } from "../lib/types.ts";
import User, { type INewsLetters, NewsLetter } from "./user.model.ts";
import { AppHelpers } from "../helpers/app-helpers.ts";
import eventEmitter from "../helpers/events.ts";

/**
 * @class UserServices
 * @description This class provides services for user-related database operations.
 * It includes methods for creating new users, verifying user accounts,
 * and updating user data. It also handles the logic for both new and
 * existing-but-unverified user registration flows.
 */
export class UserServices {
  /**
   * @static
   * @async
   * @method createUser
   * @description Creates a new user or updates an existing unverified user.
   * If the user already exists and is verified, it throws a conflict error.
   * If the user exists but is not verified, it updates their information and resends a verification OTP.
   * Otherwise, it creates a new user record in the database.
   * @param {IUser} userData - The data for the new user, including name, email, and password.
   * @returns {Promise<{email: string}>} A promise that resolves to an object containing the user's email.
   * @throws {HttpException} If the user already exists and is verified.
   */
  public static async createUser(userData: IUser) {
    const userExist = await this.checkIfUserExistByEmail(userData.email);

    if (userExist?.isVerified) {
      throw new HttpException(409, "User already exist");
    }

    if (userExist && !userExist?.isVerified) {
      const newUser = await this.updateUserData(
        { email: userData.email },
        {
          ...userData,
          otp: AppHelpers.generateOTP(),
          otpExpiry: new Date(Date.now() + 60 * 60 * 1000),
          password: await AppHelpers.hashPassword(userData?.password!),
        },
      );

      eventEmitter.emitEvent("new-user", {
        id: newUser?.email,
        email: newUser.email,
        firstName: newUser.firstName,
        otp: newUser.otp!,
        delayInMinutes: 0.5,
      });

      return { email: newUser.email };
    }

    const newUser = await User.create({
      ...userData,
      otp: AppHelpers.generateOTP(),
      otpExpiry: new Date(Date.now() + 60 * 60 * 1000),
      password: await AppHelpers.hashPassword(userData?.password!),
    });

    eventEmitter.emitEvent("new-user", {
      id: newUser?.email,
      email: newUser.email,
      firstName: newUser.firstName,
      otp: newUser.otp!,
      delayInMinutes: 0.5,
    });

    return { email: newUser.email };
  }

  /**
   * @static
   * @async
   * @method createGoogleUser
   * @description Creates a new user for google loginnds a verification OTP.
   * Otherwise, it creates a new user record in the database.
   * @param {IUser} userData - The data for the new user, including name, email, and password.
   * @returns {Promise<IUser>} A promise that resolves to an object containing the user's email.
   * @throws {HttpException} If the user already exists and is verified.
   */
  public static async createNewUser(userData: IUser) {
    const userExist = await this.checkIfUserExistByEmail(userData.email);

    if (userExist) {
      return userExist;
    }

    return await User.create(userData);
  }

  /**
   * @static
   * @async
   * @method verifyUser
   * @description Verifies a user's account using an OTP.
   * @param {string} otp - The One-Time Password submitted by the user.
   * @returns {Promise<{email: string | undefined}>} A promise that resolves to an object containing the user's email upon successful verification.
   * @throws {HttpException} If the user is not found, already verified, or if the OTP is expired.
   */
  public static async verifyUser(otp: string) {
    const user = await this.checkIfUserExist({ otp });

    if (!user) {
      throw new HttpException(404, "invalid code");
    }
    if (user.isVerified) {
      throw new HttpException(409, "user already verified");
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      throw new HttpException(409, "otp expired");
    }
    const updatedUser = await this.updateUserData(
      { email: user.email },
      {
        isVerified: true,
        $unset: { otp: 1, otpExpiry: 1 },
      },
    );

    if (!updatedUser) {
      // This case should ideally not be hit if the user was found before.
      throw new HttpException(500, "Failed to verify user.");
    }

    eventEmitter.emitEvent("user-verified", {
      id: updatedUser.email,
      firstName: updatedUser.firstName,
      email: updatedUser.email,
      delayInMinutes: 0.5,
    });
    return { email: updatedUser?.email };
  }

  /**
   * @private
   * @static
   * @async
   * @method checkIfUserExistByEmail
   * @description Checks if a user exists in the database based on their email address.
   * @param {string} email - The email address to check.
   * @returns {Promise<any>} A promise that resolves to the user document if found, otherwise null.
   */
  private static async checkIfUserExistByEmail(email: string) {
    return await User.findOne({ email });
  }

  /**
   * @public
   * @static
   * @async
   * @method checkIfUserExist
   * @description A generic method to check for a user's existence based on a flexible query.
   * @param {any} query - The Mongoose query object to find a user.
   * @returns {Promise<any>} A promise that resolves to the user document if found, otherwise null.
   */
  public static async checkIfUserExist(query: any) {
    return await User.findOne<any>(query);
  }

  public static async updateUserData(query: any, data: any) {
    const updatedUser = await User.findOneAndUpdate(query, data, {
      new: true,
    });

    if (!updatedUser) {
      throw new HttpException(500, "something went wrong");
    }

    return updatedUser;
  }

  /**
   * @static getAllUsers
   * @description Retrieves a list of all users with pagination (for admins).
   * @param {number} limit - The number of users to return.
   * @param {number} page - The page number.
   * @returns {Promise<{users: IUser[], total: number}>} A promise that resolves to the users and total count.
   */
  public static async getAllUsers(
    limit: number,
    page: number,
  ): Promise<{ users: IUser[]; total: number }> {
    const users = await User.find()
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    const total = await User.countDocuments();

    //@ts-ignore
    return { users, total };
  }

  /**
   * @static addEmailToNewLetters
   * @description adds new user email to news letters
   * @param {string} email email of the user to be added to new letters
   * @return {Promise<{INewsLetters}>} A promise that resolves to the mongodb document of the newly added email
   */

  public static async addEmailToNewLetters(
    email: string,
  ): Promise<INewsLetters> {
    const emailExist = await this.checkIfEmailExist(email);

    if (emailExist) {
      throw new HttpException(409, "email already exist in news letters");
    }

    const newLetter = await NewsLetter.create({ email });
    return newLetter;
  }

  /**
   * @static getAllUnmutedEmails
   * @description get all unmuted emails
   * @return {Promise<INewsLetters[]>}
   */
  public static async getAllNewLetterEmails(): Promise<string[]> {
    const result = await NewsLetter.find();

    return result.map((item) => item.email);
  }

  public static async getAllEmails(
    limit: number,
    page: number,
  ): Promise<{
    emails: INewsLetters[];
    total: number;
  }> {
    const emails = await NewsLetter.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    const total = await NewsLetter.countDocuments();

    return { emails, total };
  }

  /**
   * @static removeEmailFromNewLetter
   * @description removes an email from new letter
   * @param {string} email
   * @return {Promise<void>}
   */
  static async removeEmailFromNewLetter(email: string): Promise<void> {
    await NewsLetter.deleteOne({ email });
  }

  // /**
  //  * @static toggleMutedStatus
  //  * @description toggles isMuted status of an email in the news letter
  //  * @param {string} email
  //  * @return {Promise<INewsLetters>}
  //  */
  // static async toggleMutedStatus(email: string): Promise<INewsLetters> {
  //   const emailExist = await this.checkIfEmailExist(email);

  //   if (!emailExist) {
  //     throw new HttpException(404, "email does not exist in new letters");
  //   }

  //   const updatedEmail = await NewsLetter.findOneAndUpdate(
  //     { email },
  //     { isMuted: !emailExist.isMuted },
  //     { new: true },
  //   );

  //   if (!updatedEmail) {
  //     throw new HttpException(500, "something went wrong");
  //   }

  //   return updatedEmail;
  // }

  /**
   * @static checkIfEmailExists
   * @description checks if email already exist in newletters
   * @param {string} email
   * @return {Promise<{INewsLetters}> | null}
   */
  private static async checkIfEmailExist(
    email: string,
  ): Promise<INewsLetters | null> {
    return await NewsLetter.findOne({ email });
  }

  /**
   * @static deleteAccount
   * @description deletes user's account
   * @param {string} email
   */
  public static async deleteAccount(email: string): Promise<void> {
    await User.deleteOne({ email });
  }
}
