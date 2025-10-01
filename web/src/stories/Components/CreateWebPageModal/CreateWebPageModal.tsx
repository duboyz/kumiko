import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useCreatePage } from '@shared'
import { useState } from 'react'
import { FormField } from '@/components/FormField'

interface CreateWebPageModalProps {
    websiteId: string
}

export const CreateWebPageModal = ({ websiteId }: CreateWebPageModalProps) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const { mutate: createPage } = useCreatePage()
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
    })

    const handleCreatePage = () => {
        createPage(
            {
                slug: formData.slug,
                title: formData.title,
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
                seoKeywords: formData.seoKeywords,
                websiteId,
            },
            {
                onSuccess: () => {
                    setIsCreateOpen(false)
                    setFormData({ slug: '', title: '', seoTitle: '', seoDescription: '', seoKeywords: '' })
                },
            }
        )
    }

    return (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
                <Button>Add Page</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Page</DialogTitle>
                    <DialogDescription>Create a new page for your website.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <FormField label="Page Title" htmlFor="pageTitle">
                        <Input
                            id="pageTitle"
                            placeholder="Home"
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Page Slug" htmlFor="pageSlug" helperText="This will be the URL path for your page">
                        <Input
                            id="pageSlug"
                            placeholder="home"
                            type="text"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </FormField>

                    <FormField label="SEO Title (optional)" htmlFor="pageSeoTitle">
                        <Input
                            id="pageSeoTitle"
                            placeholder="Your Restaurant Name - Home"
                            type="text"
                            value={formData.seoTitle}
                            onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                        />
                    </FormField>

                    <FormField label="SEO Description (optional)" htmlFor="pageSeoDescription">
                        <Input
                            id="pageSeoDescription"
                            placeholder="Brief description for search engines"
                            type="text"
                            value={formData.seoDescription}
                            onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                        />
                    </FormField>

                    <FormField label="SEO Keywords (optional)" htmlFor="pageSeoKeywords">
                        <Input
                            id="pageSeoKeywords"
                            placeholder="restaurant, sushi, japanese"
                            type="text"
                            value={formData.seoKeywords}
                            onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })}
                        />
                    </FormField>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" type="button" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="default" type="submit" onClick={handleCreatePage}>
                            Create Page
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
