export type UIState = {
  modalState: ModalState;
};

export type ModalState = {
  isActive: boolean;
  component: 'music' | 'nightscout' | 'weather' | undefined;
};
