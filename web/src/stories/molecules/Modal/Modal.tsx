import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../atoms/Button/Button";

interface ModalProps {
    title: string
    description: string
    children: React.ReactNode
    isOpen: boolean
    triggerText: string
    setIsOpen: (isOpen: boolean) => void
}

export function Modal({ title, description, children, isOpen, setIsOpen, triggerText }: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">{triggerText}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center">{description}</DialogDescription>
                {children}
            </DialogContent>
        </Dialog>
    )
}