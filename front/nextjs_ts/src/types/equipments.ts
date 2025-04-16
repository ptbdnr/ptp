export interface Equipment {
    id: string;
    name: string;
    quantity: number;
};

export interface Equipments {
    equipments: Equipment[];
};

export interface EquipmentsContextType {
    equipments: Equipments | null;
    setEquipments: (equipments: Equipments | null) => void;
    isLoading: boolean;
    error: string | null;
};