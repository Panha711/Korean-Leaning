"use client";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { alpha, useTheme } from "@mui/material/styles";

export interface SearchFieldWithClearProps
  extends Omit<TextFieldProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchFieldWithClear({
  value,
  onChange,
  onClear,
  placeholder = "Search Korean · English · Khmer",
  size = "small",
  fullWidth = true,
  ...rest
}: SearchFieldWithClearProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const hasQuery = value.trim().length > 0;
  const fieldBg = isDark ? alpha("#fff", 0.04) : alpha("#000", 0.03);
  const fieldBorder = isDark ? alpha("#fff", 0.1) : alpha("#000", 0.08);

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <TextField
      {...rest}
      fullWidth={fullWidth}
      size={size}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          bgcolor: fieldBg,
          minHeight: 44,
          "& fieldset": { borderColor: fieldBorder },
          "&:hover fieldset": { borderColor: alpha(theme.palette.primary.main, 0.35) },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1.5,
          },
        },
        ...rest.sx,
      }}
      slotProps={{
        ...rest.slotProps,
        input: {
          ...rest.slotProps?.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: hasQuery ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label="Clear search"
                edge="end"
                sx={{ mr: -0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
