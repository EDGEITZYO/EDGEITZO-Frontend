import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery, Skeleton } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

// ─── 배지 ───────────────────────────────────────────────────────────────────

const GreenBadge = () => (
  <Box
    sx={{
      display: "flex",
      padding: "2px 7px 2px 4px",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "8px",
      borderRadius: "6px",
      backgroundColor: "#4ACE03",
      flexShrink: 0,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <Box
        component="img"
        src="/biome-logo-white.svg"
        alt="Biome 로고"
        sx={{ width: "20px", height: "20px" }}
      />
      <Typography
        sx={{
          color: "#FFF",
          fontSize: { xs: "11px", sm: "13px" },
          fontWeight: { xs: 400, sm: 600 },
          lineHeight: { xs: "20px", sm: "22px" },
          letterSpacing: { xs: "-0.22px", sm: "-0.26px" },
        }}
      >
        AI 요약
      </Typography>
    </Box>
  </Box>
);

const DarkBadge = () => (
  <Box
    sx={{
      display: "inline-flex",
      alignSelf: "flex-start",
      padding: "3px 8px",
      borderRadius: "4px",
      backgroundColor: "#292B33",
    }}
  >
    <Typography
      sx={{
        color: "#FFF",
        fontSize: { xs: "11px", sm: "13px" },
        fontWeight: 400,
        lineHeight: { xs: "20px", sm: "22px" },
        letterSpacing: { xs: "-0.22px", sm: "-0.26px" },
      }}
    >
      ✦ 바이옴 AI 유추
    </Typography>
  </Box>
);

// ─── 좌측 패널 하위 컴포넌트 ─────────────────────────────────────────────────

interface LeftPaperRowProps {
  isMobile: boolean;
}

const LeftPaperRow = ({ isMobile }: LeftPaperRowProps) => (
  <Box
    sx={{
      display: "flex",
      padding: "10px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      borderRadius: "6px",
      border: "1px solid #E9EAF2",
      backgroundColor: "#FFF",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flex: "1 0 0",
        minWidth: 0,
      }}
    >
      {/* 번호 박스 */}
      <Skeleton
        variant="rounded"
        width={24}
        height={24}
        sx={{ borderRadius: "6px", background: "#EDEFF5", flexShrink: 0 }}
      />
      {/* 내용 */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            flex: "1 0 0",
            minWidth: 0,
          }}
        >
          <Skeleton
            variant="rounded"
            height={44}
            sx={{ background: "#F7F8FA", borderRadius: "6px", width: "100%" }}
          />
          <Skeleton
            variant="rounded"
            width={174}
            height={20}
            sx={{
              background: "#F7F8FA",
              borderRadius: "6px",
              maxWidth: "100%",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            flex: "1 0 0",
          }}
        >
          <Skeleton
            variant="rounded"
            height={44}
            sx={{ background: "#F7F8FA", borderRadius: "6px", width: "100%" }}
          />

          <Skeleton
            variant="rounded"
            width={174}
            height={20}
            sx={{ background: "#F7F8FA", borderRadius: "6px" }}
          />
        </Box>
      )}
    </Box>
  </Box>
);

interface LeftClusterProps {
  isMobile: boolean;
}

