import { FileText } from "lucide-react";
import imgLogo from '../../assets/Logo-SisConPP.png';

interface ReportHeaderProps {
  title: string;
  subtitle?: string;
  user: string;
}

export default function TimbradoMTG({ title, subtitle, user }: ReportHeaderProps) {
  const dataEmissao = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="hidden print:block w-full mb-8 border-b-2 border-gray-800 pb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
             <img src={imgLogo} alt="Icon SisConPP"/>
             <FileText size={32} />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              SisConPP
            </h1>
            <p className="text-sm text-gray-600">
              Sistema para Secretaria de Concursos de Prendas e Peões
            </p>
          </div>
        </div>

        <div className="text-right text-sm text-gray-600">
          <p><strong>Emissão:</strong> {dataEmissao}</p>
          <p><strong>Emitido por:</strong> {user}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <h3 className="text-lg font-medium text-gray-700 mt-1">{subtitle}</h3>
        )}
      </div>
    </div>
  );
}