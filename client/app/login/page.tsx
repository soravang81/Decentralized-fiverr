"use client"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Navbar } from '@/components/navbar'
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
                            Login with Google
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


    