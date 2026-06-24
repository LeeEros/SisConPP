import { Danca } from "../../types/SorteioDanca";
import { toast } from "react-toastify";

interface DancaListProps {
    dancas: Danca[];
    selecionados: number[];
    toggleSelecionado: (id: number) => void;
    maxSelecionados?: number | null;
}

export default function DancaList({
    dancas,
    selecionados,
    toggleSelecionado,
    maxSelecionados,
}: DancaListProps) {
    const limite = maxSelecionados ?? null;
    const limiteAtingido = limite !== null && selecionados.length >= limite;

    const handleToggle = (id: number, checked: boolean) => {
        // Se está tentando marcar (checked=false vindo da linha) e já atingiu o limite
        if (!checked && limiteAtingido) {
            toast.warning(`Você só pode selecionar até ${limite} dança(s) nesta categoria.`);
            return;
        }
        toggleSelecionado(id);
    };

    return (
        <div className="w-full border border-outline-variant rounded-xl overflow-hidden flex flex-col">
            
            <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                <table className="w-full">
                    <thead className="sticky top-0 z-10 bg-surface-variant/30 text-neutral-onVariant backdrop-blur-sm border-b border-outline-variant">
                        <tr>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-left">Nome da Dança</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right w-24">Seleção</th>
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-outline-variant bg-surface-containerLowest">
                        {dancas.map((d) => {
                            const checked = selecionados.includes(d.idDanca);

                            return (
                                <tr
                                    key={d.idDanca}
                                    onClick={() => handleToggle(d.idDanca, checked)}
                                    className={`
                                        cursor-pointer transition-all duration-200
                                        ${checked 
                                            ? 'bg-primary-container/20 hover:bg-primary-container/30' 
                                            : 'hover:bg-surface-container'
                                        }
                                    `}
                                >
                                    <td className={`p-4 text-sm font-medium ${checked ? 'text-primary-dark font-bold' : 'text-neutral-onSurface'}`}>
                                        {d.nomeDanca}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                readOnly // Controlado pelo onClick da TR
                                                className={`
                                                    w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-transform duration-200
                                                    ${checked ? 'scale-110' : 'scale-100'}
                                                `}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {dancas.length === 0 && (
                    <div className="p-10 text-center text-neutral-onSurface opacity-50">
                        Selecione um tipo de dança acima para carregar a lista.
                    </div>
                )}
            </div>
            
            {/* Rodapé informativo da lista */}
            <div className="bg-surface-variant/20 p-3 text-xs text-center text-neutral-onSurface opacity-70 border-t border-outline-variant">
                Clique nas linhas para selecionar ou desmarcar as danças.
            </div>
        </div>
    );
}