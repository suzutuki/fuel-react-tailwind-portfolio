import { useCallback } from "react";
import { OrderDetail } from "@/types/orderForm";

interface UseFieldChangeProps {
    index: number;
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
}

export const useFieldChange = ({ index, handleDetailChange }: UseFieldChangeProps) => {
    const createFieldHandler = useCallback((field: keyof OrderDetail) => {
        return (value: string) => handleDetailChange(index, field, value);
    }, [index, handleDetailChange]);

    const createInputHandler = useCallback((field: keyof OrderDetail) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => 
            handleDetailChange(index, field, e.target.value);
    }, [index, handleDetailChange]);

    return {
        createFieldHandler,
        createInputHandler
    };
};