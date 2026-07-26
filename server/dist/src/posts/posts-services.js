import mongoose from "mongoose";
import { HttpException } from "../lib/exceptions/http-exception.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand, } from "@aws-sdk/client-s3";
import eventEmitter from "../helpers/events.js";
import { AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_SECRET_ACCESS_KEY, } from "../lib/constants.js";
import { Types } from "mongoose";
import Post, { Comment, Reaction, } from "./posts-model.js";
export class PostServices {
    static s3 = new S3Client({
        region: AWS_BUCKET_REGION,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
    });
    /**
     * @static createPost
     * @description Creates a new blog post.
     * @param {IPost} postData - The data for the new post.
     * @returns {Promise<IPost>} A promise that resolves to the new post.
     */
    static async createPost(postData) {
        const slug = postData.title.toLowerCase().split(" ").join("-");
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            throw new HttpException(409, "A post with this title already exists.");
        }
        const post = new Post({
            ...postData,
            slug,
        });
        await post.save();
        eventEmitter.emitEvent("create-post", {
            id: `create-post-${post._id}`,
            delayInMinutes: 0.5,
            postId: post._id,
            postData: post,
        });
        return post;
    }
    /**
     * @static getPosts
     * @description Retrieves a list of posts with pagination.
     * @param {number} limit - The number of posts to return.
     * @param {number} page - The page number.
     * @returns {Promise<{posts: IPost[], total: number}>} A promise that resolves to the posts and total count.
     */
    static async getPosts(limit, page) {
        const posts = await Post.find({ status: "published" })
            .populate("author", "firstName lastName picture")
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        const total = await Post.countDocuments({ status: "published" });
        return { posts, total };
    }
    /**
     * @static getAllPostsForAdmin
     * @description Retrieves all posts for an admin user with pagination.
     * @param {number} limit - The number of posts to return.
     * @param {number} page - The page number.
     * @returns {Promise<{posts: IPost[], total: number}>} A promise that resolves to the posts and total count.
     */
    static async getAllPostsForAdmin(limit, page) {
        const posts = await Post.find()
            .populate("author", "firstName lastName picture")
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        const total = await Post.countDocuments();
        return { posts, total };
    }
    /**
     * @static updatePost
     * @description Updates an existing post.
     * @param {string} postId - The ID of the post to update.
     * @param {Partial<IPost>} postData - The data to update the post with.
     * @returns {Promise<IPost>} A promise that resolves to the updated post.
     */
    static async updatePost(postId, postData) {
        if (postData.title) {
            postData.slug = postData.title.toLowerCase().split(" ").join("-");
        }
        const post = await Post.findByIdAndUpdate(postId, postData, {
            new: true,
        });
        if (!post) {
            throw new HttpException(404, "Post not found.");
        }
        return post;
    }
    /**
     * @static getPostBySlug
     * @description Retrieves a single post by its slug.
     * @param {string} slug - The slug of the post.
     * @returns {Promise<IPost>} A promise that resolves to the found post.
     */
    static async getPostBySlug(slug) {
        const post = await Post.findOne({ slug }).populate("author", "firstName lastName lastName picture");
        if (!post) {
            throw new HttpException(404, "Post not found.");
        }
        // Increment view count
        post.viewCount += 1;
        await post.save();
        return post;
    }
    /**
     * @static updatePostViewCount
     * @description Increments the view count of a post.
     * @param {string} postId - The ID of the post.
     * @returns {Promise<{message: string}>} A promise that resolves to a success message.
     */
    static async updatePostViewCount(postId) {
        await Post.findByIdAndUpdate(postId, { $inc: { viewCount: 1 } });
        return { message: "Post view count updated successfully" };
    }
    // ... existing methods
    /**
     * @static addComment
     * @description Adds a comment to a post.
     * @param {string} postId - The ID of the post to comment on.
     * @param {string} authorId - The ID of the user adding the comment.
     * @param {string} content - The content of the comment.
     * @param {string | null} parentId - The ID of the parent comment if it's a reply.
     * @returns {Promise<IComment>} A promise that resolves to the new comment.
     */
    static async addComment(postId, authorId, content, parentId = null, tempId) {
        if (parentId) {
            // If parentId is not a valid ObjectId, it's a tempId.
            // We need to find the actual parent comment's _id.
            if (!mongoose.isValidObjectId(parentId)) {
                const parentComment = await Comment.findOne({ tempId: parentId });
                if (!parentComment) {
                    throw new HttpException(404, "Parent comment not found.");
                }
                // Use the real _id of the parent for the new comment.
                parentId = parentComment._id.toString();
            }
        }
        // All branches lead here. `parentId` is either null, a valid ObjectId,
        // or has been resolved from a tempId to a valid ObjectId.
        const comment = new Comment({
            post: postId,
            author: authorId,
            content,
            parent: parentId, // This will be null for top-level comments
            tempId,
        });
        await comment.save();
        // Increment comment count on the post
        await Post.findByIdAndUpdate(postId, {
            $inc: { commentCount: 1 },
        });
        return comment;
    }
    /**
     * @static addOrUpdateReaction
     * @description Adds, updates, or removes a reaction from a post for a specific user.
     * @param {string} postId - The ID of the post.
     * @param {string} authorId - The ID of the user reacting.
     * @param {ReactionType} type - The type of reaction.
     * @returns {Promise<{message: string}>} A promise that resolves to a success message.
     */
    static async addOrUpdateReaction(postId, authorId, type) {
        const existingReaction = await Reaction.findOne({
            // @ts-ignore
            post: new Types.ObjectId(postId),
            author: new Types.ObjectId(authorId),
        });
        if (existingReaction) {
            const reactionId = existingReaction._id;
            if (existingReaction.type === type) {
                // User is removing their reaction
                await Reaction.findByIdAndDelete(reactionId);
                await Post.findByIdAndUpdate(postId, { $inc: { reactionCount: -1 } });
                return { message: "Reaction removed" };
            }
            else {
                // User is changing their reaction
                await Reaction.findByIdAndUpdate(reactionId, { type });
                return { message: "Reaction updated" };
            }
        }
        else {
            // User is adding a new reaction
            const reaction = new Reaction({
                post: postId,
                author: authorId,
                type,
            });
            await reaction.save();
            await Post.findByIdAndUpdate(postId, { $inc: { reactionCount: 1 } });
            return { message: "Reaction added" };
        }
    }
    /**
     * @static getAllComments
     * @description Retrieves all comments with pagination (for admins).
     * @param {number} limit - The number of comments to return.
     * @param {number} page - The page number.
     * @returns {Promise<{comments: IComment[], total: number}>} A promise that resolves to the comments and total count.
     */
    static async getAllComments(limit, page) {
        const comments = await Comment.find()
            .populate("author", "firstName lastName picture")
            .populate("post", "title")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        const total = await Comment.countDocuments();
        return { comments, total };
    }
    /**
     * @static getCommentsByPost
     * @description Retrieves all comments for a given post.
     * @param {string} postId - The ID of the post.
     * @param {number} limit - The number of comments to return per page.
     * @param {number} page - The page number.
     * @returns {Promise<{comments: IComment[], total: number}>} A promise that resolves to the comments and total count.
     */
    static async getCommentsByPost(postId, limit, page) {
        const results = await Comment.aggregate([
            {
                $match: {
                    post: new Types.ObjectId(postId),
                    parent: null,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            // Get every descendant reply for each top-level comment
            {
                $graphLookup: {
                    from: "comments",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parent",
                    as: "replies",
                    depthField: "depth",
                },
            },
            // Populate the top-level comment author
            {
                $lookup: {
                    from: "users",
                    let: {
                        authorId: "$author",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$authorId"],
                                },
                            },
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                picture: 1,
                                username: 1,
                            },
                        },
                    ],
                    as: "authorDetails",
                },
            },
            {
                $set: {
                    author: {
                        $arrayElemAt: ["$authorDetails", 0],
                    },
                },
            },
            {
                $unset: "authorDetails",
            },
            // Fetch the profile details of every reply author
            {
                $lookup: {
                    from: "users",
                    let: {
                        replyAuthorIds: "$replies.author",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$replyAuthorIds"],
                                },
                            },
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                picture: 1,
                                username: 1,
                            },
                        },
                    ],
                    as: "replyAuthors",
                },
            },
            // Attach the correct author profile to each reply
            {
                $set: {
                    replies: {
                        $map: {
                            input: "$replies",
                            as: "reply",
                            in: {
                                $mergeObjects: [
                                    "$$reply",
                                    {
                                        author: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$replyAuthors",
                                                        as: "replyAuthor",
                                                        cond: {
                                                            $eq: ["$$replyAuthor._id", "$$reply.author"],
                                                        },
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $unset: "replyAuthors",
            },
            // Sort replies from oldest to newest
            {
                $set: {
                    replies: {
                        $sortArray: {
                            input: "$replies",
                            sortBy: {
                                createdAt: 1,
                            },
                        },
                    },
                },
            },
        ]);
        const total = await Comment.countDocuments({
            // @ts-ignore
            post: new Types.ObjectId(postId),
            parent: null,
        });
        return { comments: results, total };
    }
    /**
     * @static getReactionsByPost
     * @description Retrieves all reactions for a given post.
     * @param {string} postId - The ID of the post.
     * @returns {Promise<IReaction[]>} A promise that resolves to the list of reactions.
     */
    static async getReactionsByPost(postId) {
        // @ts-ignore
        return Reaction.find({ post: new Types.ObjectId(postId) }).populate("author", "firstName lastName picture");
    }
    /**
     * @static updateComment
     * @description Updates a comment.
     * @param {string} commentId - The ID of the comment to update.
     * @param {string} content - The new content of the comment.
     * @returns {Promise<IComment>} A promise that resolves to the updated comment.
     */
    static async updateComment(commentId, content) {
        const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
        if (!comment) {
            throw new HttpException(404, "Comment not found.");
        }
        return comment;
    }
    /**
     * @static deletePost
     * @description Deletes a post and its associated comments and reactions.
     * @param {string} postId - The ID of the post to delete.
     * @returns {Promise<{message: string}>} A promise that resolves to a success message.
     */
    static async deletePost(postId) {
        const post = await Post.findByIdAndDelete(postId);
        // @ts-ignore
        await Comment.deleteMany({ post: postId });
        // @ts-ignore
        await Reaction.deleteMany({ post: postId });
        return { message: "Post deleted successfully", post };
    }
    /**
     * @static deleteComment
     * @description Deletes a comment and its replies, and decrements the post's comment count.
     * @param {string} commentId - The ID of the comment to delete.
     * @returns {Promise<{message: string}>} A promise that resolves to a success message.
     */
    static async deleteComment(id) {
        const comment = await Comment.findByIdAndDelete(id);
        if (comment) {
            await Post.findByIdAndUpdate(comment.post, {
                $inc: { commentCount: -1 },
            });
        }
        return { message: "Comment deleted successfully", comment };
    }
    /**
     * @static deleteCommentByTempId
     * @description Deletes a comment and its replies by temp id.
     * @param {string} tempId - The temporary id of the comment or reply.
     * @returns {Promise<{message: string}>} A promise that resolves to a success message.
     */
    static async deleteCommentByTempId(tempId) {
        const comment = await Comment.findOneAndDelete({ tempId });
        if (comment) {
            await Post.findByIdAndUpdate(comment.post, {
                $inc: { commentCount: -1 },
            });
        }
        return { message: "Comment deleted successfully", comment };
    }
    /**
     * @static uploadFileToAWSs3Bucket
     * @description Uploads a file to the configured AWS S3 bucket.
     * @param {Express.Multer.File} file - The file to upload, handled by multer.
     * @returns {Promise<{ url: string }>} A promise that resolves to an object containing the public URL of the uploaded file.
     */
    static async uploadFileToAWSs3Bucket(file) {
        const fileName = `${Date.now()}-${file.originalname.replace(/ /g, "-")}`;
        const command = new PutObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3.send(command);
        const url = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
        return { url };
    }
    /**
     * @static deleteFileFromAWSs3Bucket
     * @description Deletes a file from the AWS S3 bucket using its public URL.
     * @param {string} fileUrl - The public URL of the file to be deleted.
     * @returns {Promise<{ message: string }>} A promise that resolves to a success message.
     * @throws {HttpException} If the file cannot be deleted.
     */
    static async deleteFileFromAWSs3Bucket(fileUrl) {
        const url = new URL(fileUrl);
        const key = decodeURIComponent(url.pathname.substring(1)); // Remove leading '/' and decode URI component
        const command = new DeleteObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: key,
        });
        await this.s3.send(command);
        return { message: "File deleted successfully from S3." };
    }
}
