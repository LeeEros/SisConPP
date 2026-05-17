import { useState } from "react";
import { PlusCircle, Users } from "lucide-react"; // Users para Comissão
import SideNavBar from "../components/SideNavBar/SideNavBar";
import ComissaoList from "../components/Lists/ComissaoList";
import Modal from "../components/Modal/Modal";
import ComissaoForm from "../components/Forms/ComissaoForm";
import { Comissao } from "../types/Comissao";

export default function ComissaoPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [comissaoToEdit, setComissaoToEdit] = useState<Comissao | undefined>(undefined);

    const openModal = () => {
        setComissaoToEdit(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setComissaoToEdit(undefined);
        setRefreshList(prev => !prev);
    };

    const handleEdit = (comissao: Comissao) => {
        setComissaoToEdit(comissao);
        setIsModalOpen(true);
    }

    return (
        <div className="flex flex-row min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">

                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <Users size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Comissões Avaliadoras</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">Gerencie grupos de avaliação e atribuições</p>
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <PlusCircle size={20} />
                            Adicionar Comissão
                        </button>
                    </div>

                    <div className="w-full">
                        <ComissaoList
                            key={refreshList.toString()}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ComissaoForm onClose={closeModal} comissaoToEdit={comissaoToEdit} />
            </Modal>
        </div>
    );
}
