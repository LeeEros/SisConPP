import { X, CircleAlert, CheckCircle } from "lucide-react";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title?: string; // Opcional: Adicionei para dar um título ao modal se quiser
    type?: 'danger' | 'info'; // Opcional: Para mudar a cor do ícone
}

export default function Dialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    message, 
    title = "Atenção", // Título padrão
    type = 'danger' 
}: DialogProps) {
    
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn">
            <div 
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
                role="dialog"
                aria-modal="true"
            >
                {/* Botão Fechar Absolute */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    
                    {/* Ícone com Fundo Suave */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                        isDanger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                        {isDanger ? (
                            <CircleAlert size={32} />
                        ) : (
                            <CheckCircle size={32} />
                        )}
                    </div>

                    {/* Conteúdo de Texto */}
                    <h3 className="text-xl font-bold text-neutral-800 mb-2">
                        {title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                        {message}
                    </p>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-5 py-3 rounded-xl border border-outline text-neutral-600 font-semibold hover:bg-neutral-50 transition-colors focus:ring-2 focus:ring-neutral-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-5 py-3 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95 ${
                                isDanger 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                                : 'bg-primary hover:bg-primary-dark shadow-primary/30'
                            }`}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}