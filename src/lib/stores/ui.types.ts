export interface UIState {
  modalState: ModalState;
}

export interface ModalState {
  isActive: boolean;
  component: 'music' | 'nightscout' | 'weather' | undefined;
}
