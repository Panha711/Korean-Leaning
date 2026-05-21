import Stack from "@mui/material/Stack";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStudyModules } from "@/components/home/HomeStudyModules";

export default function HomePage() {
  return (
    <Stack spacing={{ xs: 3, sm: 4 }}>
      <HomeHero />
      <HomeStudyModules />
    </Stack>
  );
}
