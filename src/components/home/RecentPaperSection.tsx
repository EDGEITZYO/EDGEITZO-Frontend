import { Box, Typography, IconButton } from "@mui/material";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecentPaperCard from "./RecentPaperCard";
import { type RecentPaper } from "../../types/home";

interface RecentPaperSectionProps {
  papers: RecentPaper[];
}

const RecentPaperSection = ({ papers }: RecentPaperSectionProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: "11px", flex: 1 }}
    >
      {/* 타이틀 + + 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ color: "label.strong" }}>
          최근 확인한 논문
        </Typography>
        <IconButton
          onClick={() => navigate("/saved?tab=recent")}
          sx={{
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            backgroundColor: "background.default",
            p: "6px",
            "&:hover": { backgroundColor: "fill.normal" },
          }}
        >
          <Plus size={24} />
        </IconButton>
      </Box>

      {/* 카드 리스트 or 빈 상태 */}
      {papers.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" sx={{ color: "label.assistive" }}>
            최근 확인한 논문이 없어요
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "11px" }}>
          {papers.slice(0, 2).map((paper) => (
            <RecentPaperCard key={paper.paper_id} data={paper} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentPaperSection;
