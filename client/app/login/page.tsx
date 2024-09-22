"use client"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

import { useSession } from 'next-auth/react'

export default function LoginPage() {
    const { data: session } = useSession()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleGoogleLogin = async () => {
        try {
            await signIn('google', { callbackUrl: '/' })
        } catch (error) {
            console.error("Error during Google login:", error)
            toast.error("Failed to login with Google")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!email || !password) {
            toast.error("Please fill all the fields")
            return
        }
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Logged in successfully")
                // Redirect or update UI as needed
            }
        } catch (error) {
            console.error("Login error:", error)
            toast.error("Failed to login")
        }
    }

    return (
        <div className="min-h-screen ">
            {/* <Navbar session={session} /> */}
            <main className="pt-24 px-4 ">
                <div className="max-w-md mx-auto p-8 rounded-lg shadow-lg border">
                    <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                    <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                            <GoogleIcon/> Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/forgot-password" className="text-sm underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="mt-6 text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

const GoogleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="22px"
      height="22px"
      className="mr-2 inline-block"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}
