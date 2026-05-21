import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export function PageLoading() {
  return (
    <Stack spacing={3} aria-busy="true" aria-label="Loading page">
      <Skeleton variant="rounded" height={48} />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
        }}
      >
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={100} />
        ))}
      </Box>
      <Skeleton variant="rounded" height={360} />
    </Stack>
  );
}
