import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm,
  useWatch,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/layout/Sidebar";
import {
  profileEditSchema,
  type ProfileEditForm,
  ROLE_OPTIONS,
  PURPOSE_OPTIONS,
  GENDER_OPTIONS,
  birthYearToAgeGroup,
} from "../types/mypage";
import { mypageApi } from "../api/mypage";
import { useMypageQuery } from "../queries/useMypageQuery";
import { mypageKeys } from "../queries/keys";

const FIELD_LABEL_SX: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "30px",
  letterSpacing: "-0.378px",
  color: "label.normal",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const PILL_INPUT_SX: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    height: "56px",
    borderRadius: "216px",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    color: "label.normal",
    padding: "8px 8px 8px 24px",
    "& input": { padding: 0 },
    "& fieldset": { borderColor: "line.normal" },
    "&:hover fieldset": { borderColor: "label.assistive" },
    "&.Mui-focused fieldset": { borderColor: "label.assistive" },
  },
};

const PILL_INPUT_ERROR_SX: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    height: "56px",
    borderRadius: "216px",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    color: "#D0220B",
    padding: "8px 8px 8px 24px",
    "& input": { padding: 0, color: "#D0220B" },
    "& fieldset": { borderColor: "status.negative" },
    "&:hover fieldset": { borderColor: "status.negative" },
    "&.Mui-focused fieldset": { borderColor: "status.negative" },
  },
};

