import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

const PhoneInput = forwardRef(({ value, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    let raw = e.target.value;

    // Faqat raqamlarni qoldiramiz
    let digits = raw.replace(/\D/g, "");

    // Agar foydalanuvchi "998" bilan boshlagan bo'lsa, uni olib tashlaymiz (keyin qaytadan qo'shamiz)
    if (digits.startsWith("998")) {
      digits = digits.slice(3);
    }

    // Faqat 9 ta raqamgacha qoldiramiz (masalan 901234567)
    digits = digits.slice(0, 9);

    const formatted = digits.length > 0 ? `+998${digits}` : "";
    onChange(formatted);
  };

  return (
    <Input
      ref={ref}
      type="tel"
      placeholder="+998901234567"
      value={value || ""}
      onChange={handleChange}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;