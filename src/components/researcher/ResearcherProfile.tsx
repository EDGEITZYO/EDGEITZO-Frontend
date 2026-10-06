import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type ResearcherProfile as ResearcherProfileType } from "../../types/researcher";

interface ResearcherProfileProps {
  profile: ResearcherProfileType;
}

const profileSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
};

const infoGroupSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  alignSelf: "stretch",
};

const nameInstitutionGroupSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "stretch",
};

const keywordGroupSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  alignSelf: "stretch",
};

const keywordInnerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  flexWrap: "wrap",
};

const keywordChipSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  backgroundColor: "background.paper",
};

const ResearcherProfile = ({ profile }: ResearcherProfileProps) => {
  const displayName = profile.name_kor ?? profile.name_eng ?? "-";

  const institutionParts = [profile.institution, profile.department].filter(
    Boolean,
  );
  const institutionText =
    institutionParts.length > 0 ? institutionParts.join(" · ") : null;

  return (
    <Box sx={profileSx}>
      <Box sx={infoGroupSx}>
        <Box sx={nameInstitutionGroupSx}>
          <Typography
            variant="h4"
            sx={{ color: "label.normal", alignSelf: "stretch" }}
          >
            {displayName}
          </Typography>
          {institutionText && (
            <Typography
              variant="body1"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "label.alternative",
                alignSelf: "stretch",
              }}
            >
              {institutionText}
            </Typography>
          )}
        </Box>
        {profile.email && (
          <Typography
            variant="caption"
            sx={{ color: "label.normal", textAlign: "center" }}
          >
            {profile.email}
          </Typography>
        )}
      </Box>
      {profile.keywords.length > 0 && (
        <Box sx={keywordGroupSx}>
          <Box sx={keywordInnerSx}>
            {profile.keywords.map((keyword) => (
              <Box key={keyword} sx={keywordChipSx}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "label.normal",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResearcherProfile;
