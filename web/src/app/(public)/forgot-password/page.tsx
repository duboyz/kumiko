'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useForgotPassword } from '@shared/hooks'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

const KumikoAuthImage = '/icons/kumiko-auth.png'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const forgotPasswordMutation = useForgotPassword()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setError(null)

        try {
            await forgotPasswordMutation.mutateAsync(data)
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.')
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Branding */}
            <div className="hidden lg:block relative">
                <div className="flex flex-col justify-center items-center h-full p-8">
                    <img
                        src={KumikoAuthImage}
                        alt="Kumiko Authentication"
                        width={400}
                        height={400}
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Right side - Forgot Password Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {!success ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Mail className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold">Forgot your password?</h2>
                                <p className="text-muted-foreground mt-2">
                                    No worries! Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name@example.com" type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                                    <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
                                        {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-6">
                                <Link href="/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                            <p className="text-muted-foreground mb-6">
                                If an account exists with <strong>{form.getValues('email')}</strong>, you'll receive a password reset
                                link shortly.
                            </p>
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setSuccess(false)
                                        form.reset()
                                    }}
                                >
                                    Try Another Email
                                </Button>
                                <Link href="/login" className="block">
                                    <Button variant="ghost" className="w-full">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

