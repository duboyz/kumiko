import { Switch } from "@/components/ui/switch";

interface ItemTypeSwitchProps {
    value: 'simple' | 'options';
    onChange: (value: 'simple' | 'options') => void;
}

export const ItemTypeSwitch = ({ value, onChange }: ItemTypeSwitchProps) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-sm font-bold">This item has options</h2>
                <p className="text-sm text-muted-foreground">Add multiple options to the menu item</p>
            </div>
            <Switch 
                checked={value === 'options'} 
                onCheckedChange={(checked: boolean) => onChange(checked ? 'options' : 'simple')} 
                className="scale-120" 
            />
        </div>
    );
};

