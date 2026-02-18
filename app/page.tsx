import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import CourseList from "./_components/CourseList";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <CourseList />
      <div className="absolute -bottom-10 -left-10 h-125 w-125 bg-sky-500/20 blur-[130px] rounded-full"></div>
      <div className="absolute top-5 left-1/4 h-125 w-125 bg-cyan-400/15 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-50 right-1/4 h-125 w-125 bg-blue-600/10 blur-[140px] rounded-full"></div>
      <div className="absolute top-50 right-[10%] h-125 w-125 bg-teal-500/10 blur-[110px] rounded-full"></div>
    </div>
  );
}
