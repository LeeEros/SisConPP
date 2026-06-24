import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-neutral-surface p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative m-4"
                onClick={handleContentClick} 
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-outline hover:text-neutral-onSurface transition-colors p-1 rounded-full hover:bg-surface-variant"
                    aria-label="Fechar"
                >
                    <X size={24} />
                </button>
                
                {children}
            </div>
        </div>
    );
}