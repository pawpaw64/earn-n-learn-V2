import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps {
    enabled: boolean;
    onClick: () => void;
}

export const PrevButton: React.FC<ButtonProps> = ({ enabled, onClick }) => (
    <button
        className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200",
            enabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={!enabled}
    >
        <ChevronLeft className="h-5 w-5" />
    </button>
);

export const NextButton: React.FC<ButtonProps> = ({ enabled, onClick }) => (
    <button
        className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200",
            enabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={!enabled}
    >
        <ChevronRight className="h-5 w-5" />
    </button>
);

interface DotButtonProps {
    selected: boolean;
    onClick: () => void;
}

export const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
    <button
        className={cn(
            "w-3 h-3 rounded-full transition-all duration-200",
            selected ? "bg-white" : "bg-white/50 hover:bg-white/75"
        )}
        onClick={onClick}
    />
);