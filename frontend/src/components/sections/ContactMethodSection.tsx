import React from "react";
import { InputField, TextareaField, RadioField } from "@/components/ui/form-fields";
import { Phone, Mail, User } from "lucide-react";
import { CONTACT_OPTIONS } from "@/constants/orderFormConstants";
import { FormData } from "@/types/orderForm";

interface ContactMethodSectionProps {
    formData: Pick<FormData, 'contactMethod' | 'fax' | 'deliveryResponsePerson' | 'email' | 'email2' | 'email3' | 'emailCc1' | 'emailCc2' | 'emailCc3' | 'deliveryMemo'>;
    handleInputChange: (field: string, value: string) => void;
}

export const ContactMethodSection: React.FC<ContactMethodSectionProps> = ({ 
    formData, 
    handleInputChange 
}) => {
    return (
        <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">連絡方法</h3>

            <div className="space-y-4">
                <RadioField
                    label=""
                    options={CONTACT_OPTIONS}
                    value={formData.contactMethod}
                    onValueChange={(value) =>
                        handleInputChange("contactMethod", value)
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="FAX番号"
                        icon={Phone}
                        placeholder="例: 03-1234-5678"
                        value={formData.fax}
                        onChange={(e) =>
                            handleInputChange("fax", e.target.value)
                        }
                    />

                    <InputField
                        label="納期回答担当者"
                        icon={User}
                        placeholder="例: 山田太郎"
                        value={formData.deliveryResponsePerson}
                        onChange={(e) =>
                            handleInputChange(
                                "deliveryResponsePerson",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="メールアドレス"
                        icon={Mail}
                        type="email"
                        placeholder="例: example@example.com"
                        value={formData.email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                    />

                    <InputField
                        label="メールアドレス2"
                        icon={Mail}
                        type="email"
                        placeholder="例: example2@example.com"
                        value={formData.email2}
                        onChange={(e) =>
                            handleInputChange("email2", e.target.value)
                        }
                    />
                </div>

                <InputField
                    label="メールアドレス3"
                    icon={Mail}
                    type="email"
                    placeholder="例: example3@example.com"
                    value={formData.email3}
                    onChange={(e) =>
                        handleInputChange("email3", e.target.value)
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                        <InputField
                            key={num}
                            label={`CCメールアドレス${num}`}
                            type="email"
                            placeholder={`例: cc${num}@example.com`}
                            value={formData[`emailCc${num}` as keyof FormData]}
                            onChange={(e) =>
                                handleInputChange(
                                    `emailCc${num}`,
                                    e.target.value
                                )
                            }
                        />
                    ))}
                </div>

                <TextareaField
                    label="送り状備考"
                    value={formData.deliveryMemo}
                    onChange={(e) =>
                        handleInputChange("deliveryMemo", e.target.value)
                    }
                    rows={2}
                />
            </div>
        </div>
    );
};