import React from 'react';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PublicKey } from '@solana/web3.js';

interface SellerFormInputProps {
  label: string;
  required: boolean;
  onChange: (value: string | File | null | number | PublicKey) => void;
  value: string | File | null | number | PublicKey;
  id: string;
  type?: string;
}

export const SellerFormInput: React.FC<SellerFormInputProps> = ({
  label,
  required,
  onChange,
  value,
  id,
  type = 'text'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'file') {
      onChange(e.target.files?.[0] || null);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex gap-20 items-center ">
      <Label
        htmlFor={id}
        className="text-lg font-normal text-slate-600"
      >
        {label}{required && <span className="text-red-600">*</span>}
      </Label>
      <Input
        required={required}
        id={id}
        value={type !== 'file' ? value as string : undefined}
        type={type}
        onChange={handleChange}
        className="max-w-72"
        accept={type === 'file' ? 'image/*' : undefined}
      />
    </div>
  );
};
export const CustomSelect = (id: string, label: string, value: string, onChange: (value: string) => void, options: string[], placeholder: string, disabled: boolean = false) => (
  <div className="flex gap-20 ">
    <Label htmlFor={id} className="text-lg font-normal text-slate-600 flex items-center">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </Label>
    <Select onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id} className="w-[280px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="max-h-72 overflow-y-scroll">
          {options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);