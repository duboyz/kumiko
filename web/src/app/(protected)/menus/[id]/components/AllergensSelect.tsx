import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAllergens } from "@shared";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AllergensSelectProps {
    selectedAllergenIds: string[];
    onAddAllergens: (allergenIds: string[]) => void;
    onRemoveAllergen: (allergenId: string) => void;
}

export const AllergensSelect = ({ selectedAllergenIds, onAddAllergens, onRemoveAllergen }: AllergensSelectProps) => {
    const { data: allergensData } = useAllergens();
    const [allergenSearch, setAllergenSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [pendingSelections, setPendingSelections] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const doneButtonRef = useRef<HTMLButtonElement>(null);

    const selectedAllergens = allergensData?.filter((a) => selectedAllergenIds.includes(a.id)) || [];

    const allAllergensAdded = allergensData ? selectedAllergenIds.length >= allergensData.length : false;

    const filteredAllergens = allergensData
        ?.filter((allergen) =>
            allergen.name.toLowerCase().includes(allergenSearch.toLowerCase())
        )
        .filter((allergen) => !selectedAllergenIds.includes(allergen.id));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setPendingSelections([]);
                setAllergenSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to ensure dropdown is visible when it opens or when selections change
    useEffect(() => {
        if (isDropdownOpen && dropdownRef.current) {
            setTimeout(() => {
                // Get the dropdown element position
                const dropdown = dropdownRef.current;
                if (!dropdown) return;

                const rect = dropdown.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // Calculate if we need to scroll
                // We want to ensure the dropdown + at least 200px below is visible
                const spaceNeeded = 400; // Input + dropdown + done button
                const bottomSpace = viewportHeight - rect.bottom;

                if (bottomSpace < spaceNeeded) {
                    dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);
        }
    }, [isDropdownOpen, pendingSelections.length]);

    const togglePendingSelection = (allergenId: string) => {
        setPendingSelections((prev) =>
            prev.includes(allergenId)
                ? prev.filter((id) => id !== allergenId)
                : [...prev, allergenId]
        );
    };

    const handleDone = () => {
        if (pendingSelections.length > 0) {
            onAddAllergens(pendingSelections);
            setPendingSelections([]);
            setAllergenSearch('');
            setIsDropdownOpen(false);
        }
    };

    const handleRemoveAllergen = (allergenId: string) => {
        onRemoveAllergen(allergenId);
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground">Allergens</span>

            {/* Display current allergens as badges */}
            {selectedAllergens.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedAllergens.map((allergen) => (
                        <Badge
                            key={allergen.id}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/20 transition-colors"
                            onClick={() => handleRemoveAllergen(allergen.id)}
                        >
                            {allergen.name}
                            <X className="w-3 h-3 ml-1" />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Search input with dropdown - only show if not all allergens are added */}
            {!allAllergensAdded && (
                <div className="relative" ref={dropdownRef}>
                    <Input
                        value={allergenSearch}
                        onChange={(e) => {
                            setAllergenSearch(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Search allergens to add more"
                    />

                    {/* Dropdown */}
                    {isDropdownOpen && filteredAllergens && filteredAllergens.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-50">
                            {/* Scrollable list */}
                            <div className="max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
                                {filteredAllergens.map((allergen) => {
                                    const isSelected = pendingSelections.includes(allergen.id);
                                    return (
                                        <div
                                            key={allergen.id}
                                            onClick={() => togglePendingSelection(allergen.id)}
                                            className={cn(
                                                "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                                                isSelected && "bg-accent"
                                            )}
                                        >
                                            <span className="text-sm">{allergen.name}</span>
                                            {isSelected && <Check className="w-4 h-4 text-primary" />}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Done button - always visible at bottom */}
                            {pendingSelections.length > 0 && (
                                <div className="p-2 border-t bg-muted/50">
                                    <Button
                                        ref={doneButtonRef}
                                        onClick={handleDone}
                                        className="w-full"
                                        size="sm"
                                    >
                                        Add {pendingSelections.length} allergen{pendingSelections.length > 1 ? 's' : ''}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* No results message */}
                    {isDropdownOpen && filteredAllergens && filteredAllergens.length === 0 && allergenSearch && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-50 p-3">
                            <p className="text-sm text-muted-foreground text-center">
                                No allergens found matching "{allergenSearch}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};