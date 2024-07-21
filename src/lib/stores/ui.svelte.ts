import type { ModalState, UIState } from '$types';

export const createUiState = () => {
  const ui: UIState = $state({
    modalState: {
      isActive: false,
      component: undefined,
    },
  });

  return {
    modal: (): ModalState => {
      return ui.modalState;
    },

    modalActive: (): ModalState['isActive'] => {
      return ui.modalState.isActive;
    },

    setModal: (state: ModalState) => {
      ui.modalState = state;
    },
  };
};

export const uiState = createUiState();
