import { useState } from 'react';
import { PlusCircle, BookText } from 'lucide-react';
import SideNavBar from '../components/SideNavBar/SideNavBar';
import AvaliadorList from '../../src/components/Lists/AvaliadoresList';
import Modal from '../../src/components/Modal/Modal';
import AvaliadorForm from '../../src/components/Forms/AvaliadoresForm';
import type { Usuario } from '../../src/types/Usuario';

export default function AvaliadoresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [avaliadorToEdit, setAvaliadorToEdit] = useState<Usuario | undefined>(undefined);

    const openModal = () => {
        setAvaliadorToEdit(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAvaliadorToEdit(undefined);
        setRefreshList(prev => !prev);
    };

    const handleEdit = (avaliador: Usuario) => {
        setAvaliadorToEdit(avaliador);
        setIsModalOpen(true);
    };

    const handleVisualizar = (avaliador: Usuario) => console.log('Visualizar:', avaliador);
    const handleCredenciar = (avaliador: Usuario) => console.log('Credenciar:', avaliador);

    return (
        <div className="flex flex-row min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
                
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <BookText size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Avaliadores</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">Gerencie a comissão avaliadora e seus acessos</p>
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <PlusCircle size={20} />
                            Adicionar Avaliador
                        </button>
                    </div>

                    <div className="w-full">
                        <AvaliadorList
                            key={refreshList.toString()}
                            onEdit={handleEdit}
                            onVisualizar={handleVisualizar}
                            onCredenciar={handleCredenciar}
                        />
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AvaliadorForm onClose={closeModal} avaliadorToEdit={avaliadorToEdit} />
            </Modal>
        </div>
    );
}