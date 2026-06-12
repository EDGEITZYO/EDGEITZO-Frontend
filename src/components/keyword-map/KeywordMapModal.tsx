import { Box, Typography, Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { type MypageData } from "../../types/mypage";

interface KeywordMapModalProps {
  open: boolean;
  onClose: () => void;
}

const overlayWrapperSx: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "457px",
  backgroundColor: "background.default",
  borderRadius: "11px",
  padding: "10px",
  outline: "none",
};

const overlayContentSx: SxProps<Theme> = {
  padding: "23px",
  display: "flex",
  flexDirection: "column",
  gap: "23px",
};

const editButtonSx: SxProps<Theme> = {
  height: "52px",
  borderRadius: "12px",
  backgroundColor: "fill.strong",
  color: "label.normal",
  fontSize: "18px",
  fontWeight: 500,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "fill.normal",
    boxShadow: "none",
  },
};

const generateButtonSx: SxProps<Theme> = {
  height: "52px",
  borderRadius: "12px",
  backgroundColor: "primary.main",
  color: "static.white",
  fontSize: "18px",
  fontWeight: 500,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "primary.dark",
    boxShadow: "none",
  },
};

const KeywordMapModal = ({ open, onClose }: KeywordMapModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // keywordMapStore 대신 mypage 캐시에서 research_field 읽기
  const mypageData = queryClient.getQueryData<MypageData>(["mypage"]);
  const researchField = mypageData?.profile.research_field ?? null;

  const handleEdit = () => {
    onClose();
    navigate("/keyword-map/edit");
  };

  const handleGenerate = () => {
    onClose();
    navigate("/keyword-map");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          ...overlayWrapperSx,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            backgroundColor: "background.default",
            cursor: "pointer",
          }}
        >
          <CloseIcon sx={{ fontSize: "24px", color: "static.black" }} />
        </Box>
        <Box sx={overlayContentSx}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                letterSpacing: "-0.48px",
                color: "static.black",
              }}
            >
              내 연구분야 키워드맵
            </Typography>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 400,
                letterSpacing: "-0.34px",
                color: "static.black",
              }}
            >
              현재 설정된 연구분야를 수정할 수 있어요.
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "17px",
              fontWeight: 600,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            {researchField
              ? `현재 설정 연구 분야 - ${researchField}`
              : "현재 설정된 연구 분야가 없어요"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleEdit}
              sx={editButtonSx}
            >
              연구 분야 수정하기
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerate}
              sx={generateButtonSx}
            >
              키워드맵 생성하기
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default KeywordMapModal;
