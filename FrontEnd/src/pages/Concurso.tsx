import { useState } from "react";
import { PlusCircle, Trophy } from "lucide-react"; // Usei Trophy para representar Concurso
import { Concurso } from "../types/Concurso";
import SideNavBar from '../components/SideNavBar/SideNavBar';
import Modal from '../../src/components/Modal/Modal';
import ConcursoList from "../components/Lists/ConcursoList";
import ConcursoForm from "../components/Forms/ConcursoForm";

export default function ConcursoPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [concursoToEdit, setConcursoToEdit] = useState<Concurso | undefined>(undefined);

    const openModal = () => {
        setConcursoToEdit(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setConcursoToEdit(undefined);
        setRefreshList(prev => !prev);
    };

    const handleEdit = (concurso: Concurso) => {
        setConcursoToEdit(concurso);
        setIsModalOpen(true);
    };

    const handleVisualizar = (concurso: Concurso) => console.log('Visualizar', concurso);
    const handleCredenciar = (concurso: Concurso) => console.log('Credenciar', concurso);

    return (
        <div className="flex flex-row min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
                
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Concursos</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">Gerencie os eventos e editais</p>
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <PlusCircle size={20} />
                            Adicionar Concurso
                        </button>
                    </div>

                    <div className="w-full">
                        <ConcursoList
                            key={refreshList.toString()}
                            onEdit={handleEdit}
                            onVisualizar={handleVisualizar}
                            onCredenciar={handleCredenciar}
                        />
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ConcursoForm onClose={closeModal} concursoToEdit={concursoToEdit} />
            </Modal>
        </div>
    );
}