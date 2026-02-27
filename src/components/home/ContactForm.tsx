"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 p-6 sm:p-10 shadow-2xl shadow-emerald-500/5">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
      
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="relative space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1">First Name</label>
                <Input 
                  placeholder="Enter your first name" 
                  required 
                  className="bg-white/50 dark:bg-slate-950/30 backdrop-blur-md border-white/50 dark:border-slate-800/50 focus:bg-white/80 transition-all h-12 rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1">Last Name</label>
                <Input 
                  placeholder="Enter your last name" 
                  required 
                  className="bg-white/50 dark:bg-slate-950/30 backdrop-blur-md border-white/50 dark:border-slate-800/50 focus:bg-white/80 transition-all h-12 rounded-xl" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1">Email Address</label>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                required 
                className="bg-white/50 dark:bg-slate-950/30 backdrop-blur-md border-white/50 dark:border-slate-800/50 focus:bg-white/80 transition-all h-12 rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1">Subject</label>
              <Input 
                placeholder="Enter subject" 
                required 
                className="bg-white/50 dark:bg-slate-950/30 backdrop-blur-md border-white/50 dark:border-slate-800/50 focus:bg-white/80 transition-all h-12 rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1">Message</label>
              <Textarea 
                placeholder="Enter your message..." 
                className="min-h-[150px] bg-white/50 dark:bg-slate-950/30 backdrop-blur-md border-white/50 dark:border-slate-800/50 focus:bg-white/80 transition-all rounded-xl resize-none p-4" 
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl text-lg shadow-lg shadow-emerald-200 transition-all group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Send Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="mb-6 rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
            <p className="text-muted-foreground max-w-[280px]">
              Thank you for reaching out. Our team will get back to you within 24 hours.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitted(false)}
              className="mt-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              Send another message
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
