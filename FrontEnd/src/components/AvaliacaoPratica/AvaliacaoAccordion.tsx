import { ProvaAccordionDTO } from "../../types/Avaliacao";
import ProvaAccordion from "./ProvaAccordion";

interface Props {
  provas: ProvaAccordionDTO[];
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (subQuesitoId: number, nota: number) => void;
  onChangeComentario: (id: number, comentario: string) => void;
  onSalvar: () => void; 
  categoriaSelecionada: number | null;
}

export default function AvaliacaoAccordion({
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
        {provas.map((prova) => (
          <ProvaAccordion
            key={prova.idProvaPratica}
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
          className="bg-secondary-container text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition duration-300 ease-in-out"
        >
          Salvar Avaliação
        </button>
      </div>
    </div>
  );
}