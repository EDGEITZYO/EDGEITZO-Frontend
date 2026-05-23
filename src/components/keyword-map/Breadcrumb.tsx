import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useBreadcrumbs, useKeywordMapActions } from '../../stores/keywordMapStore';
import { type SxProps, type Theme } from '@mui/material/styles';

const chipSx: SxProps<Theme> = {
  px: '9px',
  py: '6px',
  borderRadius: '7px',
  backgroundColor: 'label.neutral',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'label.alternative',
  },
};

const activeChipSx: SxProps<Theme> = {
  ...chipSx,
  backgroundColor: 'static.black',
};

const Breadcrumb = () => {
  const breadcrumbs = useBreadcrumbs();
  const { popBreadcrumbTo } = useKeywordMapActions();

  if (breadcrumbs.length === 0) return null;

  const handleClick = (nodeId: string, index: number) => {
    // 마지막 항목이면 아무 동작 없음
    if (index === breadcrumbs.length - 1) return;
    popBreadcrumbTo(nodeId);
    // TODO: API 연동 후 해당 노드 위치로 포커싱 처리
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        px: '99px',
        py: '18px',
        borderBottom: '1px solid',
        borderColor: 'line.normal',
      }}
    >
      {breadcrumbs.map((crumb, index) => (
        <Box
          key={crumb.nodeId}
          sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Box
            onClick={() => handleClick(crumb.nodeId, index)}
            sx={index === breadcrumbs.length - 1 ? activeChipSx : chipSx}
          >
            <Typography
              sx={{
                fontSize: '17px',
                fontWeight: 600,
                color: index === breadcrumbs.length - 1 ? 'static.white' : 'static.white',
                letterSpacing: '-0.34px',
                lineHeight: '29px',
              }}
            >
              {crumb.label}
            </Typography>
          </Box>
          {index < breadcrumbs.length - 1 && (
            <ChevronRightIcon sx={{ fontSize: '20px', color: 'label.alternative' }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Breadcrumb;