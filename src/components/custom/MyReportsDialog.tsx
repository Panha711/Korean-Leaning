"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DialogTitleWithClose } from "@/components/common/DialogTitleWithClose";

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
  adminNote?: string | null;
  createdAt: string;
}

const statusColor: Record<ReportStatus, "warning" | "success" | "default"> = {
  PENDING: "warning",
  RESOLVED: "success",
  REJECTED: "default",
};

interface MyReportsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MyReportsDialog({ open, onClose }: MyReportsDialogProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/word-reports")
      .then((r) => r.json())
      .then((data: { reports?: Report[] }) => setReports(data.reports ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitleWithClose onClose={onClose}>My reports</DialogTitleWithClose>
      <DialogContent dividers className="scrollbar-styled-slim">
        {loading ? (
          <Typography sx={{ py: 4, textAlign: "center" }} color="text.secondary">
            Loading…
          </Typography>
        ) : reports.length === 0 ? (
          <Typography sx={{ py: 4, textAlign: "center" }} color="text.secondary">
            You haven&apos;t reported any words yet.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {reports.map((r) => (
              <Box
                key={r.id}
                sx={{
                  p: 1.5,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", mb: 0.75, flexWrap: "wrap" }}
                >
                  <Chip
                    size="small"
                    label={r.status}
                    color={statusColor[r.status]}
                    variant={r.status === "PENDING" ? "filled" : "outlined"}
                  />
                  <Typography variant="caption" color="text.secondary">
                    #{r.wordId} · {new Date(r.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 700 }}>{r.wordKorean}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {r.wordEnglish}
                  {r.wordKhmer ? ` · ${r.wordKhmer}` : ""}
                </Typography>
                {r.reason ? (
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                    {r.reason}
                  </Typography>
                ) : null}
                {r.adminNote ? (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, fontStyle: "italic" }}
                    color="text.secondary"
                  >
                    Admin: {r.adminNote}
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
