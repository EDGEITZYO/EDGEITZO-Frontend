import { useState } from "react";
import {
  useForm,
  useWatch,
  type SubmitHandler,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

// ---- Zod 스키마 ----
const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email({ message: "올바른 이메일 형식이 아니에요" }),
  password: z
    .string()
    .min(8, "")
    .max(20, "")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, ""),
  name: z.string().min(1, "이름을 입력해주세요"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

// ---- Styles ----
const formWrapSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 463,
  gap: "19px",
};

const getInputSx = (borderColor: string): SxProps<Theme> => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    "& fieldset": {
      borderColor,
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor,
    },
    "&.Mui-focused fieldset": {
      borderColor,
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "label.alternative",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "label.alternative",
  },
});

const nextButtonSx = (enabled: boolean): SxProps<Theme> => ({
  width: "100%",
  height: 51,
  borderRadius: "12px",
  backgroundColor: enabled ? "static.black" : "fill.strong",
  color: enabled ? "static.white" : "label.assistive",
  fontSize: "16px",
  fontWeight: 500,
  letterSpacing: "-0.32px",
  boxShadow: "none",
  cursor: enabled ? "pointer" : "default",
  "&:hover": {
    backgroundColor: enabled ? "label.neutral" : "fill.strong",
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    backgroundColor: "fill.strong",
    color: "label.assistive",
  },
});

// ---- 비밀번호 조건 ----
const checkLength = (v: string) => v.length >= 8 && v.length <= 20;
const checkComplexity = (v: string) =>
  /[a-z]/.test(v) && /[A-Z]/.test(v) && /[!@#$%^&*]/.test(v);

// ---- Component ----
const SignupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: prefillEmail, password: "", name: "" },
    mode: "onChange",
  });

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });
  const nameValue = useWatch({ control, name: "name" });

  const isLengthOk = checkLength(passwordValue);
  const isComplexityOk = checkComplexity(passwordValue);
  const isPasswordValid = isLengthOk && isComplexityOk;
  const showChecklist = passwordValue.length > 0;

  // 비밀번호 테두리 색상
  const getPasswordBorderColor = () => {
    if (!passwordTouched || passwordValue.length === 0) return "static.black";
    if (isPasswordValid) return "status.positive";
    return "status.negative";
  };

  // 이메일 테두리 색상
  const getEmailBorderColor = () => {
    if (errors.email) return "status.negative";
    return "static.black";
  };

  const isFormValid =
    emailValue.length > 0 &&
    !errors.email &&
    isPasswordValid &&
    nameValue.length > 0;

  const onSubmit: SubmitHandler<SignupFormValues> = (/* data */) => {
    // TODO: API 연동 시 교체
    navigate("/signup/verify", { state: { email: emailValue } });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={formWrapSx}
      noValidate
    >
      {/* 이메일 */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Box>
            <TextField
              {...field}
              label="이메일"
              type="email"
              autoComplete="email"
              fullWidth
              error={!!errors.email}
              sx={getInputSx(getEmailBorderColor())}
              slotProps={{
                input: {
                  endAdornment:
                    emailValue.length > 0 ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setValue("email", "", { shouldValidate: true })
                          }
                          edge="end"
                          size="small"
                          aria-label="이메일 초기화"
                        >
                          <CloseIcon
                            sx={{ fontSize: 20, color: "label.alternative" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                },
              }}
            />
            {errors.email && (
              <Typography
                sx={{
                  mt: "4px",
                  ml: "4px",
                  fontSize: "13px",
                  color: "status.negative",
                  fontWeight: 400,
                }}
              >
                {errors.email.message}
              </Typography>
            )}
          </Box>
        )}
      />

      {/* 비밀번호 */}
      <Box>
        <TextField
          {...register("password")}
          label="비밀번호"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          fullWidth
          sx={getInputSx(getPasswordBorderColor())}
          onBlur={() => setPasswordTouched(true)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: "2px" }}>
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? (
                      <VisibilityOutlinedIcon
                        sx={{ fontSize: 24, color: "label.alternative" }}
                      />
                    ) : (
                      <VisibilityOffOutlinedIcon
                        sx={{ fontSize: 24, color: "label.alternative" }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {/* 조건 체크리스트 */}
        {showChecklist && (
          <Box
            sx={{
              mt: "8px",
              ml: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckIcon
                sx={{
                  fontSize: 16,
                  color: isLengthOk ? "status.positive" : "label.assistive",
                }}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: isLengthOk ? "status.positive" : "label.assistive",
                }}
              >
                8자 이상 20자 이하
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckIcon
                sx={{
                  fontSize: 16,
                  color: isComplexityOk ? "status.positive" : "label.assistive",
                }}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: isComplexityOk ? "status.positive" : "label.assistive",
                }}
              >
                대문자·소문자·특수문자를 모두 포함
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* 이름 */}
      <TextField
        {...register("name")}
        label="이름"
        fullWidth
        sx={getInputSx("static.black")}
      />

      {/* 다음 버튼 */}
      <Button
        type="submit"
        variant="contained"
        disabled={!isFormValid}
        sx={nextButtonSx(isFormValid)}
        disableElevation
      >
        다음
      </Button>
    </Box>
  );
};

export default SignupForm;
