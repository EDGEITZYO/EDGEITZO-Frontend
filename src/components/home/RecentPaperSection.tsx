import { Box, Typography } from "@mui/material";
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 헤더: 타이틀 + 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "36px",
            letterSpacing: "-0.576px",
            color: "label.normal",
          }}
        >
          최근 확인한 논문
        </Typography>

        {/* 데스크탑/태블릿: 텍스트 + 아이콘, 모바일: 아이콘만 */}
        <Box
          onClick={() => navigate("/saved?tab=recent")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 0 3px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            "&:hover": { opacity: 0.7 },
          }}
        >
          <Plus size={20} color="#1E2026" />
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "label.normal",
            }}
          >
            자세히 보기
          </Typography>
        </Box>
      </Box>

      {/* 카드 리스트 or 빈 상태 */}
      {papers.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: "48px",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "label.assistive",
            }}
          >
            최근 확인한 논문이 없어요
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "background.default",
            alignSelf: "stretch",
          }}
        >
          {papers.slice(0, 2).map((paper) => (
            <RecentPaperCard key={paper.paper_id} data={paper} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentPaperSection;
