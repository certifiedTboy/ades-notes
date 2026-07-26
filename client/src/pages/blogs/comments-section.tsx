import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Loader2, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/context/auth-context";
import { Button } from "@/components/ui/button";
import { useComments } from "@/features/context/comment-context";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MarkdownCommentField } from "./markdown-comment-field";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import CommentItem from "./comment-item";

export default function CommentsSection({ postId }: { postId: any }) {
  const [page, setPage] = useState(1);
  const { isAuthenticated: isSignedIn, user } = useAuth();
  const {
    comments,
    addComment,
    commentIsLoading,
    hasMore,
    commentToDelete,
    isDeleteModalOpen,
    deleteComment,
    deleteReply,
    setIsDeleteModalOpen,
    setCommentToDelete,
    onGetComment,
  } = useComments();

  const form = useForm({
    resolver: zodResolver(z.object({ content: z.string().min(1) })),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmitComment = (data: any) => {
    // addComment expects 4 arguments; provide postId, content, user id (if any), and null for optional param
    if (user) {
      addComment(data.content, user?.name, user?.picture, postId, user?._id);
      form.reset();
    }
  };

  useEffect(() => {
    if (postId) {
      onGetComment(postId, page);
    }
  }, [postId, page]);

  return (
    <div className="mt-12">
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        Comments{" "}
        <span className="text-muted-foreground text-base font-normal">
          ({comments?.length})
        </span>
      </h3>
      {isSignedIn ? (
        <div className="mb-8 space-y-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitComment)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MarkdownCommentField
                        field={field}
                        placeholder={`Share your thoughts... 
Use \`\`\` for code blocks.
Paste muched images. or use markdown syntax.`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={!form.watch("content")?.trim()}
                className="cursor-pointer"
                data-testid="button-submit-comment"
              >
                Post Comment
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-muted rounded-xl text-sm text-muted-foreground text-center">
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Post Commnet
          </Link>
        </div>
      )}
      {comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="divide-y divide-border">
          {comments &&
            comments?.length > 0 &&
            comments?.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
              />
            ))}

          {comments?.length > 9 && (
            <div className="text-center py-4">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => hasMore && setPage((p) => p + 1)}
                disabled={commentIsLoading || !hasMore}
                data-testid="button-load-more-comments"
              >
                {commentIsLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
      {commentToDelete?.comment &&
        commentToDelete?.reason === "delete-comment" && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              deleteComment(commentToDelete?.comment?._id, postId);
              setIsDeleteModalOpen(false);
            }}
            title="Delete Comment"
            description={
              <>
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </>
            }
            confirmText="sudo delete"
            // isPending={isDeleting}
          />
        )}

      {commentToDelete?.comment &&
        commentToDelete?.reason === "delete-reply" && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              deleteComment(commentToDelete?.comment?._id, postId);
              setIsDeleteModalOpen(false);
            }}
            title="Delete Comment"
            description={
              <>
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </>
            }
            confirmText="sudo delete"
            // isPending={isDeleting}
          />
        )}

      {commentToDelete?.comment &&
        commentToDelete?.reason === "delete-reply" && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setCommentToDelete(null, "none");
            }}
            onConfirm={() => {
              deleteReply(
                commentToDelete?.comment?.parentId as string,
                postId,
                commentToDelete?.comment?._id,
              );
              setIsDeleteModalOpen(false);
            }}
            title="Delete Comment"
            description={
              <>
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </>
            }
            confirmText="sudo delete"
            // isPending={isDeleting}
          />
        )}
    </div>
  );
}
