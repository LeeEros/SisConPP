import { useState } from "react";
import { ProvaTeoricaAccordionDTO } from "../../types/Avaliacao";
import QuesitoCard from "./QuesitoCard";

interface Props {
  prova: ProvaTeoricaAccordionDTO;
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (id: number, nota: number) => void;
  onChangeComentario: (quesitoId: number, comentario: string) => void;
  onChangeAnexoGabarito: (file: File | null) => void;
  onChangeAnexoRedacao: (file: File | null) => void;
}

export default function ProvaTeoricaAccordion({
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
      className={`bg-white rounded-xl border shadow-sm ${open
          ? "border-primary ring-1 ring-primary/30"
          : "border-neutral-outline"
        }`}
    >

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-bold">{prova.nomeProva}</h3>
          </div>
        </div>
      </div>

      {open && (
        <div className="p-4 bg-gray-50 space-y-6">
     
          {prova.quesitos.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Nenhum quesito cadastrado.
            </p>
          )}

          {prova.quesitos.map((quesito) => (
            <QuesitoCard
              key={quesito.idQuesito}
              comentarios={comentarios}
              quesito={quesito}
              notas={notas}
              onChangeNota={onChangeNota}
              onChangeComentario={onChangeComentario}
            />
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexo do Gabarito
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  onChangeAnexoGabarito(e.target.files?.[0] ?? null)
                }
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-primary/10 file:text-primary
                  hover:file:bg-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexo da Redação
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  onChangeAnexoRedacao(e.target.files?.[0] ?? null)
                }
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-primary/10 file:text-primary
                  hover:file:bg-primary/20"
              />
            </div>
          </div>


        </div>
      )}
    </div>
  );
}
