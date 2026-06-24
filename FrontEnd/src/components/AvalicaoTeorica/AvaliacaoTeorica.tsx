import { ProvaTeoricaAccordionDTO } from "../../types/Avaliacao";
import ProvaTeorica from "./ProvaTeorica";

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

export default function AvaliacaoTeoricaAccordion({
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
      {provas.map((prova) => (
        <ProvaTeorica
          key={prova.idprovaTeorica}
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
          className="bg-secondary-container text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition duration-300 ease-in-out"
        >
          Salvar Avaliação
        </button>
      </div>
    </div>
  );
}
