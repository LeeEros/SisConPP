import { useState } from "react";
import { Edit3 } from "lucide-react";
import { ProvaTeoricaAccordionDTO } from "../../types/Avaliacao";
import EdicaoQuesitoCardTeorico from "./EdicaoQuesitoCardTeorico";

interface Props {
  prova: ProvaTeoricaAccordionDTO;
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (id: number, nota: number) => void;
  onChangeComentario: (quesitoId: number, comentario: string) => void;
  onChangeAnexoGabarito: (file: File | null) => void;
  onChangeAnexoRedacao: (file: File | null) => void;
}

export default function EdicaoProvaTeorica({
  prova,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
  onChangeAnexoGabarito,
  onChangeAnexoRedacao,
}: Props) {
  const [open] = useState(true);

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition-all overflow-hidden ${
        open ? "border-red-400 ring-1 ring-red-400/30" : "border-neutral-outline"
      }`}
    >
      <div className="flex items-center justify-between p-4 bg-red-50/30">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {prova?.nomeProva || "Prova Teórica"}
              <Edit3 size={16} className="text-red-500 opacity-70" />
            </h3>
          </div>
        </div>
      </div>

      {open && (
        <div className="p-4 bg-gray-50 space-y-6">
          {(!prova?.quesitos || prova.quesitos.length === 0) && (
            <p className="text-sm text-gray-400 italic">
              Nenhum quesito cadastrado.
            </p>
          )}

          {prova?.quesitos?.map((quesito) => (
            <EdicaoQuesitoCardTeorico
              key={quesito.idQuesito}
              comentarios={comentarios}
              quesito={quesito}
              notas={notas}
              onChangeNota={onChangeNota}
              onChangeComentario={onChangeComentario}
            />
          ))}
          
          {/* Seção de Anexos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Substituir Anexo do Gabarito (Opcional)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onChangeAnexoGabarito(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-red-50 file:text-red-700
                  hover:file:bg-red-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Substituir Anexo da Redação (Opcional)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onChangeAnexoRedacao(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-red-50 file:text-red-700
                  hover:file:bg-red-100 transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}