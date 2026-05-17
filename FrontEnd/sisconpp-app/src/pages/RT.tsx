import { useState } from 'react';
import { PlusCircle, Map } from 'lucide-react'; // Usei 'Map' para representar Região
import SideNavBar from '../components/SideNavBar/SideNavBar';
import RTList from '../../src/components/Lists/RTLists';
import Modal from '../../src/components/Modal/Modal';
import RTForm from '../../src/components/Forms/RTForm';
import type { RT } from '../../src/types/RT';

function RTPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [rtToEdit, setRtToEdit] = useState<RT | undefined>(undefined);

  const openModal = () => {
    setRtToEdit(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRtToEdit(undefined);
    setRefreshList(prev => !prev);
  };

  const handleEdit = (rt: RT) => {
    setRtToEdit(rt);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-row min-h-screen w-full bg-neutral-background">
      <SideNavBar />

      <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
        
        <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
            <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                        <Map size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary-dark">Regiões Tradicionalistas</h1>
                        <p className="text-sm text-neutral-onSurface opacity-70">Gerencie as RTs do sistema</p>
                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                >
                    <PlusCircle size={20} />
                    Adicionar RT
                </button>
            </div>
            <div className="w-full">
                <RTList key={refreshList.toString()} onEdit={handleEdit} />
            </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <RTForm onClose={closeModal} rtToEdit={rtToEdit} />
      </Modal>
    </div>
  );
}

export default RTPage;