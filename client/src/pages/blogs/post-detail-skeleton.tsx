import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function PostDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* ReadingProgress is a fixed element, doesn't need a skeleton */}
      <div className="w-full max-h-[500px] overflow-hidden">
        <Skeleton className="w-full h-[500px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center">
        <Skeleton className="h-4 w-48 mx-auto mt-2" />
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10">
        <div className="sticky top-16 bg-background/95 backdrop-blur-md z-10 py-4 -mx-4 px-4 mb-4">
          <Link href="/blogs">
            {" "}
            {/* Keep the actual Link for navigation */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center cursor-pointer gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </motion.button>
          </Link>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <Skeleton className="inline-block h-6 w-24 rounded-full mb-4" />

          <Skeleton className="h-10 w-3/4 mb-6" />

          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />

          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground ml-auto">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-24 w-full" /> {/* Code block */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-8">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full mt-8" /> {/* Reactions Panel */}
        {/* CommentsSection will handle its own loading state */}
      </div>
    </div>
  );
}