const ERROR_TEXT_SX: SxProps<Theme> = {
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
  color: "#D0220B",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const currentYear = new Date().getFullYear();

const MyPageEditPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const { data, isPending } = useMypageQuery();

  // 출생연도는 폼 외부에서 별도 관리
  const [birthYear, setBirthYear] = useState<string>("");
  const [birthYearError, setBirthYearError] = useState<string>("");

  const koreanAge = (() => {
    const year = Number(birthYear);
    if (!birthYear || isNaN(year)) return null;
    return currentYear - year + 1;
  })();

  const { mutate: updateProfile, isPending: isSubmitting } = useMutation({
    mutationFn: (formData: ProfileEditForm) =>
      mypageApi.updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageKeys.detail() });
      navigate("/mypage");
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    mode: "onChange",
    values: data
      ? {
          name: data.profile.name,
          gender: data.profile.gender as ProfileEditForm["gender"],
          age: data.profile.age as ProfileEditForm["age"],
          role: data.profile.role as ProfileEditForm["role"],
          research_field: data.profile.research_field,
          purposes: data.profile.purposes as ProfileEditForm["purposes"],
        }
      : undefined,
  });

  const watchedName = useWatch({ control, name: "name" }) ?? "";

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setBirthYear(val);

    if (val.length === 0) {
      setBirthYearError("");
      return;
    }

    if (val.length < 4) {
      setBirthYearError("출생 연도는 4자리로 입력해주세요");
      return;
    }

    const year = Number(val);
    if (year < 1920 || year > currentYear) {
      setBirthYearError("1920년부터 현재까지 입력할 수 있어요");
      return;
    }

    setBirthYearError("");
    setValue("age", birthYearToAgeGroup(year), { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ProfileEditForm> = (formData) => {
    if (!birthYear || birthYearError) return;
    updateProfile(formData);
  };

  const handleCancel = () => navigate("/mypage");

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const cardSx: SxProps<Theme> = {
    width: isMobile ? "100%" : "480px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "32px",
    borderRadius: "12px",
    border: "1px solid #FAFAFC",
    backgroundColor: "static.white",
    backdropFilter: "blur(2.9px)",
  };

  const headerRow = (
    <Box
      sx={{
        display: "flex",
        padding: "0 4px",
        alignItems: "center",
        gap: "8px",
        alignSelf: "stretch",
      }}
    >
      <IconButton
        onClick={handleCancel}
        sx={{ width: "28px", height: "28px", p: 0 }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "label.normal" }} />
      </IconButton>
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: 600,
          lineHeight: "36px",
          letterSpacing: "-0.528px",
          color: "label.normal",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        회원 정보 수정
      </Typography>
    </Box>
  );

  const nameField = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "0 8px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography sx={FIELD_LABEL_SX}>이름</Typography>
      </Box>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            <TextField
              {...field}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 10) return;
                field.onChange(e);
              }}
              fullWidth
              placeholder="이름"
              sx={errors.name ? PILL_INPUT_ERROR_SX : PILL_INPUT_SX}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "24px",
                        letterSpacing: "-0.336px",
                        color: "label.assistive",
                        whiteSpace: "nowrap",
                        pr: "16px",
                      }}
                    >
                      {watchedName.length}/10
                    </Typography>
                  ),
                },
              }}
            />
            {errors.name && (
              <Box
                sx={{
                  display: "flex",
                  height: "24px",
                  padding: "0 8px 0 12px",
                  alignItems: "center",
                  gap: "10px",
                  alignSelf: "stretch",
                }}
              >
                <Typography sx={ERROR_TEXT_SX}>
                  {errors.name.message}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      />
    </Box>
  );

  const genderField = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "0 8px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography sx={FIELD_LABEL_SX}>성별</Typography>
      </Box>
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {GENDER_OPTIONS.map((option) => {
              const selected = field.value === option;
              return (
                <Button
                  key={option}
                  onClick={() => field.onChange(option)}
                  sx={{
                    display: "flex",
                    padding: "8px 13px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    minWidth: 0,
                    ...(selected
                      ? {
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), #03C26C",
                          color: "#FAFAFC",
                          "&:hover": {
                            background:
                              "linear-gradient(0deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 100%), #03C26C",
                          },
                        }
                      : {
                          backgroundColor: "fill.normal",
                          color: "label.alternative",
                          "&:hover": { backgroundColor: "fill.strong" },
                        }),
                  }}
                >
                  {option}
                </Button>
              );
            })}
          </Box>
        )}
      />
    </Box>
  );

  const ageField = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "0 8px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography sx={FIELD_LABEL_SX}>출생 연도</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "56px",
            padding: "8px 24px",
            alignItems: "center",
            borderRadius: "216px",
            border: "1px solid",
            borderColor: birthYearError ? "status.negative" : "line.normal",
          }}
        >
          <Box
            component="input"
            type="text"
            inputMode="numeric"
            placeholder="출생 연도"
            value={birthYear}
            onChange={handleBirthYearChange}
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: birthYearError ? "#D0220B" : "label.normal",
              backgroundColor: "transparent",
              "&::placeholder": { color: "label.assistive" },
            }}
          />
          {koreanAge !== null && (
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
                color: "label.assistive",
                whiteSpace: "nowrap",
                ml: "auto",
              }}
            >
              {koreanAge}세
            </Typography>
          )}
        </Box>
        {birthYearError && (
          <Box
            sx={{
              display: "flex",
              height: "24px",
              padding: "0 8px 0 12px",
              alignItems: "center",
              gap: "10px",
              alignSelf: "stretch",
            }}
          >
            <Typography sx={ERROR_TEXT_SX}>{birthYearError}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  const roleField = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "0 8px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography sx={FIELD_LABEL_SX}>역할</Typography>
      </Box>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            fullWidth
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              height: "56px",
              borderRadius: "216px",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "label.normal",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "line.normal",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "label.assistive",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "label.assistive",
              },
              "& .MuiSelect-select": { padding: "8px 8px 8px 24px" },
              "& .MuiSelect-icon": { mr: "10px" },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: {
                    borderRadius: "28px",
                    border: "1px solid",
                    borderColor: "label.alternative",
                    padding: "8px",
                    "& .MuiList-root": { padding: 0 },
                  },
                },
              },
            }}
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  height: "56px",
                  padding: "8px 8px 8px 16px",
                  borderRadius: "216px",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                  color: "label.normal",
                  "&.Mui-selected": { backgroundColor: "background.paper" },
                  "&:hover": { backgroundColor: "background.paper" },
                  "&.Mui-selected:hover": {
                    backgroundColor: "background.paper",
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </Box>
  );

  const researchField = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "0 8px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography sx={FIELD_LABEL_SX}>연구 분야</Typography>
      </Box>
      <Controller
        name="research_field"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            placeholder="ex) 유전자 편집, 효소 공학, 나노 바이오"
            sx={PILL_INPUT_SX}
          />
        )}
      />
    </Box>
  );

  const purposesField = (isDesktop: boolean) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "0 8px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          alignSelf: "stretch",
        }}
      >
        <Typography sx={FIELD_LABEL_SX}>논문 탐색 목적</Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "-0.336px",
            color: "label.alternative",
          }}
        >
          탐색 목적에 따라 더 정확한 논문 추천이 가능해요
        </Typography>
      </Box>
      <Controller
        name="purposes"
        control={control}
        render={({ field }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              gap: "12px 8px",
              flexWrap: "wrap",
              ...(isDesktop && { width: "358px", height: "92px" }),
            }}
          >
            {PURPOSE_OPTIONS.map((purpose) => {
              const selected = field.value.includes(purpose);
              return (
                <Chip
                  key={purpose}
                  label={purpose}
                  onClick={() => {
                    const next = selected
                      ? field.value.filter((p) => p !== purpose)
                      : [...field.value, purpose];
                    field.onChange(next);
                  }}
                  sx={{
                    height: "auto",
                    padding: "8px 13px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    "& .MuiChip-label": { padding: 0 },
                    ...(selected
                      ? {
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), #03C26C",
                          color: "#FAFAFC",
                        }
                      : {
                          backgroundColor: "fill.normal",
                          color: "label.alternative",
                        }),
                  }}
                />
              );
            })}
          </Box>
        )}
      />
    </Box>
  );

  const isFormValid = isValid && birthYear.length === 4 && !birthYearError;

  const buttonArea = (isDesktop: boolean) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...(isDesktop
          ? { width: "452px", padding: "0 10px 10px 10px", gap: "8px" }
          : { alignSelf: "stretch", gap: "8px" }),
      }}
    >
      {!isFormValid && (
        <Box
          sx={{
            display: "flex",
            height: "24px",
            padding: "0 8px",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
          }}
        >
          <Typography sx={ERROR_TEXT_SX}>
            모든 정보를 정확하게 입력해 주세요.
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Button
          onClick={handleCancel}
          sx={{
            flex: "1 0 0",
            height: "56px",
            padding: "8px 0",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "line.neutral",
            backgroundColor: "static.white",
            color: "label.normal",
            fontSize: isDesktop ? "18px" : "16px",
            fontWeight: isDesktop ? 600 : 400,
            lineHeight: isDesktop ? "29px" : "24px",
            letterSpacing: "-0.378px",
            "&:hover": { backgroundColor: "fill.normal" },
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isFormValid || isSubmitting}
          sx={{
            flex: "1 0 0",
            height: "56px",
            padding: "8px 0",
            borderRadius: "8px",
            backgroundColor: "primary.dark",
            color: "static.white",
            fontSize: isDesktop ? "18px" : "16px",
            fontWeight: isDesktop ? 600 : 400,
            lineHeight: isDesktop ? "29px" : "24px",
            letterSpacing: "-0.378px",
            "&:hover": { backgroundColor: "primary.main" },
            "&.Mui-disabled": {
              backgroundColor: "interaction.disable",
              color: "label.disable",
            },
          }}
        >
          저장
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.paper" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            px: "16px",
            py: "16px",
          }}
        >
          <ArrowBackIosNewIcon
            onClick={handleCancel}
            sx={{ fontSize: 16, color: "label.normal", cursor: "pointer" }}
          />
          <Typography variant="h5" sx={{ color: "label.normal" }}>
            회원 정보 수정
          </Typography>
        </Box>

        <Box
          sx={{
            px: "16px",
            mt: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "42px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "36px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
                alignSelf: "stretch",
              }}
            >
              {nameField}
              {genderField}
              {ageField}
              {roleField}
              {researchField}
            </Box>
            {purposesField(false)}
          </Box>

          <Box sx={{ alignSelf: "stretch", pb: "16px" }}>
            {buttonArea(false)}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.paper" }}>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: "170px",
          pb: "64px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "24px",
          }}
        >
          {headerRow}

          <Box sx={cardSx}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "32px",
                alignSelf: "stretch",
              }}
            >
              {nameField}
              {genderField}
              {ageField}
              {roleField}
              {researchField}
            </Box>
          </Box>

          <Box sx={cardSx}>
            {purposesField(true)}
            {buttonArea(true)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyPageEditPage;
