"use client";

import * as React from "react";
import TextField from "@mui/material/TextField";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, id, name, onChange, onBlur, value, defaultValue, disabled, placeholder, autoComplete, "aria-invalid": ariaInvalid, ...rest }, ref) => {
    return (
      <TextField
        id={id}
        name={name}
        type={type}
        inputRef={ref}
        fullWidth
        size="small"
        variant="outlined"
        placeholder={placeholder}
        value={value as string | undefined}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>}
        error={ariaInvalid === true || ariaInvalid === "true"}
        autoComplete={autoComplete}
        className={cn(className)}
        slotProps={{
          htmlInput: rest,
        }}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
