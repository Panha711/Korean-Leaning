"use client";

import * as React from "react";
import {
  FormControl,
  Select as MuiSelect,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { cn } from "@/lib/utils";

type SelectItemData = { value: string; label: React.ReactNode };

const defaultMenuProps = {
  disableScrollLock: true,
  slotProps: {
    root: {
      sx: { zIndex: 1500 },
    },
    paper: {
      elevation: 8,
      sx: {
        maxHeight: 280,
        mt: 0.5,
        bgcolor: "background.paper",
        color: "text.primary",
        backgroundImage: "none",
      },
    },
    list: {
      sx: { py: 0.5 },
    },
  },
} as const;

function collectSelectConfig(children: React.ReactNode) {
  const items: SelectItemData[] = [];
  let placeholder = "Select…";
  let triggerClassName: string | undefined;
  let triggerId: string | undefined;
  let ariaInvalid: boolean | undefined;

  const walk = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (node) => {
      if (!React.isValidElement(node)) return;
      const props = node.props as {
        children?: React.ReactNode;
        value?: string;
        className?: string;
        id?: string;
        "aria-invalid"?: boolean;
        placeholder?: string;
      };

      const type = node.type as { displayName?: string; name?: string };

      if (
        node.type === SelectContent ||
        type?.displayName === "SelectContent"
      ) {
        walk(props.children);
        return;
      }

      if (node.type === SelectItem || type?.displayName === "SelectItem") {
        items.push({
          value: props.value as string,
          label: props.children,
        });
        return;
      }

      if (node.type === SelectTrigger || type?.displayName === "SelectTrigger") {
        triggerClassName = props.className;
        triggerId = props.id;
        ariaInvalid = props["aria-invalid"];
        React.Children.forEach(props.children, (child) => {
          if (React.isValidElement(child) && child.type === SelectValue) {
            const valueProps = child.props as { placeholder?: string };
            placeholder = valueProps.placeholder ?? placeholder;
          }
        });
        return;
      }

      if (props.children) {
        walk(props.children);
      }
    });
  };

  walk(children);
  return { items, placeholder, triggerClassName, triggerId, ariaInvalid };
}

export interface SelectProps {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  /** Prefer this over compound children when possible */
  options?: SelectItemData[];
  placeholder?: string;
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
}

export function Select({
  children,
  value: controlledValue,
  onValueChange,
  defaultValue,
  options,
  placeholder: placeholderProp,
  id,
  className,
  "aria-invalid": ariaInvalidProp,
}: SelectProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const config = React.useMemo(() => {
    if (options?.length) {
      return {
        items: options,
        placeholder: placeholderProp ?? "Select…",
        triggerClassName: className,
        triggerId: id,
        ariaInvalid: ariaInvalidProp,
      };
    }
    return collectSelectConfig(children);
  }, [children, options, placeholderProp, className, id, ariaInvalidProp]);

  const value = controlledValue ?? internal;

  const handleChange = (event: SelectChangeEvent<string>) => {
    const next = event.target.value;
    setInternal(next);
    onValueChange?.(next);
  };

  return (
    <FormControl
      fullWidth
      size="small"
      error={Boolean(config.ariaInvalid)}
      className={cn(config.triggerClassName)}
      sx={{ overflow: "visible" }}
    >
      <MuiSelect
        id={config.triggerId}
        variant="outlined"
        displayEmpty
        value={value}
        onChange={handleChange}
        MenuProps={defaultMenuProps}
        sx={{
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": {
            top: 0,
          },
          "& .MuiOutlinedInput-notchedOutline legend": {
            display: "none",
          },
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span style={{ opacity: 0.55 }}>{config.placeholder}</span>
            );
          }
          const item = config.items.find((i) => i.value === selected);
          return item?.label ?? selected;
        }}
      >
        {config.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

export function SelectGroup(_props: { children?: React.ReactNode }) {
  return null;
}

SelectGroup.displayName = "SelectGroup";

export function SelectValue(_props: { placeholder?: string }) {
  return null;
}

SelectValue.displayName = "SelectValue";

export function SelectTrigger(_props: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
}) {
  return null;
}

SelectTrigger.displayName = "SelectTrigger";

export function SelectContent(_props: { children?: React.ReactNode }) {
  return null;
}

SelectContent.displayName = "SelectContent";

export function SelectItem(_props: { value: string; children: React.ReactNode }) {
  return null;
}

SelectItem.displayName = "SelectItem";
