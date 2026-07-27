import { motion } from "framer-motion";
import { PenLine, Target } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-primary/10 p-4 rounded-xl mb-4">
            <PenLine className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground">
            About Ade's Notes
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A space for curiosity, learning, and sharing ideas.
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start gap-8"
          >
            <div className="flex-1">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <Target className="w-7 h-7 text-primary" />
                Our Mission
              </h2>
              <div className="prose dark:prose-invert max-w-none text-lg">
                <p>
                  At Ade's Notes, we believe that knowledge grows when it's
                  shared. Our mission is to create a digital garden where ideas
                  can be planted, nurtured, and allowed to flourish. We aim to
                  provide high-quality, insightful content on web development,
                  design, and personal growth that inspires curiosity and
                  empowers our readers.
                </p>
                <p>
                  We strive to break down complex topics into clear,
                  understandable articles, making learning accessible to
                  everyone, from beginners to seasoned professionals.
                </p>
              </div>

              <div className="prose dark:prose-invert max-w-none text-lg space-y-6 mt-10">
                <p>
                  More importantly, We delve into the exciting world of
                  technology, innovation, and the digital landscape. In this
                  rapidly evolving era, where advancements occur at an
                  unprecedented pace, it is crucial to stay informed and
                  connected to the latest trends, breakthroughs, and
                  transformative ideas that shape our lives.
                </p>

                <p>
                  If you're a tech-savvy professional, an aspiring developer, or
                  simply someone curious about the impact of technology on our
                  daily lives, you'll find a wealth of knowledge and inspiration
                  within these virtual pages.
                </p>

                <p>
                  And if you're here to stay informed, gain inspiration, or
                  simply geek out with fellow tech enthusiasts, we invite you to
                  join us on this exhilarating adventure.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
              Ready to Dive In?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Explore the collection of articles and join a community of curious
              minds.
            </p>
            <Link href="/blogs">
              <Button size="lg" className={"cursor-pointer"}>
                Explore the Blog
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
