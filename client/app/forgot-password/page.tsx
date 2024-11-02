"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import useSendEmail from "@/lib/hooks"
import { resetPassword } from "../actions/others/utils"

export default function ForgetPasswordPage() {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [step, setStep] = useState('email')
    const { sendEmail } = useSendEmail()

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!email) {
            toast.error("Please enter your email")
            return
        }
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            setLoading(true)
            await sendEmail({
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is: ${otp}`,
                html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`
            })
            setLoading(false)
            localStorage.setItem('resetPasswordOTP', otp)
            localStorage.setItem('resetPasswordEmail', email)

            toast.success("OTP sent to your email. Please check your inbox.")
            setStep('otp')
        } catch (error) {
            console.error("Forget password error:", error)
            toast.error("Failed to send OTP. Please try again later.")
            setLoading(false)
        }
    }

    const handleSubmitOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!otp) {
            toast.error("Please enter the OTP")
            return
        }
        const storedOTP = localStorage.getItem('resetPasswordOTP')
        if (otp === storedOTP) {
            toast.success("OTP verified successfully.")
            setStep('newPassword')
        } else {
            console.log(storedOTP)
            toast.error("Invalid OTP. Please try again.")
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!newPassword) {
            toast.error("Please enter a new password")
            return
        }
        const storedEmail = localStorage.getItem('resetPasswordEmail')
        if (!storedEmail) {
            toast.error("Email not found. Please start the process again.")
            return
        }
        try {
            await resetPassword(storedEmail, newPassword)
            toast.success("Password reset successfully. You can now log in with your new password.")
            localStorage.removeItem('resetPasswordOTP')
            localStorage.removeItem('resetPasswordEmail')
        } catch (error) {
            console.error("Password reset error:", error)
            toast.error("Failed to reset password. Please try again.")
        }
    }

    return (
        <div className="min-h-screen ">
            <main className="pt-24 px-4 ">
                <div className="max-w-md mx-auto p-8 rounded-lg shadow-lg border">
                    <h1 className="text-3xl font-bold mb-6 text-center">Forget Password</h1>
                    {step === 'email' && (
                        <form onSubmit={handleSubmitEmail} className="space-y-4">
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
                            <Button disabled={loading} type="submit" className="w-full">
                                Send OTP
                            </Button>
                        </form>
                    )}
                    {step === 'otp' && (
                        <form onSubmit={handleSubmitOtp} className="space-y-4">
                            <div>
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter the 65-digit OTP"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Verify OTP
                            </Button>
                        </form>
                    )}
                    {step === 'newPassword' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Reset Password
                            </Button>
                        </form>
                    )}
                    <div className="mt-6 text-center">
                        Remember your password?{" "}
                        <Link href="/login" className="underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
