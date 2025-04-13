import React from 'react';

// Components
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'file';
}

const FormField = <T extends FieldValues>({ control, name, label, placeholder, type = "text" }: FormFieldProps<T>) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormItem>
      <FormLabel className="label" >{label}</FormLabel>
      <FormControl>
        <Input className="input" placeholder={placeholder} type={type} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}/>
);

export default FormField;
