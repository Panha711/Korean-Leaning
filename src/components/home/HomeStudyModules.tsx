"use client";

import Grid from "@mui/material/Grid";
import ChatIcon from "@mui/icons-material/Chat";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TranslateIcon from "@mui/icons-material/Translate";
import { StudyModuleCard } from "@/components/cards/StudyModuleCard";
import { epsTopikVocabulary } from "@/data/eps-topik-vocabulary";
import { topikIVocabulary } from "@/data/topik-i-vocabulary";
import { topikIIVocabulary } from "@/data/topik-ii-vocabulary";
import { epsTopikGrammar } from "@/data/eps-topik-grammar";
import { haeyoFormGrammar } from "@/data/haeyo-form-grammar";
import { topikIGrammar } from "@/data/topik-i-grammar";
import { topikIIGrammar } from "@/data/topik-ii-grammar";
import { dailySentenceGroups } from "@/data/daily-sentences";

const WORD_COUNT =
  epsTopikVocabulary.length + topikIVocabulary.length + topikIIVocabulary.length;
const GRAMMAR_COUNT =
  epsTopikGrammar.length +
  topikIGrammar.length +
  topikIIGrammar.length +
  haeyoFormGrammar.length;

const studyModules = [
  {
    href: "/vocabulary",
    title: "Words",
    titleKhmer: "ពាក្យ",
    description:
      "EPS-TOPIK, TOPIK I, and TOPIK II vocabulary with Korean, English, and Khmer meanings.",
    countLabel: `${WORD_COUNT.toLocaleString()} words`,
    breakdown: [
      `EPS ${epsTopikVocabulary.length}`,
      `TOPIK I ${topikIVocabulary.length}`,
      `TOPIK II ${topikIIVocabulary.length}`,
    ],
    icon: MenuBookIcon,
    accent: "#7c3aed",
  },
  {
    href: "/grammar",
    title: "Grammar",
    titleKhmer: "វេយ្យាករណ៍",
    description:
      "Grammar patterns for EPS-TOPIK, TOPIK I, and TOPIK II with example sentences.",
    countLabel: `${GRAMMAR_COUNT} patterns`,
    breakdown: [
      `EPS ${epsTopikGrammar.length}`,
      `TOPIK I ${topikIGrammar.length}`,
      `TOPIK II ${topikIIGrammar.length}`,
      `해요 ${haeyoFormGrammar.length}`,
    ],
    icon: TranslateIcon,
    accent: "#2563eb",
  },
  {
    href: "/daily-sentences",
    title: "Daily Sentences",
    titleKhmer: "ប្រយោគប្រចាំថ្ងៃ",
    description:
      "Real-life Korean dialogues by place — cafe, hospital, work, travel, and more.",
    countLabel: `${dailySentenceGroups.length} dialogues`,
    breakdown: ["Cafe", "Hospital", "Work", "Travel"],
    icon: ChatIcon,
    accent: "#059669",
  },
] as const;

export function HomeStudyModules() {
  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      {studyModules.map((module) => (
        <Grid key={module.href} size={{ xs: 12, md: 4 }}>
          <StudyModuleCard {...module} />
        </Grid>
      ))}
    </Grid>
  );
}
