import { type EdgeProps, getStraightPath  } from 'reactflow';
import { Box, Typography } from '@mui/material';
import { type EdgeAxisLabel } from '../../types/keywordMap';

interface KeywordEdgeData {
  axisLabel: EdgeAxisLabel;
}

const KeywordEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<KeywordEdgeData>) => {
  const [edgePath, labelX, labelY] = getStraightPath ({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        d={edgePath}
        stroke="#000000"
        strokeWidth={1}
        fill="none"
      />
      <foreignObject
        width={80}
        height={30}
        x={labelX - 40}
        y={labelY - 15}
        style={{ overflow: 'visible' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              px: '9px',
              py: '6px',
              border: '1px solid',
              borderColor: 'static.black',
              borderRadius: '7px',
              backgroundColor: 'background.paper',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 400,
                color: 'static.black',
                whiteSpace: 'nowrap',
              }}
            >
              {data?.axisLabel}
            </Typography>
          </Box>
        </Box>
      </foreignObject>
    </>
  );
};

export default KeywordEdge;