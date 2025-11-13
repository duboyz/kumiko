'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTranslations } from 'next-intl'
import { useResetPassword } from '@shared/hooks'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff } from 'lucide-react'

const KumikoAuthImage = '/icons/kumiko-auth.png'

type ResetPasswordFormValues = {
    newPassword: string
    confirmPassword: string
}

function ResetPasswordForm() {
    const t = useTranslations('auth')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const searchParams = useSearchParams()
    const resetPasswordMutation = useResetPassword()
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    const resetPasswordSchema = z
        .object({
            newPassword: z.string().min(8, t('passwordMinLength8')),
            confirmPassword: z.string().min(8, t('passwordMinLength8')),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
            message: t('passwordsDontMatch'),
            path: ['confirmPassword'],
        })

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    })

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        if (!tokenParam) {
            setError(t('invalidToken'))
        } else {
            setToken(tokenParam)
        }
    }, [searchParams, t])

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!token) {
            setError(t('invalidToken'))
            return
        }

        setError(null)

        try {
            await resetPasswordMutation.mutateAsync({
                token,
                newPassword: data.newPassword,
            })
            // The useResetPassword hook handles navigation to login
        } catch (err) {
            setError(err instanceof Error ? err.message : t('resetFailed'))
        }
    }

    if (!token && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-muted-foreground">{tCommon('loading')}</p>
                </div>
            </div>
        )
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

            {/* Right side - Reset Password Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Lock className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">{t('resetPasswordTitle')}</h2>
                        <p className="text-muted-foreground mt-2">{t('resetPasswordSubtitle')}</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('newPassword')}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder={t('newPasswordPlaceholder')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('confirmPassword')}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder={t('confirmPasswordPlaceholder')}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                            <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending || !token}>
                                {resetPasswordMutation.isPending ? t('resetting') : t('resetPassword')}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                            {t('backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    const tCommon = useTranslations('common')

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-muted-foreground">{tCommon('loading')}</p>
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    )
}

