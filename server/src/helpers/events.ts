import { isValidObjectId } from "mongoose";
import EventEmitter from "node:events";
import cron, { type ScheduledTask } from "node-cron";
import EmailService from "./smtp.ts";
import type { IPost } from "../posts/posts-model.ts";
import {
  type IEventData,
  type EventTypes,
  type ICommentEvent,
  type IReactionEvent,
  type IUpdateCommentEvent,
} from "../lib/types.ts";
import { PostServices } from "../posts/posts-services.ts";
import { UserServices } from "../users/user-services.ts";

/**
 * @class AppEvents
 * @extends EventEmitter
 * @description A centralized event handling class for the application. It manages emitting and listening to custom events,
 * allowing for a decoupled architecture. For instance, when a new user is created, it emits a 'new-user' event,
 * which then triggers other processes like sending a welcome email.
 */
export class AppEvents extends EventEmitter {
  /**
   * @property {EventTypes[]} events - A list of all valid event names that can be emitted or listened to within the application.
   * This acts as an allowlist to prevent typos and ensure only defined events are used.
   */
  private readonly events: EventTypes[];
  /**
   * @property {Set<string>} activeJobs - A set to track emails for which a job (like sending a verification email) is currently
   * scheduled or running. This is used as a locking mechanism to prevent duplicate jobs for the same user,
   * for example, if multiple 'new-user' events are fired in quick succession for the same email.
   */
  public activeJobs = new Set<string>();
  /**
   * @property {Map<string, ScheduledTask>} scheduledTasks - A map to hold references to the actual cron jobs.
   * The key is the event ID and the value is the task object returned by `node-cron`.
   * This allows us to explicitly stop a scheduled task.
   */
  private scheduledTasks = new Map<string, ScheduledTask>();
  constructor() {
    super();
    this.events = [
      "new-user",
      "user-verified",
      "password-reset",
      "password-changed",
      "add-comment",
      "delete-comment",
      "react-to-post",
      "delete-post",
      "update-post",
      "update-comment",
      "update-post-view-count",
      "delete-s3-file",
      "create-post",
      "news-letter",
    ];

    this.initializeListeners();
  }

  /**
   * Emits an event with the given name and data.
   * It first validates if the event name is one of the predefined events.
   * @template T - The type of the event data payload.
   * @param {EventTypes} name - The name of the event to emit. Must be one of the events in the `this.events` array.
   * @param {IEventData} eventData - The payload to send with the event.
   * @throws {Error} If the event name is not registered in the `this.events` array.
   */
  emitEvent(name: EventTypes, eventData: IEventData) {
    // prevents unauthorized events
    if (!this.events.includes(name)) {
      throw new Error(`Event ${name} does not exist`);
    }

    // Check if a job for this email is already in the queue.
    // This prevents sending multiple emails if the event is emitted multiple times for the same user.
    if (this.activeJobs.has(eventData.id)) {
      console.log(
        `Job for ${eventData.email} is already in the queue. Skipping.`,
      );
      return;
    }

    // emit events
    this.emit(name, eventData);
  }

  /**
   * Cancels a pending event if it exists in the active jobs queue.
   * @param {string} eventId - The ID of the event to cancel.
   * @returns {boolean} - True if the event was found and cancelled, false otherwise.
   */
  public cancelEvent(eventId: string): boolean {
    // Stop and remove the scheduled cron job if it exists
    if (this.scheduledTasks.has(eventId)) {
      const task = this.scheduledTasks.get(eventId);

      task?.stop();
      this.scheduledTasks.delete(eventId);
    }

    // Remove the job from the active jobs lock
    if (this.activeJobs.has(eventId)) {
      this.activeJobs.delete(eventId);
      console.log(`Job with id ${eventId} was cancelled before execution.`);
      return true;
    }
    return false;
  }

  /**
   * Sets up listeners for all the events defined in the `this.events` array upon initialization.
   * This ensures that the application is ready to handle any of its core events from the start.
   */
  private initializeListeners() {
    for (const eventName of this.events) {
      this.listenToEvent(eventName);
      console.log(`Listening to event: ${eventName}`);
    }
  }

