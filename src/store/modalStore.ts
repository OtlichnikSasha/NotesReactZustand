import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type IModalStore = ModalState & ModalActions;

interface ModalState {
  isOpen: boolean;
  content: null | JSX.Element;
  options: IOption | null;
}

interface ModalActions {
  handleOpenModal: (content: ModalState['content'], options?: IOption) => void;
  closeModal: () => void;
}

interface IOption {
  title?: string;
  overlayClassName?: string;
  bodyClassName?: string;
  containerClassName?: string;
  withCloseButton?: boolean;
}

export const useModalStore = create(
  immer<IModalStore>((set) => ({
    isOpen: false,
    content: null,
    options: null,
    handleOpenModal: (content, options) => {
      set((state) => {
        state.isOpen = true;
        state.content = content;
        if (options) state.options = options;
      });
    },
    closeModal: () => {
      set((state) => {
        state.isOpen = false;
        state.content = null;
        state.options = null;
      });
    },
  })),
);
