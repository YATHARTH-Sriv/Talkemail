"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { useSession } from 'next-auth/react';

function StarOnGitHubButton() {
  return (
    <Link
      href="https://github.com/YATHARTH-Sriv/Talkemail" // Replace with your GitHub repository link
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-700 transition"
    >
      {/* GitHub Logo */}
      
      <FaGithub />
      {/* Button Text */}
      <span>Star on GitHub</span>
    </Link>
  );
}


export default function LandingPage() {
  // const {data:session}=useSession()
  // console.log(session)
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-white">
                talkEmail
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <div className="bg-white bg-opacity-10 px-6 py-2 rounded-full">
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Docs
                  </Link>
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Pricing
                  </Link>
                  <Link href="https://yatharthportfolio.vercel.app/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    About Me
                  </Link>
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Company
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Link href={"/Login"}>
              <Button className="ml-8 bg-white text-black hover:bg-gray-200">Lets Manage Emails</Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Button  className="text-white border-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center gap-2">
            <StarOnGitHubButton/>
            <h1 className="text-4xl tracking-tight mt-2 font-extrabold sm:text-5xl md:text-6xl">
              <span className="block text-white">Lets Manage Your Emails</span>
              <span className="block text-gray-400 mt-2 text-shadow">in a smart way</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black md:py-4 md:text-md md:px-10 gap-2 rounded-lg hover:animate-bounce hover:bg-white hover:text-black">
                  Get Started<FaArrowRightToBracket />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  )
}
