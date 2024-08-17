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

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface XYBri {
  x: number;
  y: number;
  bri: number;
}
