import { useState } from 'react';
import { PlusCircle, Users } from 'lucide-react';
import SideNavBar from '../components/SideNavBar/SideNavBar';
import Modal from '../../src/components/Modal/Modal';
import { type Candidato } from '../types/Candidato';
import CandidatoList from '../components/Lists/CandidatoList';
import CandidatoForm from '../components/Forms/CandidatoForm';

export default function CandidatoPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [candidatoToEdit, setCandidatoToEdit] = useState<Candidato | undefined>(undefined);

    const openModal = () => {
        setCandidatoToEdit(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCandidatoToEdit(undefined);
        setRefreshList(prev => !prev);
    };

    const handleEdit = (candidato: Candidato) => {
        setCandidatoToEdit(candidato);
        setIsModalOpen(true);
    };

    const handleVisualizar = (candidato: Candidato) => {
        console.log('Visualizar:', candidato);
    };

    const handleCredenciar = (candidato: Candidato) => {
        console.log('Credenciar:', candidato);
    };

    return (
        <div className="flex flex-row min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer">
                                <Users size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Lista de Candidatos</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">Gerencie todos os inscritos</p>
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95"
                        >
                            <PlusCircle size={20} />
                            Adicionar Candidato
                        </button>
                    </div>

                    <div className="w-full">
                        <CandidatoList
                            key={refreshList.toString()}
                            onEdit={handleEdit}
                            onVisualizar={handleVisualizar}
                            onCredenciar={handleCredenciar}
                        />
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CandidatoForm onClose={closeModal} candidatoToEdit={candidatoToEdit} />
            </Modal>
        </div>
    );
}