import { RadioOption } from "@/types/orderForm";

export const createIndexedOptions = (options: RadioOption[], index: number): RadioOption[] => {
    return options.map(option => ({
        ...option,
        id: `${option.id}-${index}`
    }));
};