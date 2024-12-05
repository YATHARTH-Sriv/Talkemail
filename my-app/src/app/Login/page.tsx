
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import React, { useEffect } from 'react'
import { FaTwitter } from "react-icons/fa";
import { useRouter } from "next/navigation"

function Page() {
  const { data: session, status } = useSession();
  console.log("session", session);  
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [status, router]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-primary">Welcome to GetSSO</CardTitle>
          <CardDescription className="text-center text-lg">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Button className="h-12 gap-2" onClick={() => signIn("google",{callbackUrl:"/dashboard"})}>Login with Google
            <FcGoogle className="mr-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page