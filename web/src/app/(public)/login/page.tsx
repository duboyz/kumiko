'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTranslations } from 'next-intl'
import { useLogin } from '@shared/hooks'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const KumikoAuthImage = '/icons/kumiko-auth.png'

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginMutation = useLogin()
  const [error, setError] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  const loginSchema = z.object({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(6, t('passwordMinLength')),
  })

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setResetSuccess(true)
      // Clear the query parameter after 5 seconds
      setTimeout(() => setResetSuccess(false), 5000)
    }
  }, [searchParams])

  const fillTestData = () => {
    // form.setValue("email", "test@example.com");
    form.setValue('email', 'john.doe@example.com')
    form.setValue('password', 'password123')
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)

    try {
      await loginMutation.mutateAsync(data)
      // The useLogin hook handles navigation to dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginFailed'))
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:block relative ">
        <div className="flex flex-col justify-center items-center h-full p-8">
          <img
            src={KumikoAuthImage}
            alt="Kumiko Authentication"
            width={400}
            height={400}
            className="object-contain"
            onError={e => {
              console.log('Image failed to load:', e)
              console.log('Image src:', e.currentTarget.src)
            }}
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{t('welcomeBack')}</h2>
            <p className="text-muted-foreground">{t('loginSubtitle')}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('emailPlaceholder')} type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('password')}</FormLabel>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        {t('forgotPassword')}
                      </Link>
                    </div>
                    <FormControl>
                      <Input placeholder={t('passwordPlaceholder')} type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {resetSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  {t('passwordResetSuccess')}
                </div>
              )}

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? t('signingIn') : t('signIn')}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('dontHaveAccount')}{' '}
              <Link href="/register" className="text-primary hover:underline">
                {t('signUp')}
              </Link>
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={fillTestData} className="w-full">
                {t('fillTestData')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
