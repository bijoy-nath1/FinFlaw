import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { AuthFormSchema } from "@/lib/utils";
const formSchema = AuthFormSchema("sign-up");
interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  Label: string;
  name: FieldPath<z.infer<typeof formSchema>>;
  placeholder: string;
}
function CustomInput({ control, Label, name, placeholder }: CustomInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{Label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={Label === "password" ? "password" : "text"}
              className=" input-class"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomInput;
