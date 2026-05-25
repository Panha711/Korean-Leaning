"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface SidebarUserProps {
  collapsed: boolean;
  textPrimary: string;
  textMuted: string;
  railBorder: string;
}

export function SidebarUser({
  collapsed,
  textPrimary,
  textMuted,
  railBorder,
}: SidebarUserProps) {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  if (loading || !user) return null;

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        mt: "auto",
        pt: 1.5,
        borderTop: 1,
        borderColor: railBorder,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: collapsed ? 0 : 0.5,
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      <Tooltip title={collapsed ? `${user.name} (${user.email})` : ""}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: alpha("#fff", 0.12),
            color: textPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: 700,
            fontSize: "0.95rem",
            border: 1,
            borderColor: railBorder,
          }}
        >
          {initial}
        </Box>
      </Tooltip>

      {!collapsed ? (
        <>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 700, color: textPrimary, lineHeight: 1.25 }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: textMuted, display: "block", lineHeight: 1.25 }}
            >
              {user.email}
            </Typography>
          </Box>
          <Tooltip title="Sign out">
            <IconButton
              size="small"
              onClick={handleLogout}
              disabled={signingOut}
              aria-label="Sign out"
              sx={{
                color: textMuted,
                "&:hover": { color: textPrimary, bgcolor: alpha("#fff", 0.08) },
              }}
            >
              <LogOut size={16} />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Box>
  );
}
