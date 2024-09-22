"use client"

import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon, Loader2Icon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import useSendEmail from "@/lib/hooks"
import { getSession, useSession } from "next-auth/react"

export default function EnhancedFeedback() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {sendEmail} = useSendEmail()

  const isFormValid = useMemo(() => rating > 0 && feedback.trim().length > 0, [rating, feedback])

  const handleSubmit = useCallback(async () => {
    const session = await getSession()

    if (!isFormValid) {
      return
    }

    setIsSubmitting(true)
    try {
      const starRating = '⭐'.repeat(rating)

      await sendEmail(
        {
          to: "soravang81@gmail.com",
          subject: "Feedback for dfiverr",
          text: `Rating: ${starRating}\n\n${feedback}\n\nBy ${session?.user?.name},  ${session?.user?.email}`
        }
      )
      console.log({ rating, feedback })
      setIsSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setTimeout(() => {
          setIsSubmitted(false)
          setRating(0)
          setFeedback("")
        }, 300)
      }, 4000)
    } catch (error) {
        toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }, [rating, feedback, isFormValid, sendEmail])

  const cardVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={cardVariants}
        >
          <Card 
            onClick={() => setIsOpen(true)}
            className="bg-purple-800 bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 cursor-pointer transform hover:scale-105">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <StarIcon className="w-8 h-8 text-yellow-400" />
            <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-200">Leave Feedback</h3>
            <p className="text-purple-300">Rate your completed orders</p>
          </CardContent>
        </Card>
        </motion.div>
      </DialogTrigger>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => !isSubmitting && setIsOpen(false)} />
            <DialogContent className="sm:max-w-[425px] z-50">
              <DialogHeader>
                <DialogTitle>Share Your Thoughts</DialogTitle>
                <DialogDescription>
                  Your feedback helps us improve our services. Every opinion matters!
                </DialogDescription>
              </DialogHeader>
              {!isSubmitted ? (
                <div className="grid gap-4 py-4">
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-10 h-10 cursor-pointer transition-all ${
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => !isSubmitting && setRating(star)}
                        onMouseLeave={() => !isSubmitting && setRating(rating)}
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                      />
                    ))}
                  </div>
                  <Textarea
                    placeholder="Your thoughts help us grow. What's on your mind?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="resize-none"
                    rows={4}
                    disabled={isSubmitting}
                    aria-label="Feedback"
                  />
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-center"
                  >
                    Thank you for your valuable feedback!
                  </motion.h3>
                </div>
              )}
            </DialogContent>
          </motion.div>
        )}
    </Dialog>
  )
}