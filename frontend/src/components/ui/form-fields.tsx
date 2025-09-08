import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
    label: string;
    required?: boolean;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    required,
    icon: Icon,
    children,
    className = "",
}) => (
    <div className={`space-y-2 ${className}`}>
        <Label className="text-sm font-medium flex items-center gap-1">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {required && <span className="text-red-500">*</span>}
        </Label>
        {children}
    </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
    icon?: LucideIcon;
}

export const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    required, 
    icon, 
    className,
    ...props 
}) => (
    <FormField label={label} required={required} icon={icon} className={className}>
        <Input {...props} />
    </FormField>
);

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    required?: boolean;
    icon?: LucideIcon;
    options: SelectOption[];
    placeholder?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    required,
    icon,
    options,
    placeholder,
    className,
    ...props
}) => (
    <FormField label={label} required={required} icon={icon} className={className}>
        <Select {...props}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </FormField>
);

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    required?: boolean;
    icon?: LucideIcon;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ 
    label, 
    required, 
    icon, 
    className,
    ...props 
}) => (
    <FormField label={label} required={required} icon={icon} className={className}>
        <Textarea {...props} />
    </FormField>
);

interface RadioOption {
    value: string;
    label: string;
    id: string;
}

interface RadioFieldProps {
    label: string;
    required?: boolean;
    options: RadioOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({ 
    label, 
    required, 
    options, 
    className,
    ...props 
}) => (
    <FormField label={label} required={required} className={className}>
        <RadioGroup {...props} className="flex space-x-4">
            {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.id} />
                    <Label htmlFor={option.id}>{option.label}</Label>
                </div>
            ))}
        </RadioGroup>
    </FormField>
);