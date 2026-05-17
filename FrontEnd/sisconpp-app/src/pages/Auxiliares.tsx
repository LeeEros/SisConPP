import { useState } from "react";
import { PlusCircle, User } from "lucide-react";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import AuxiliaresList from "../components/Lists/AuxiliaresList";
import Modal from "../components/Modal/Modal";
import AuxiliarForm from "../components/Forms/AuxiliarForm";
import { Usuario } from "../types/Usuario";

export default function AuxiliaresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [auxiliarToEdit, setAuxiliarToEdit] = useState<Usuario | undefined>(undefined);

    const openModal = () => {
        setAuxiliarToEdit(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAuxiliarToEdit(undefined);
        setRefreshList(prev => !prev);
    };

    const handleEdit = (auxiliar: Usuario) => {
        setAuxiliarToEdit(auxiliar);
        setIsModalOpen(true);
    };

    // Funções placeholder
    const handleVisualizar = (auxiliar: Usuario) => console.log('Visualizar:', auxiliar);
    const handleCredenciar = (auxiliar: Usuario) => console.log('Credenciar:', auxiliar);

    return (
        <div className="flex flex-row min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
                
                {/* CARD UNIFICADO */}
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
                    
                    {/* CABEÇALHO */}
                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <User size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Auxiliares</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">Gerencie a equipe de apoio e seus acessos</p>
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <PlusCircle size={20} />
                            Adicionar Auxiliar
                        </button>
                    </div>

                    {/* LISTA */}
                    <div className="w-full">
                        <AuxiliaresList
                            key={refreshList.toString()}
                            onEdit={handleEdit}
                            onVisualizar={handleVisualizar}
                            onCredenciar={handleCredenciar}
                        />
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AuxiliarForm onClose={closeModal} auxiliarToEdit={auxiliarToEdit} />
            </Modal>
        </div>
    );
}