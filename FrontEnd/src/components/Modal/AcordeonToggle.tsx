import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export default function AcordeonToggle({ isOpen, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 flex items-center justify-center
        rounded-md transition-all
        ${isOpen 
          ? "bg-green-700 text-white" 
          : "bg-green-600 text-white hover:bg-green-700"}
      `}
    >
      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}