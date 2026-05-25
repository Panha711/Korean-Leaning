"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setSubmitting(false);
        return;
      }
      // Hard navigation so the proxy picks up the new session cookie
      // and the dashboard loads with the fresh user.
      window.location.href = "/";
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: 1, maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start learning Korean with personalized progress.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  autoComplete="name"
                  autoFocus
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  helperText="At least 8 characters."
                  autoComplete="new-password"
                />
                {error ? (
                  <Box>
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                    {error.toLowerCase().includes("already exists") ? (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <Link href="/login" style={{ fontWeight: 700 }}>
                          Sign in instead →
                        </Link>
                      </Typography>
                    ) : null}
                  </Box>
                ) : null}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting || !name || !email || password.length < 8}
                  sx={{ textTransform: "none", fontWeight: 700 }}
                >
                  {submitting ? "Creating account…" : "Create account"}
                </Button>
              </Stack>
            </form>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
