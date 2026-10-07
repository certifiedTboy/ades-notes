import { body } from "express-validator";
import { PostControllers } from "./posts-controllers.ts";
import { AppRoutesHandler } from "../lib/app-routes-middlewares.ts";
import { REACTION_TYPES } from "./posts-model.ts";

export class PostRoutes extends AppRoutesHandler {
  constructor() {
    super();
    this.featureRoutes();
  }

  private featureRoutes() {
    // Create a new post (protected)
    this.routes.post(
      "/",
      this.authGuard,
      this.getCreatePostValidationRules(),
      this.checkValidationResult,
      PostControllers.createPost,
    );

    // Get all posts for admin (protected, admin only)
    this.routes.get("/", this.adminGuard, PostControllers.getAllPostsForAdmin);

    // Get all posts (public)
    this.routes.get("/published", PostControllers.getPosts);

    // Update a post (protected)
    this.routes.patch(
      "/:postId",
      this.authGuard,
      this.getUpdatePostValidationRules(),
      this.checkValidationResult,
      PostControllers.updatePost,
    );

    // Delete a post (protected, admin only)
    this.routes.delete("/:postId", this.adminGuard, PostControllers.deletePost);

    // Update post view count
    this.routes.patch(
      "/:postId/view-count",
      PostControllers.updatePostViewCount,
    );

    // Get a single post by slug (public)
    this.routes.get("/:slug", PostControllers.getPostBySlug);

    // Get all comments for a post (public)
    this.routes.get("/:postId/comments", PostControllers.getCommentsByPost);

    // Add a comment to a post (protected)
    this.routes.post(
      "/:postId/comments",
      this.authGuard,
      this.getAddCommentValidationRules(),
      this.checkValidationResult,
      PostControllers.addComment,
    );

    // Get all comments (admin only)
    this.routes.get(
      "/comments/all",
      this.adminGuard,
      PostControllers.getAllComments,
    );

    // Update a comment (protected)
    this.routes.patch(
      "/comments/:commentId",
      this.authGuard,
      this.getUpdateCommentValidationRules(),
      this.checkValidationResult,
      PostControllers.updateComment,
    );

    // Delete a comment (protected)
    this.routes.delete(
      "/comments/:commentId",
      this.authGuard,
      PostControllers.deleteComment,
    );

    // Get all reactions for a post (public)
    this.routes.get(
      "/:postId/reactions",
      this.checkValidationResult,
      PostControllers.getReactionsByPost,
    );

    // Add or update a reaction to a post (protected)
    this.routes.post(
      "/:postId/reactions",
      this.authGuard,
      this.getAddReactionValidationRules(),
      this.checkValidationResult,
      PostControllers.addReaction,
    );

    this.routes.post(
      "/files/upload",
      this.adminGuard,
      this.multerUpload().single("file"),
      PostControllers.uploadFiles,
    );
  }

  private getCreatePostValidationRules() {
    return [
      body("title").notEmpty().withMessage("Title is required"),
      body("content").notEmpty().withMessage("Content is required"),
      body("category").notEmpty().withMessage("Category is required"),
      body("coverImageCredit").optional().isString(),
      body("status")
        .optional()
        .isIn(["published", "draft"])
        .withMessage("Invalid status"),
      body("featured").optional().isBoolean(),
    ];
  }

  private getUpdatePostValidationRules() {
    return [
      body("title").optional().notEmpty().withMessage("Title cannot be empty"),
      body("content")
        .optional()
        .notEmpty()
        .withMessage("Content cannot be empty"),
      body("category")
        .optional()
        .notEmpty()
        .withMessage("Category cannot be empty"),
      body("status")
        .optional()
        .isIn(["published", "draft"])
        .withMessage("Invalid status"),
    ];
  }

  private getAddCommentValidationRules() {
    return [
      body("content")
        .notEmpty()
        .withMessage("Comment content is required")
        .isLength({ max: 500 })
        .withMessage("Comment content cannot exceed 500 characters"),
      body("parentId").optional({ nullable: true }),
    ];
  }

  private getUpdateCommentValidationRules() {
    return [
      body("content")
        .notEmpty()
        .withMessage("Comment content is required")
        .isLength({ max: 500 })
        .withMessage("Comment content cannot exceed 500 characters"),
    ];
  }

  private getAddReactionValidationRules() {
    return [
      body("type")
        .notEmpty()
        .withMessage("Reaction type is required")
        .isIn(REACTION_TYPES)
        .withMessage("Invalid reaction type"),
    ];
  }
}
