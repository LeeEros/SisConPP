import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Danca, SorteioDanca, DancaSalaoTradicional } from "../../types/SorteioDanca";
import { realizarSorteio } from "../../services/api";
import { toast } from "react-toastify";
import { Dices, Sparkles} from "lucide-react"; 
import pointerImg from '../../assets/poniter.png';

interface RoletaProps {
  candidatoId: number;
  usuarioId: number;
  tipoDanca: DancaSalaoTradicional;
  dancas: Danca[];
  onFinish: (resultado: Danca) => void;
}

interface SorteioResponse {
  message: string;
  sorteio: SorteioDanca;
  dancaSorteada: Danca;
}

export default function RoletaSorteio({
  candidatoId,
  usuarioId,
  tipoDanca,
  dancas,
  onFinish,
}: RoletaProps) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const data = dancas.map((d) => ({
    option: d.nomeDanca.length > 18 ? d.nomeDanca.substring(0, 18) + "..." : d.nomeDanca,
    fullName: d.nomeDanca
  }));
  const backgroundColors = [
    '#3A6A00', 
    '#E24E6E', 
    '#9ED768',
    '#FFB2BC'  
  ];

  const textColors = ['#FFFFFF', '#FFFFFF', '#0E2000', '#400012']; 

  const sortear = async () => {
    if (isSpinning) return;

    if (!candidatoId || !tipoDanca) {
      toast.error("Selecione candidato e tipo de dança antes de sortear.");
      return;
    }

    try {
      const payload = { candidatoId, usuarioId, tipoDanca };
      const response = await realizarSorteio(payload);
      const sorteioResponse = response.data as SorteioResponse;
      const { dancaSorteada } = sorteioResponse;

      if (!dancaSorteada) {
        toast.warn(sorteioResponse.message || "Sorteio já realizado.");
        return;
      }

      const index = dancas.findIndex((danca) => danca.idDanca === dancaSorteada.idDanca);

      if (index >= 0) {
        setPrizeNumber(index);
        setMustSpin(true);
        setIsSpinning(true);
      } else {
        toast.error("Erro: Dança sorteada não listada.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Erro ao realizar sorteio.");
      setIsSpinning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full animate-fadeIn">
      <div className="relative p-4 rounded-full border-4 border-neutral-container shadow-2xl mb-8 bg-surface-containerLowest">


        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          backgroundColors={backgroundColors}
          textColors={textColors}
          outerBorderColor='#E1E3DA'
          outerBorderWidth={4}
          innerBorderColor='#E1E3DA'
          innerBorderWidth={0}
          radiusLineColor='#E1E3DA'
          radiusLineWidth={1}
          pointerProps={{
            src: pointerImg
          }}

          fontSize={14}
          perpendicularText={true}
          textDistance={60}

          onStopSpinning={() => {
            setMustSpin(false);
            setIsSpinning(false);
            const resultado = dancas[prizeNumber];
            onFinish(resultado);
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-surface-containerLowest rounded-full shadow-inner flex items-center justify-center z-10 border-4 border-neutral-container">
          <div className="w-4 h-4 bg-secondary rounded-full animate-pulse" style={{ backgroundColor: '#E24E6E' }}></div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-bold text-neutral-onSurface opacity-50 uppercase tracking-widest">
          {isSpinning ? "Sorteando..." : "Boa Sorte!"}
        </p>

        <button
          onClick={sortear}
          disabled={isSpinning}
          className={`
                flex items-center gap-3 px-12 py-3.5 rounded-xl font-bold text-lg shadow-md transition-all transform
                ${isSpinning
              ? "bg-neutral-container text-neutral-onSurface opacity-50 cursor-not-allowed scale-95 shadow-none"
              : "bg-primary text-primary-on hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            }
            `}
        >
          {isSpinning ? <Sparkles className="animate-spin" /> : <Dices />}
          {isSpinning ? "Girando..." : "GIRAR"}
        </button>
      </div>
    </div>
  );
}