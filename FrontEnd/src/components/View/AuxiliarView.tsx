import { Usuario } from "../../types/Usuario";
import { UserCog } from "lucide-react";
import { CTG } from "../../types/CTG";

interface Props {
    auxiliar: Usuario;
    ctg?: CTG;
}

const formtFuncao = (funcao: string | undefined) => {
    switch (funcao) {
        case "AVALIADOR": return "Avaliador";
        case "AUXILIAR": return "Auxiliar";
        default: return funcao || "Não informado";
    }
};

const formtCredenciamento = (cred: string | undefined) => {
    switch (cred) {
        case "CREDENCIADO": return "Credenciado";
        case "NAO_CREDENCIADO": return "Não Credenciado";
        default: return cred || "Não informado";
    }
};

export default function VisualizacaoAuxiliar({ auxiliar, ctg}: Props) {
    return (
        <div className="w-full max-w-5xl p-4">


            <div className="flex flex-col gap-8">
                {/* Cabeçalho com Nome e Ícone Diferente para Auxiliar */}
                <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                        <UserCog size={48} className="text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 uppercase">{auxiliar.nomeCompleto}</h2>
                        <p className="text-sm text-gray-500 font-medium">Perfil de Auxiliar</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Bloco: Dados Pessoais / Localização */}
                    <div>
                        <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-100 pb-1 text-green-700">
                            Localização & Entidade
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Cidade / Estado</p>
                                <p className="text-base text-gray-700">
                                    {auxiliar.cidade} {auxiliar.estado ? `- ${auxiliar.estado}` : ''}
                                </p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">CTG vinculado</p>
                                <p className="text-base text-gray-700">{ctg?.nomeCTG || "Não vinculado"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bloco: Dados Administrativos */}
                    <div>
                        <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-100 pb-1 text-green-700">
                            Dados Administrativos
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Função</p>
                                <p className="text-base text-gray-700">{formtFuncao(auxiliar.funcao)}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Nº Carteirinha</p>
                                <p className="text-base text-gray-700">{auxiliar.numCarteirinha || "---"}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Situação</p>
                                <p className="text-base text-gray-700">{formtCredenciamento(auxiliar.credenciamento)}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Nº Credenciamento</p>
                                <p className="text-base text-gray-700">{auxiliar.numCredenciamento || "---"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bloco: Acesso */}
                    <div>
                        <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-100 pb-1 text-green-700">
                            Acesso ao Sistema
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Login</p>
                                <p className="text-base text-gray-700 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
                                    {auxiliar.login}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}