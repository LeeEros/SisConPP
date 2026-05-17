import { useState } from 'react';
import { PlusCircle, Building2 } from 'lucide-react'; // Ícone Building2 para CTGs
import SideNavBar from '../components/SideNavBar/SideNavBar';
import CTGList from '../../src/components/Lists/CTGList';
import Modal from '../../src/components/Modal/Modal';
import CTGForm from '../../src/components/Forms/CTGForm';
import type { CTG } from '../../src/types/CTG';

export default function CTGPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [ctgToEdit, setCtgToEdit] = useState<CTG | undefined>(undefined);

  const openModal = () => {
    setCtgToEdit(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCtgToEdit(undefined);
    setRefreshList(prev => !prev);
  };

  const handleEdit = (ctg: CTG) => {
    setCtgToEdit(ctg);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-row min-h-screen w-full bg-neutral-background">
      <SideNavBar />

      <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
        
        <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
            
            {/* CABEÇALHO */}
            <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary-dark">CTGs</h1>
                        <p className="text-sm text-neutral-onSurface opacity-70">Gerencie os Centros de Tradições Gaúchas</p>
                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                >
                    <PlusCircle size={20} />
                    Adicionar CTG
                </button>
            </div>

            {/* LISTA */}
            <div className="w-full">
                <CTGList key={refreshList.toString()} onEdit={handleEdit} />
            </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CTGForm onClose={closeModal} ctgToEdit={ctgToEdit} />
      </Modal>
    </div>
  );
}