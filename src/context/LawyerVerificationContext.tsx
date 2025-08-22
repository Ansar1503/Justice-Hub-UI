import { ReactNode, useState, createContext } from "react";
import { AlertVerificationModal } from "@/components/Lawyer/Modals/AlertVerification";
import LawyerVerificationFormModal from "@/components/Lawyer/Modals/LawyerVerificationFormModal";

type LawyerVerificationContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  //   toggleModal: () => void;
};

export const LawyerVerificationContext = createContext<
  LawyerVerificationContextType | undefined
>(undefined);

export const LawyerVerificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  //   const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <LawyerVerificationContext.Provider
      value={{ isOpen, openModal, closeModal }}
    >
      {children}
      {isOpen && (
        <AlertVerificationModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setVerificationForm={setFormOpen}
        />
      )}
      {formOpen && (
        <LawyerVerificationFormModal setVerificationModalOpen={setFormOpen} />
      )}
    </LawyerVerificationContext.Provider>
  );
};
