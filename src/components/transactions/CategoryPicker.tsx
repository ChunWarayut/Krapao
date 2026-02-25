"use client"

import { Category } from '@/types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryPickerProps {
    categories: Category[];
    selectedId: string;
    onSelect: (id: string) => void;
    type: 'income' | 'expense';
}

export default function CategoryPicker({ categories, selectedId, onSelect, type }: CategoryPickerProps) {
    const filtered = categories.filter(c => c.type === type);

    return (
        <div className="grid grid-cols-3 gap-3">
            {filtered.map((cat) => {
                const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon] || Icons.HelpCircle;
                const isSelected = selectedId === cat.id;

                return (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.id)}
                        className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95",
                            isSelected
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                : "bg-emerald-900/30 text-emerald-200/60 hover:bg-emerald-900/50"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-xl",
                            isSelected ? "bg-white/20" : "bg-transparent"
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight wrap-break-word hyphens-auto mt-1">
                            {cat.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