const LeftCluster = ({ isMobile }: LeftClusterProps) => {
  const paperCount = isMobile ? 3 : 2;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "16px",
        background: "#F7F8FA",
        borderRadius: "8px",
        alignSelf: "stretch",
      }}
    >
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          {/* 위쪽 프레임 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            <Skeleton
              variant="rounded"
              height={24}
              sx={{ background: "#EDEFF5", borderRadius: "6px", width: "100%" }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <GreenBadge />
              <Skeleton
                variant="rounded"
                height={40}
                sx={{
                  background: "#EDEFF5",
                  borderRadius: "6px",
                  flex: "1 0 0",
                }}
              />
            </Box>
          </Box>
          {/* 논문 목록 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignSelf: "stretch",
            }}
          >
            {Array.from({ length: paperCount }).map((_, i) => (
              <LeftPaperRow key={i} isMobile={isMobile} />
            ))}
          </Box>
        </Box>
      ) : (
        <>
          {/* 클러스터 내부 프레임 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "12px",
              alignSelf: "stretch",
            }}
          >
            {/* 클러스터 내부 상단 프레임 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Skeleton
                variant="rounded"
                height={30}
                sx={{
                  background: "#EDEFF5",
                  borderRadius: "6px",
                  alignSelf: "stretch",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                }}
              >
                <GreenBadge />
                <Skeleton
                  variant="rounded"
                  sx={{
                    background: "#F0F1F5",
                    borderRadius: "6px",
                    flex: "1 0 0",
                    height: 36,
                  }}
                />
              </Box>
            </Box>
            {Array.from({ length: paperCount }).map((_, i) => (
              <LeftPaperRow key={i} isMobile={isMobile} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

// ─── 좌측 패널 ───────────────────────────────────────────────────────────────

const LeftPanelSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const clusterCount = isTablet ? 3 : 2;

  const containerSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: { xs: 0, sm: "24px" },
    border: { xs: "none", sm: "1px solid #D8DAE5" },
    borderRadius: { xs: 0, sm: "8px" },
    background: { xs: "transparent", sm: "#FFF" },
    flex: "1 0 0",
    alignSelf: "stretch",
    alignItems: { sm: "flex-start" },
  };

  return (
    <Box sx={containerSx}>
      {/* 헤더 영역 */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <Skeleton
            variant="rounded"
            height={24}
            sx={{ background: "#EDEFF5", borderRadius: "6px", width: "100%" }}
          />
          <Skeleton
            variant="rounded"
            width={181}
            height={22}
            sx={{
              background: "#EDEFF5",
              borderRadius: "6px",
              maxWidth: "100%",
            }}
          />
        </Box>
      ) : isTablet ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "62px",
            flex: "1 0 0",
            gap: "8px",
          }}
        >
          <Skeleton
            variant="rounded"
            width={363}
            height={30}
            sx={{ background: "#EDEFF5", borderRadius: "6px" }}
          />
          <Skeleton
            variant="rounded"
            width={178}
            height={24}
            sx={{ background: "#EDEFF5", borderRadius: "6px" }}
          />
        </Box>
      ) : (
        /* 데스크탑 헤더 */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
          }}
        >
          <Typography
            sx={{
              color: "#1E2026",
              fontFamily: '"Pretendard Variable"',
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: "36px",
              letterSpacing: "-0.528px",
            }}
          >
            바이옴이 연구 흐름을 파악하고 있어요...
          </Typography>
          <Skeleton
            variant="rounded"
            width={178}
            height={24}
            sx={{ background: "#EDEFF5", borderRadius: "6px" }}
          />
        </Box>
      )}

      {/* 클러스터 목록 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        {Array.from({ length: clusterCount }).map((_, i) => (
          <LeftCluster key={i} isMobile={isMobile} />
        ))}
      </Box>
    </Box>
  );
};

// ─── 우측 패널 하위 컴포넌트 ─────────────────────────────────────────────────

const RightListItem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        alignItems: "center",
        alignSelf: "stretch",
        padding: "10px 12px 10px 18px",
        justifyContent: "space-between",
        borderRadius: "6px",
        border: "1px solid #E9EAF2",
        backgroundColor: "#FFF",
      }}
    >
      {/* 번호 박스 */}
      <Skeleton
        variant="rounded"
        width={24}
        height={24}
        sx={{ borderRadius: "6px", background: "#A4A7B2", flexShrink: 0 }}
      />
      {/* 내용 */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            flex: "1 0 0",
          }}
        >
          <Skeleton
            variant="rounded"
            width={78}
            height={20}
            sx={{ background: "#F7F8FA", borderRadius: "4px" }}
          />
          <Skeleton
            variant="rounded"
            height={22}
            sx={{ background: "#F7F8FA", borderRadius: "4px", width: "100%" }}
          />
          <Skeleton
            variant="rounded"
            width={69}
            height={22}
            sx={{ background: "#F7F8FA", borderRadius: "4px" }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "3px",
            height: "70px",
            flex: "1 0 0",
          }}
        >
          <Skeleton
            variant="rounded"
            width={78}
            height={19}
            sx={{ background: "#F7F8FA", borderRadius: "6px" }}
          />
          <Skeleton
            variant="rounded"
            height={23}
            sx={{
              background: "#F7F8FA",
              borderRadius: "6px",
              alignSelf: "stretch",
            }}
          />
          <Skeleton
            variant="rounded"
            width={69}
            height={21}
            sx={{ background: "#F7F8FA", borderRadius: "6px" }}
          />
        </Box>
      )}
    </Box>
  );
};

