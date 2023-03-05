export type FlowerBase = {
  id: string;
  name: string;
  directoryUrl: string;
};

export type FlowerAdditional = {
  place?: string;
  watering?: string;
  soil?: string;
  fertilization?: string;
  replanting?: string;
};

export type Flower = FlowerBase & FlowerAdditional;
