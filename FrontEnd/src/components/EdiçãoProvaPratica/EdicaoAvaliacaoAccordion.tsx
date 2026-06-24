import { ProvaAccordionDTO } from "../../types/Avaliacao";
import EdicaoProvaAccordion from "./EdicaoProvaAccordion";

interface Props {
  provas: ProvaAccordionDTO[];
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (subQuesitoId: number, nota: number) => void;
  onChangeComentario: (id: number, comentario: string) => void;
  onSalvar: () => void; 
  categoriaSelecionada: number | null;
}

export default function EdicaoAvaliacaoAccordion({
  provas,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
  onSalvar, 
  categoriaSelecionada,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {provas?.map((prova) => (
          <EdicaoProvaAccordion
            key={prova.idProvaPratica || Math.random()}
            prova={prova}
            notas={notas}
            comentarios={comentarios}
            onChangeNota={onChangeNota}
            onChangeComentario={onChangeComentario}
            categoriaSelecionada={categoriaSelecionada}
          />
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSalvar}
          className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-red-700 transition duration-300 ease-in-out shadow-sm flex items-center gap-2"
        >
          Confirmar e Salvar Edição
        </button>
      </div>
    </div>
  );
}