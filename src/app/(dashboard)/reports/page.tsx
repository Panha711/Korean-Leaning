"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import FlagIcon from "@mui/icons-material/Flag";
import Link from "next/link";
import { StudyPageHeader } from "@/components/layout/StudyPageHeader";
import { DeckFilterChips } from "@/components/layout/DeckFilterChips";
import { useCurrentUser } from "@/hooks/use-current-user";

type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED";

interface Report {
  id: string;
  wordId: string;
  wordKorean: string;
  wordEnglish: string;
  wordKhmer: string;
  suggestedKorean?: string | null;
  suggestedEnglish?: string | null;
  suggestedKhmer?: string | null;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string | null;
  user?: { id: string; name: string; email: string };
}

const statusColor: Record<ReportStatus, "warning" | "success" | "default"> = {
  PENDING: "warning",
  RESOLVED: "success",
  REJECTED: "default",
};

export default function ReportsPage() {
  const theme = useTheme();
  const { isAdmin } = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ReportStatus>("PENDING");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/word-reports");
      const data = (await res.json()) as { reports?: Report[] };
      setReports(data.reports ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setStatus = async (id: string, status: ReportStatus) => {
    setPendingAction(id);
    try {
      await fetch(`/api/word-reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await refresh();
    } finally {
      setPendingAction(null);
    }
  };

  const applySuggestion = async (r: Report) => {
    setPendingAction(r.id);
    try {
      const res = await fetch(
        `/api/global-overrides/${encodeURIComponent(r.wordId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            korean: r.suggestedKorean ?? undefined,
            english: r.suggestedEnglish ?? undefined,
            khmer: r.suggestedKhmer ?? undefined,
          }),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to apply override");
      }
      await fetch(`/api/word-reports/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setPendingAction(null);
    }
  };

  const visible = reports.filter((r) => filter === "all" || r.status === filter);
  const counts = {
    all: reports.length,
    PENDING: reports.filter((r) => r.status === "PENDING").length,
    RESOLVED: reports.filter((r) => r.status === "RESOLVED").length,
    REJECTED: reports.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "calc(100dvh - 7rem)", sm: "calc(100dvh - 10.5rem)" },
        minHeight: "28rem",
      }}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <StudyPageHeader
            icon={FlagIcon}
            title={isAdmin ? "Reports" : "My reports"}
            accent="#dc2626"
          />
        </Box>
        <DeckFilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { id: "PENDING", label: `Pending (${counts.PENDING})` },
            { id: "RESOLVED", label: `Resolved (${counts.RESOLVED})` },
            { id: "REJECTED", label: `Rejected (${counts.REJECTED})` },
            { id: "all", label: `All (${counts.all})` },
          ]}
        />
      </Stack>

      <Card sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <CardContent sx={{ flex: 1, minHeight: 0, p: 0, "&:last-child": { pb: 0 } }}>
          <Box
            className="scrollbar-styled-slim"
            sx={{ height: "100%", overflow: "auto", overscrollBehavior: "contain" }}
          >
            {loading ? (
              <Typography sx={{ py: 8, textAlign: "center" }} color="text.secondary">
                Loading reports…
              </Typography>
            ) : visible.length === 0 ? (
              <Stack spacing={2} sx={{ py: 8, alignItems: "center" }}>
                <Typography color="text.secondary">
                  No reports {filter === "all" ? "yet" : `with status ${filter}`}.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={1.5} sx={{ p: 1.5 }}>
                {visible.map((r) => (
                  <Card key={r.id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                            <Chip
                              size="small"
                              label={r.status}
                              color={statusColor[r.status]}
                              variant={r.status === "PENDING" ? "filled" : "outlined"}
                            />
                            <Typography variant="caption" color="text.secondary">
                              #{r.wordId}
                              {r.user ? ` · ${r.user.name} (${r.user.email})` : ""}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(r.createdAt).toLocaleString()}
                            </Typography>
                          </Stack>

                          <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                            {r.wordKorean}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Current: {r.wordEnglish}
                            {r.wordKhmer ? ` · ${r.wordKhmer}` : ""}
                          </Typography>

                          {r.reason ? (
                            <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1, bgcolor: theme.palette.action.hover }}>
                              <Typography variant="caption" color="text.secondary">
                                Reason
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {r.reason}
                              </Typography>
                            </Box>
                          ) : null}

                          {r.suggestedKorean || r.suggestedEnglish || r.suggestedKhmer ? (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1.25,
                                borderRadius: 1,
                                border: 1,
                                borderColor: "primary.main",
                                bgcolor: theme.palette.action.selected,
                              }}
                            >
                              <Typography variant="caption" color="primary">
                                Suggested correction
                              </Typography>
                              {r.suggestedKorean ? (
                                <Typography variant="body2">Korean: {r.suggestedKorean}</Typography>
                              ) : null}
                              {r.suggestedEnglish ? (
                                <Typography variant="body2">English: {r.suggestedEnglish}</Typography>
                              ) : null}
                              {r.suggestedKhmer ? (
                                <Typography variant="body2">Khmer: {r.suggestedKhmer}</Typography>
                              ) : null}
                            </Box>
                          ) : null}
                        </Box>

                        {isAdmin ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexShrink: 0, alignItems: "flex-start", flexWrap: "wrap" }}
                          >
                            {r.status !== "RESOLVED" &&
                            (r.suggestedKorean || r.suggestedEnglish || r.suggestedKhmer) ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                disabled={pendingAction === r.id}
                                onClick={() => applySuggestion(r)}
                              >
                                Apply suggestion
                              </Button>
                            ) : null}
                            {r.status !== "RESOLVED" ? (
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                disabled={pendingAction === r.id}
                                onClick={() => setStatus(r.id, "RESOLVED")}
                              >
                                Mark resolved
                              </Button>
                            ) : null}
                            {r.status !== "REJECTED" ? (
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={pendingAction === r.id}
                                onClick={() => setStatus(r.id, "REJECTED")}
                              >
                                Reject
                              </Button>
                            ) : null}
                            {r.status !== "PENDING" ? (
                              <Button
                                size="small"
                                variant="text"
                                disabled={pendingAction === r.id}
                                onClick={() => setStatus(r.id, "PENDING")}
                              >
                                Reopen
                              </Button>
                            ) : null}
                          </Stack>
                        ) : null}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