// ─── 우측 패널 ───────────────────────────────────────────────────────────────

const RightPanelSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const containerSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    height: { xs: "auto", sm: "100%", lg: "1000px" },
    maxHeight: { xs: "none", lg: "none" },
    padding: { xs: "16px 0", sm: "24px" },
    border: { xs: "none", sm: "1px solid #D8DAE5" },
    borderRadius: { xs: 0, sm: "8px" },
    background: { xs: "transparent", sm: "#FFF" },
    overflow: { xs: "visible", sm: "hidden" },
    width: { lg: "455px" },
    flexShrink: { lg: 0 },
    alignItems: { sm: "flex-start" },
  };

  return (
    <Box sx={containerSx}>
      {/* 상단 영역 */}
      {isDesktop ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          <DarkBadge />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
              alignSelf: "stretch",
            }}
          >
            <Skeleton
              variant="rounded"
              width={303}
              height={30}
              sx={{ background: "#EDEFF5", borderRadius: "6px" }}
            />
            <Skeleton
              variant="rounded"
              height={68}
              sx={{ background: "#F7F8FA", borderRadius: "8px", width: "100%" }}
            />
          </Box>
        </Box>
      ) : (
        /* 태블릿/모바일: 배지 + 텍스트 + 정보박스 */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignSelf: "stretch",
            justifyContent: { sm: "center" },
            alignItems: { sm: "flex-start" },
          }}
        >
          {/* 배지 + 텍스트 묶음 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignSelf: "stretch",
            }}
          >
            {/* 배지 */}
            <DarkBadge />
            {/* 텍스트 + infoBox 묶음 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  color: "#1E2026",
                  fontSize: { xs: "16px", sm: "20px" },
                  fontWeight: 600,
                  lineHeight: { xs: "24px", sm: "30px" },
                  letterSpacing: { xs: "-0.336px", sm: "-0.42px" },
                  alignSelf: "stretch",
                }}
              >
                바이옴이 연구 흐름을 파악하고 있어요...
              </Typography>
              <Skeleton
                variant="rounded"
                height={isMobile ? 56 : 68}
                sx={{
                  background: "#F7F8FA",
                  borderRadius: "6px",
                  width: "100%",
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* AI 요약 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: "4px", sm: "8px" },
          alignItems: { sm: "flex-start" },
          alignSelf: { sm: "stretch" },
        }}
      >
        <Skeleton
          variant="rounded"
          width={isMobile ? 43 : 51}
          height={isMobile ? 20 : 22}
          sx={{
            background: { xs: "#D8DAE5", sm: "#E9EAF2" },
            borderRadius: "4px",
          }}
        />
        <Skeleton
          variant="rounded"
          height={isMobile ? 44 : 54}
          sx={{ background: "#F7F8FA", borderRadius: "6px", width: "100%" }}
        />
      </Box>

      {/* 연구 흐름 영역 */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignSelf: "stretch",
          }}
        >
          <Skeleton
            variant="rounded"
            width={62}
            height={20}
            sx={{ background: "#E9EAF2", borderRadius: "4px" }}
          />
          <Box
            sx={{
              height: "320px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <RightListItem key={i} />
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <Skeleton
            variant="rounded"
            width={73}
            height={22}
            sx={{ background: "#E9EAF2", borderRadius: "4px" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <RightListItem key={i} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

// ─── 최상위 레이아웃 ──────────────────────────────────────────────────────────

const ResearchFlowSkeleton = () => {
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: { xs: 0, sm: "12px", lg: "16px" },
        maxHeight: { lg: "1000px" },
        alignItems: { lg: "stretch" },
        alignSelf: "stretch",
      }}
    >
      {isMobileOrTablet ? (
        <>
          <RightPanelSkeleton />
          <LeftPanelSkeleton />
        </>
      ) : (
        <>
          <LeftPanelSkeleton />
          <RightPanelSkeleton />
        </>
      )}
    </Box>
  );
};

export default ResearchFlowSkeleton;
