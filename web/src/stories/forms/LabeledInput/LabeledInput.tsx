import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LabeledInputProps {
    id: string;
    label: string;
    value: string;
    type?: 'text' | 'number';
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    variant?: 'input' | 'textarea';
    error?: string;
}

export const LabeledInput = ({
    id,
    label,
    value,
    type = 'text',
    onChange,
    placeholder,
    className,
    disabled = false,
    variant = 'input',
    error
}: LabeledInputProps) => {
    return (
        <div className={`flex flex-col gap-2 ${className || ''}`}>
            <Label htmlFor={id} className="text-xs font-bold text-muted-foreground">
                {label}
            </Label>

            {variant === 'input' ? (
                <Input
                    id={id}
                    value={value}
                    type={type}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    step={type === 'number' ? '0.01' : undefined}
                    min={type === 'number' ? '0' : undefined}
                    disabled={disabled}
                    className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                />
            ) : (
                <Textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                />
            )}

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
};

