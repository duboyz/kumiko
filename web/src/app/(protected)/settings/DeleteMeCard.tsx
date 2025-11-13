'use client'

import { useState, useMemo, useEffect } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'
import { useCurrentUser } from '@shared'
import { useDeleteMe } from '@shared/hooks/userHooks'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function DeleteMeCard() {
    const t = useTranslations()
    const router = useRouter()
    const { data: user } = useCurrentUser()
    const { mutate: deleteMe, isPending } = useDeleteMe()

    const [isOpen, setIsOpen] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setConfirmText('')
        }
    }, [isOpen])

    const isConfirmTextValid = useMemo(() => {
        return confirmText === `delete ${user?.email}`
    }, [confirmText, user?.email])

    const isFormValid = useMemo(() => {
        return email === user?.email && password.length > 0
    }, [email, password, user?.email])

    const handleConfirmDelete = () => {
        if (!isConfirmTextValid || !user?.id) return

        deleteMe(
            { userId: user.id, email, password },
            {
                onSuccess: () => {
                    toast.success(t('settings.accountDeleted'))
                    setIsOpen(false)
                    router.replace('/login')
                },
                onError: () => {
                    toast.error(t('settings.failedToDeleteAccount'))
                },
            }
        )
    }

    return (
        <>
            <Card className="border-destructive/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <CardTitle>{t('settings.dangerZone')}</CardTitle>
                    </div>
                    <CardDescription>{t('settings.dangerZoneDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('settings.confirmEmail')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={user?.email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">{t('settings.confirmPassword')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('settings.enterPassword')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button variant="destructive" onClick={() => setIsOpen(true)} disabled={!isFormValid || isPending} className="w-fit">
                                {t('settings.deleteAccount')}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('settings.confirmDeleteTitle')}</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>{t('settings.confirmDeleteDescription')}</p>
                            <p>
                                {t('settings.typeToConfirm')}{' '}
                                <span className="font-mono px-2 py-1 bg-muted rounded text-foreground select-none">delete {user?.email}</span>
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder={t('settings.typeHere')}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            disabled={isPending}
                            autoFocus
                        />
                    </div>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={!isConfirmTextValid || isPending}>
                            {isPending ? t('common.deleting') : t('settings.confirmDelete')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}