  /**
   * Attaches a listener to a specific event. This method contains the logic for what should happen when an event is triggered.
   * Currently, it's configured to handle the 'new-user' event by scheduling a one-time email job.
   * @param {EventTypes} name - The name of the event to listen for.
   */
  private listenToEvent(name: EventTypes) {
    this.on(name, async (eventData: IEventData) => {
      // Add the job ID to the active jobs set to lock it.
      this.activeJobs.add(eventData.id);

      // If there's no delay, run the event immediately without scheduling.
      if (eventData.delayInMinutes === 0) {
        console.log(`Running immediate job for ${eventData.id}`);
        try {
          await this.runEvent(name, eventData);
        } catch (error) {
          console.error(
            `Failed to run immediate job for ${eventData.id}:`,
            error,
          );
        } finally {
          // Unlock the job ID
          this.activeJobs.delete(eventData.id);
        }
      } else {
        // Otherwise, schedule it as a cron job.
        const cronPattern = this.calculateJobPattern(eventData);
        await this.scheduleCronJob(eventData, cronPattern, name);
      }
    });
  }

  private calculateJobPattern(eventData: IEventData) {
    const scheduledTime = new Date(
      Date.now() + eventData.delayInMinutes * 60 * 1000,
    );

    console.log(
      `Add event to queue for ${eventData.id} to run at ${scheduledTime.toLocaleTimeString()}`,
    );

    // Dynamically create a cron pattern that matches the exact future time for one-time execution.
    // The pattern is "seconds minutes hours day-of-month month day-of-week".
    // The '*' for day-of-week means it will run regardless of the day.
    return `${scheduledTime.getSeconds()} ${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${
      scheduledTime.getMonth() + 1
    } *`;
  }

  private async scheduleCronJob(
    eventData: IEventData,
    cronPattern: string,
    name: EventTypes,
  ) {
    // Schedule the task with node-cron.
    const task = cron.schedule(cronPattern, async () => {
      try {
        await this.runEvent(name, eventData);
      } catch (error) {
        console.error(
          `Failed to run scheduled job for ${eventData.id}:`,
          error,
        );
      } finally {
        // The `finally` block ensures that we clean up, regardless of success or failure.
        // Remove the email from the active jobs set to unlock it for future jobs.
        this.activeJobs.delete(eventData.id);
        // Remove the task from our map of scheduled tasks
        this.scheduledTasks.delete(eventData.id);
        // Stop the cron job to ensure it doesn't run again and to free up resources.
        task.stop();
      }
    });

    // Store the scheduled task so we can potentially cancel it later
    this.scheduledTasks.set(eventData.id, task);
  }

  extractS3Urls(content: string): string[] {
    const regex =
      /https:\/\/itakuroso-files\.s3\.eu-west-2\.amazonaws\.com\/[^\s)"']+/g;

    return content.match(regex) ?? [];
  }

