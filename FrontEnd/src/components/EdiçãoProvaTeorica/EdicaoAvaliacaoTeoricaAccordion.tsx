import { ProvaTeoricaAccordionDTO } from "../../types/Avaliacao";
import EdicaoProvaTeorica from "./EdicaoProvaTeorica";

interface Props {
  provas: ProvaTeoricaAccordionDTO[];
  notas: Record<number, number>;
  comentarios: Record<number, string>;

  onChangeNota: (id: number, nota: number) => void;
  onChangeComentario: (quesitoId: number, comentario: string) => void;

  onChangeAnexoGabarito: (file: File | null) => void;
  onChangeAnexoRedacao: (file: File | null) => void;

  onSalvar: () => void;
}

export default function EdicaoAvaliacaoTeoricaAccordion({
  provas,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
  onChangeAnexoGabarito,
  onChangeAnexoRedacao,
  onSalvar,
}: Props) {
  return (
    <div className="space-y-6">
      {provas?.map((prova) => (
        <EdicaoProvaTeorica
          key={prova.idprovaTeorica || Math.random()}
          prova={prova}
          notas={notas}
          comentarios={comentarios}
          onChangeNota={onChangeNota}
          onChangeComentario={onChangeComentario}
          onChangeAnexoGabarito={onChangeAnexoGabarito}
          onChangeAnexoRedacao={onChangeAnexoRedacao}
        />
      ))}

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