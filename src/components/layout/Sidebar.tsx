"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Languages,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { alpha, useTheme, useMediaQuery } from "@mui/material";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/vocabulary", label: "Words", icon: BookOpen },
  { href: "/grammar", label: "Grammar", icon: Languages },
  { href: "/daily-sentences", label: "Daily Sentences", icon: MessageSquare },
  { href: "/quiz", label: "Quizzes", icon: ClipboardList },
] as const;

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 76;

function useSidebarColors() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const railBg = isDark ? "#0a0f1a" : "#1e293b";
  const railBorder = alpha("#fff", isDark ? 0.08 : 0.1);
  const textPrimary = "#f8fafc";
  const textMuted = alpha("#f8fafc", 0.62);
  const hoverBg = alpha("#fff", 0.06);
  const activeBg = theme.palette.primary.main;

  return { railBg, railBorder, textPrimary, textMuted, hoverBg, activeBg };
}

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const colors = useSidebarColors();

  return (
    <List disablePadding sx={{ flex: 1, px: collapsed ? 0.75 : 1.25, py: 0.5 }}>
      {navItems.map((item) => {
        const isActive =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            prefetch={false}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            sx={{
              borderRadius: 999,
              mb: 0.75,
              py: 1.15,
              px: collapsed ? 1 : 1.5,
              justifyContent: collapsed ? "center" : "flex-start",
              color: isActive ? "#fff" : colors.textPrimary,
              bgcolor: isActive ? colors.activeBg : "transparent",
              boxShadow: isActive ? `0 4px 14px ${alpha(colors.activeBg, 0.45)}` : "none",
              transition: "background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease",
              "&:hover": {
                bgcolor: isActive ? colors.activeBg : colors.hoverBg,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 36,
                justifyContent: "center",
                color: "inherit",
                opacity: isActive ? 1 : 0.88,
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.25 : 2} />
            </ListItemIcon>
            {!collapsed ? (
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.9375rem",
                      letterSpacing: "-0.01em",
                    },
                  },
                }}
              />
            ) : null}
          </ListItemButton>
        );
      })}
    </List>
  );
}

function SidebarContent({
  collapsed,
  onCollapse,
  onNavigate,
  showCollapse,
}: {
  collapsed: boolean;
  onCollapse?: () => void;
  onNavigate?: () => void;
  showCollapse?: boolean;
}) {
  const colors = useSidebarColors();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: colors.railBg,
        color: colors.textPrimary,
        px: collapsed ? 1.25 : 1.5,
        py: 2,
      }}
    >
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 1,
          flexWrap: "nowrap",
        }}
      >
        <Link
          href="/"
          prefetch={false}
          onClick={onNavigate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "inherit",
            minWidth: 0,
            flex: collapsed ? undefined : 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 6px 16px ${alpha("#7c3aed", 0.45)}`,
            }}
          >
            <Sparkles size={20} />
          </Box>
          {!collapsed ? (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: "1.125rem",
                letterSpacing: "-0.02em",
                color: colors.textPrimary,
              }}
              noWrap
            >
              한국어
            </Typography>
          ) : null}
        </Link>

        {showCollapse && onCollapse && !collapsed ? (
          <IconButton
            size="small"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
            sx={{
              flexShrink: 0,
              width: 32,
              height: 32,
              color: colors.textMuted,
              bgcolor: alpha("#fff", 0.06),
              border: 1,
              borderColor: colors.railBorder,
              "&:hover": {
                bgcolor: alpha("#fff", 0.1),
                color: colors.textPrimary,
              },
            }}
          >
            <ChevronLeft size={16} />
          </IconButton>
        ) : null}
      </Box>

      {showCollapse && onCollapse && collapsed ? (
        <IconButton
          size="small"
          onClick={onCollapse}
          aria-label="Expand sidebar"
          sx={{
            alignSelf: "center",
            mb: 1.5,
            width: 32,
            height: 32,
            color: colors.textMuted,
            bgcolor: alpha("#fff", 0.06),
            border: 1,
            borderColor: colors.railBorder,
            "&:hover": {
              bgcolor: alpha("#fff", 0.1),
              color: colors.textPrimary,
            },
          }}
        >
          <ChevronRight size={16} />
        </IconButton>
      ) : null}

      <SidebarNav collapsed={collapsed} onNavigate={onNavigate} />
    </Box>
  );
}

function drawerPaperSx(width: number, railBg: string, railBorder: string) {
  return {
    width,
    boxSizing: "border-box" as const,
    bgcolor: railBg,
    borderRight: 1,
    borderColor: railBorder,
    overflowX: "hidden" as const,
  };
}

export function Sidebar() {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const colors = useSidebarColors();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const width = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  return (
    <>
      {!mobileOpen && !isLgUp ? (
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: colors.railBg,
            color: colors.textPrimary,
            border: 1,
            borderColor: colors.railBorder,
            boxShadow: 2,
            "&:hover": { bgcolor: alpha(colors.railBg, 0.9) },
          }}
        >
          <Menu size={20} />
        </IconButton>
      ) : null}

      <Drawer
        variant="temporary"
        open={mobileOpen && !isLgUp}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": drawerPaperSx(DRAWER_WIDTH, colors.railBg, colors.railBorder),
        }}
      >
        <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            ...drawerPaperSx(width, colors.railBg, colors.railBorder),
            position: "relative",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          showCollapse
        />
      </Drawer>
    </>
  );
}
