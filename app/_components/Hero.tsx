"use client"
import React, { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Loader2, Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select"
import { QUICK_VIDEO_SUGGESTIONS } from '@/data/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { useUser, SignInButton } from '@clerk/nextjs'

function Hero() {
  const [userInput, setUserInput] = useState('');
  const [type, setType] = useState('full-course');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const GenerateCourse = async () => {
    const toastId = toast.loading("Generating Course Layout...");
    
    try {
      setLoading(true);

      // 1. Correct UUID generation inside the try block (Synchronous)
      const courseId = globalThis.crypto?.randomUUID?.();
      if (!courseId) {
        throw new Error("randomUUID not supported");
      }

      const result = await axios.post('/api/generate-course-layout', {
        userInput,
        type,
        courseId: courseId
      });

      console.log(result.data);
      toast.success("Course Layout Generated Successfully", { id: toastId });

      // TODO: navigate to course edit page
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate course layout", { id: toastId });
    } finally {
      // 2. Guaranteed loading state reset
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center flex-col mt-20'>
      <div>
        <h2 className='text-4xl font-bold'>
          Welcome to <span className='text-primary'>VidCourse</span> Ai Generator
        </h2>
        <p className='text-center text-gray-500 mt-4 text-xl'>
          Create Any Topic into Complete Course
        </p>
      </div>

      <div className="grid w-full max-w-xl mt-6 gap-6 bg-white z-10">
        <InputGroup>
          <InputGroupTextarea
            data-slot="input-group-control"
            className="flex field-sizing-content 
                    min-h-24 w-full resize-none rounded-xl 
                    bg-white px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
            placeholder="Enter Your Course Topic "
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <InputGroupAddon align="block-end">
            <Select value={type} onValueChange={(value) => setType(value)}>
              <SelectTrigger className="w-xxs" aria-label="Select course type">
                <SelectValue placeholder="Full Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Choose your course type</SelectLabel>
                  <SelectItem value="full-course">Full Course</SelectItem>
                  <SelectItem value="quick-explain-video">Quick Explain Video</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {user ? (
              <InputGroupButton
                className="ml-auto"
                size="icon-sm"
                variant="default"
                onClick={GenerateCourse}
                disabled={loading}
                // 3. Accessible label for icon-only button
                aria-label={loading ? "Generating course layout" : "Send topic"}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
              </InputGroupButton>
            ) : (
              <SignInButton mode="modal">
                <InputGroupButton 
                  className="ml-auto" 
                  size="icon-sm" 
                  variant="default"
                  aria-label="Sign in to generate course"
                >
                  <Send />
                </InputGroupButton>
              </SignInButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className='flex gap-5 mt-5 max-w-3xl flex-wrap justify-center z-10'>
        {QUICK_VIDEO_SUGGESTIONS.map((suggestion, index) => (
          // 4. Proper button semantics for accessibility
          <button 
            key={index} 
            type="button"
            onClick={() => setUserInput(suggestion?.prompt)}
            className='border rounded-2xl cursor-pointer px-3 py-1.5 text-sm bg-white hover:bg-gray-50 transition-colors'
          >
            {suggestion.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Hero