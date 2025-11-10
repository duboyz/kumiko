'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useTranslations } from 'next-intl'
import { useRegister } from '@shared/hooks'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
}

export default function RegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const registerMutation = useRegister()
  const [error, setError] = useState<string | null>(null)

  const registerSchema = z
    .object({
      email: z.string().email(t('invalidEmail')),
      password: z.string().min(6, t('passwordMinLength')),
      confirmPassword: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    })

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null)

    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      // The useRegister hook handles navigation to dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registerFailed'))
    }
  }

  const fillTestData = () => {
    form.setValue('firstName', 'John')
    form.setValue('lastName', 'Doe')
    form.setValue('email', 'john.doe@example.com')
    form.setValue('password', 'password123')
    form.setValue('confirmPassword', 'password123')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:block relative ">
        <div className="flex flex-col justify-center items-center h-full p-8">
          <img
            src="/icons/kumiko-auth.png"
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

      {/* Right side - Register Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{t('createAccount')}</h2>
            <p className="text-muted-foreground">{t('registerSubtitle')}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('firstName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('firstNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('lastName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('lastNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('createPasswordPlaceholder')} type="password" {...field} />
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
                      <Input placeholder={t('confirmPasswordPlaceholder')} type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? t('creatingAccount') : t('signUp')}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-primary hover:underline">
                {t('signIn')}
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
