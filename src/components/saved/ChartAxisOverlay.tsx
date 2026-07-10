import { Box, Typography } from "@mui/material";

const ChartAxisOverlay = () => (
  <>
    {/* 세로축 오버레이 */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        width: "173px",
        height: "660px",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          alignSelf: "stretch",
          color: "label.alternative",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
        }}
      >
        인용 높음
      </Typography>
      <Box
        sx={{ width: "1px", height: "588px", backgroundColor: "line.normal" }}
      />
      <Typography
        sx={{
          alignSelf: "stretch",
          color: "label.alternative",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
        }}
      >
        인용 낮음
      </Typography>
    </Box>

    {/* 가로축 오버레이 */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "24px",
        right: "24px",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          flexShrink: 0,
          color: "label.alternative",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
        }}
      >
        오래된 논문
      </Typography>
      <Box sx={{ flex: 1, height: "1px", backgroundColor: "line.normal" }} />
      <Typography
        sx={{
          flexShrink: 0,
          color: "label.alternative",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
        }}
      >
        최신 논문
      </Typography>
    </Box>
  </>
);

export default ChartAxisOverlay;
