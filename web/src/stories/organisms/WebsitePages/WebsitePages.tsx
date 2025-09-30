
import { Button } from "@/stories/atoms/Button/Button";
import { Card } from "@/stories/molecules/Card";
import { LabeledInput } from "@/stories/molecules/LabeledInput/LabeledInput";
import { Modal } from "@/stories/molecules/Modal/Modal";
import { useCreatePage, WebsitePageDto } from "@shared";
import Link from "next/link";
import { useState } from "react";

interface WebsitePagesProps {
    websitePages: WebsitePageDto[]
    websiteId: string
}
export function WebsitePages({ websitePages, websiteId }: WebsitePagesProps) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {websitePages.map((websitePage) => (
                    <WebsitePageCard key={websitePage.id} websitePage={websitePage} />
                ))}
            </div>
            <CreateWebPageModal websiteId={websiteId} />
        </div>
    )
}




const WebsitePageCard = ({ websitePage }: { websitePage: WebsitePageDto }) => {

    return (
        <Card title={websitePage.title} description={<p>/{websitePage.slug}</p>}>
            <Link href={`/websites/${websitePage.websiteId}/pages/${websitePage.id}`}>Edit</Link>
        </Card>
    )
}



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
        createPage({
            slug: formData.slug,
            title: formData.title,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            seoKeywords: formData.seoKeywords,
            websiteId,
        }, {
            onSuccess: () => {
                setIsCreateOpen(false)
                setFormData({ slug: '', title: '', seoTitle: '', seoDescription: '', seoKeywords: '' })
            }
        })
    }
    return (
        <Modal title="Create Page" description="Create a new page for your website." isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} triggerText="Add Page">
            <LabeledInput
                label="Page Title"
                placeholder="Page Title"
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e })}
                id="pageTitle"
                srOnly={false}
            />
            <LabeledInput
                label="Page SEO Title"
                placeholder="Page SEO Title"
                type="text"
                value={formData.seoTitle}
                onChange={e => setFormData({ ...formData, seoTitle: e })}
                id="pageSeoTitle"
                srOnly={false}
            />
            <LabeledInput
                label="Page Slug"
                placeholder="Page Slug"
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e })}
                id="pageSlug"
                srOnly={false}
            />
            <LabeledInput
                label="Page SEO Description"
                placeholder="Page SEO Description"
                type="text"
                value={formData.seoDescription}
                onChange={e => setFormData({ ...formData, seoDescription: e })}
                id="pageSeoDescription"
                srOnly={false}
            />
            <LabeledInput
                label="Page SEO Keywords"
                placeholder="Page SEO Keywords"
                type="text"
                value={formData.seoKeywords}
                onChange={e => setFormData({ ...formData, seoKeywords: e })}
                id="pageSeoKeywords"
                srOnly={false}
            />
            <Button variant="default" type="submit" onClick={handleCreatePage}>Create Page</Button>
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
        </Modal>
    )
}