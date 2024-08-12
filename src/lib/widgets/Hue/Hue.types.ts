export interface HueSensor {
  name: string;
  id: number;
}

export interface HueAction {
  light: {
    name: string;
    id: number;
    on: boolean;
    actionType: string;
  };
}

export interface HomeDevices {
  hue: {
    actions: HueAction[];
    sensors: HueSensor[];
  };
}