  private async runEvent(name: EventTypes, eventData: IEventData) {
    switch (name) {
      case "new-user":
        // Use the EmailService to send a welcome email with the OTP.
        await EmailService.sendEmail(
          [eventData?.email!],
          "Welcome! Verify Your Account",
          "create-account",
          { name: eventData.firstName, otp: eventData.otp },
        );
        console.log(`Verification email sent to ${eventData.email}`);
        break;

      case "user-verified":
        await EmailService.sendEmail(
          [eventData?.email!],
          "Account Verified!",
          "account-verified",
          { name: eventData.firstName },
        );
        console.log(`Verification email sent to ${eventData.email}`);
        break;

      case "password-reset":
        await EmailService.sendEmail(
          [eventData?.email!],
          "Password Reset Request",
          "password-reset",
          { name: eventData.firstName, otp: eventData.otp },
        );
        console.log(`Password reset email sent to ${eventData.email}`);
        break;

      case "password-changed":
        await EmailService.sendEmail(
          [eventData?.email!],
          "Your Password Has Been Changed",
          "password-changed",
          { name: eventData.firstName },
        );
        console.log(`Password changed confirmation sent to ${eventData.email}`);
        break;

      case "create-post":
        if (eventData.postId && eventData.postData) {
          const newsLetterEmails = await UserServices.getAllNewLetterEmails();

          if (newsLetterEmails && newsLetterEmails.length > 0) {
            await EmailService.sendBulkEmail<IPost>(
              newsLetterEmails,
              eventData?.postData?.title!,
              "new-post",
              eventData.postData.toObject(),
            );

            console.log(
              `Post update with ${eventData.postId} sent  via event.`,
            );
          }
        }
        break;

      case "update-post":
        if (eventData.postId && eventData.postData) {
          await PostServices.updatePost(eventData.postId, eventData.postData);
          console.log(`Post ${eventData.postId} updated via event.`);
        }
        break;

      case "delete-post":
        if (eventData.postId) {
          const result = await PostServices.deletePost(eventData.postId);

          if (result && result?.post && result?.post.content) {
            const s3Urls = this.extractS3Urls(result.post.content);

            if (s3Urls && s3Urls.length > 0) {
              for (const url of s3Urls) {
                this.emitEvent("delete-s3-file", {
                  id: `delete-s3-file-${url}`,
                  delayInMinutes: 0.5,
                  url,
                });
              }
            }
          }
          console.log(`Post ${eventData.postId} deleted via event.`);
        }
        break;

      case "add-comment":
        const commentData = eventData as ICommentEvent;
        await PostServices.addComment(
          commentData.postId,
          commentData.authorId,
          commentData.content,
          commentData.parentId,
          commentData.tempId,
        );
        console.log(`Comment added to post ${commentData.postId} via event.`);
        break;

      case "delete-comment":
        let result;
        if (eventData.commentId) {
          if (isValidObjectId(eventData.commentId)) {
            // This event is now a fallback for when immediate cancellation fails.
            result = await PostServices.deleteComment(eventData.commentId);
            console.log(
              `Comment ${eventData.commentId} deleted from DB via event.`,
            );
          } else {
            // This event is now a fallback for when immediate cancellation fails.
            result = await PostServices.deleteCommentByTempId(
              eventData?.commentId,
            );
            console.log(
              `Comment ${eventData.commentId} deleted from DB via event.`,
            );
          }
        }

        if (result && result?.comment && result?.comment.content) {
          const s3Urls = this.extractS3Urls(result.comment.content);
          if (s3Urls && s3Urls.length > 0) {
            for (const url of s3Urls) {
              this.emitEvent("delete-s3-file", {
                id: `delete-s3-file-${url}`,
                delayInMinutes: 0.5,
                url,
              });
            }
          }
        }
        break;

      case "react-to-post":
        const reactionData = eventData as IReactionEvent;
        await PostServices.addOrUpdateReaction(
          reactionData.postId,
          reactionData.authorId,
          reactionData.type,
        );
        console.log(`Reaction added to post ${reactionData.postId} via event.`);
        break;

      case "update-comment":
        const updateCommentData = eventData as IUpdateCommentEvent;
        await PostServices.updateComment(
          updateCommentData.commentId,
          updateCommentData.content,
        );
        console.log(
          `Comment ${updateCommentData.commentId} updated via event.`,
        );
        break;

      case "update-post-view-count":
        if (eventData.postId) {
          await PostServices.updatePostViewCount(eventData.postId);
          console.log(
            `Post view count for ${eventData.postId} updated via event.`,
          );
        }
        break;

      case "delete-s3-file":
        if (eventData.url) {
          await PostServices.deleteFileFromAWSs3Bucket(eventData.url);
          console.log(`S3 file ${eventData.url} deleted via event.`);
        }
      default:
        break;
    }
  }
}

/**
 * A singleton instance of the AppEvents class.
 * This ensures that the entire application uses the same event emitter instance,
 * so that an event emitted in one part of the app can be heard by a listener in another.
 */
const eventEmitter = new AppEvents();

export default eventEmitter;
