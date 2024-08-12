export interface HueSensor {
  name: string;
  id: number;
}

export interface HueAction {
  light: {
    name: string;
    id: string;
    on: boolean;
    actionType: string;
  };
}

export interface HomeDevices {
  hue: {
    lights: HueAction[];
    sensors: HueSensor[];
  };
}
