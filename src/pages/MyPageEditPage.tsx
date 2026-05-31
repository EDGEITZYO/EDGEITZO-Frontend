import { useNavigate } from 'react-router-dom';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckIcon from '@mui/icons-material/Check';
import Header from '../components/layout/Header';
import {
  profileEditSchema,
  type ProfileEditForm,
  type AgeGroup,
  AGE_OPTIONS,
  JOB_OPTIONS,
  PURPOSE_OPTIONS,
  GENDER_OPTIONS,
} from '../types/mypage';
import { type UserProfile } from '../types/user';
import { birthYearToAgeGroup } from '../utils/userUtils';

// TODO: API 연동 시 실제 유저 데이터로 교체
const MOCK_USER: UserProfile = {
  name: '홍길동',
  gender: '여성',
  birthYear: 2003,
  job: '석사과정',
  researchField: '디지털미디어 · HCI/UX',
  purposes: ['연구 주제 탐색', '논문 작성 참고', '최신 트렌드 파악'],
};

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: 'background.paper',
};

const contentSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '70px',
  paddingBottom: '56px',
  gap: '18px',
};

const headerRowSx: SxProps<Theme> = {
  width: '498px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const cardSx: SxProps<Theme> = {
  width: '498px',
  backgroundColor: 'background.default',
  borderRadius: '20px',
  border: '1px solid',
  borderColor: 'line.normal',
};

const sectionTitleSx: SxProps<Theme> = {
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: '29px',
  color: 'label.neutral',
};

const fieldLabelSx: SxProps<Theme> = {
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
  color: 'label.neutral',
};

const textFieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    color: 'label.neutral',
    '& fieldset': { borderColor: 'line.normal' },
    '&:hover fieldset': { borderColor: 'label.assistive' },
    '&.Mui-focused fieldset': { borderColor: 'label.assistive' },
    '& input': { padding: '16px 20px' },
  },
};

const selectSx: SxProps<Theme> = {
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 500,
  color: 'label.neutral',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'line.normal' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'label.assistive' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'label.assistive' },
  '& .MuiSelect-select': { padding: '16px 20px' },
};

const buttonAreaSx: SxProps<Theme> = {
  width: '498px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
};

const MyPageEditPage = () => {
  const navigate = useNavigate();

  // TODO: API 연동 시 실제 유저 데이터 fetch로 교체
  const user = MOCK_USER;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.name,
      gender: user.gender,
      ageGroup: birthYearToAgeGroup(user.birthYear) as AgeGroup,
      job: user.job,
      researchField: user.researchField,
      purposes: user.purposes,
    },
  });

  const onSubmit: SubmitHandler<ProfileEditForm> = (data) => {
    // TODO: API 연동 시 PATCH /users/me 호출
    console.log('저장할 데이터:', data);
    navigate('/mypage');
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  return (
    <Box sx={containerSx}>
      <Header />
      <Box sx={contentSx}>
        {/* 헤더 */}
        <Box sx={headerRowSx}>
          <IconButton onClick={handleCancel} sx={{ width: 32, height: 32, p: 0 }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 16, color: 'static.black' }} />
          </IconButton>
          <Typography sx={{ fontSize: '24px', fontWeight: 600, color: 'static.black' }}>
            회원 정보 수정
          </Typography>
        </Box>

        {/* 섹션 1: 이름·성별·나이 */}
        <Box sx={{ ...cardSx, padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <Typography sx={sectionTitleSx}>이름 · 성별 · 나이</Typography>

          {/* 이름 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>이름</Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="이름" sx={textFieldSx} />
              )}
            />
          </Box>

          {/* 성별 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>성별</Typography>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  {GENDER_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      onClick={() => field.onChange(option)}
                      sx={{
                        minWidth: '75px',
                        height: '56px',
                        whiteSpace: 'nowrap',
                        padding: '0px 20px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 500,
                        border: '1px solid',
                        ...(field.value === option
                          ? {
                              backgroundColor: 'label.strong',
                              borderColor: 'label.strong',
                              color: 'static.white',
                              '&:hover': { backgroundColor: 'label.neutral' },
                            }
                          : {
                              backgroundColor: 'background.default',
                              borderColor: 'line.normal',
                              color: 'label.neutral',
                              '&:hover': { backgroundColor: 'fill.normal' },
                            }),
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </Box>
              )}
            />
          </Box>

          {/* 나이 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>나이</Typography>
            <Controller
              name="ageGroup"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  sx={selectSx}
                >
                  {AGE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>
        </Box>

        {/* 섹션 2: 역할·전공·연구 분야 */}
        <Box sx={{ ...cardSx, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <Typography sx={sectionTitleSx}>역할 · 전공 · 연구 분야</Typography>

          {/* 역할 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>역할</Typography>
            <Controller
              name="job"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth sx={selectSx}>
                  {JOB_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>

          {/* 전공·연구 분야 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={fieldLabelSx}>전공 · 연구 분야 변경</Typography>
            <Controller
              name="researchField"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="연구 분야를 입력해주세요" sx={textFieldSx} />
              )}
            />
          </Box>
        </Box>

        {/* 섹션 3: 논문 탐색 목적 */}
        <Box sx={{ ...cardSx, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box>
            <Typography sx={sectionTitleSx}>현재 논문 탐색 목적 변경</Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 500, color: 'label.alternative' }}>
              중복 선택 가능
            </Typography>
          </Box>

          <Controller
            name="purposes"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {PURPOSE_OPTIONS.map((purpose) => {
                  const checked = field.value.includes(purpose);
                  return (
                    <Box
                      key={purpose}
                      sx={{ display: 'flex', alignItems: 'center', gap: '22px', cursor: 'pointer' }}
                      onClick={() => {
                        const next = checked
                          ? field.value.filter((p) => p !== purpose)
                          : [...field.value, purpose];
                        field.onChange(next);
                      }}
                    >
                      {/* 커스텀 체크박스 */}
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '6px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: checked ? 'primary.main' : '#DADBE2',
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 16, color: 'static.white' }} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#5D6279',
                        }}
                      >
                        {purpose}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          />
        </Box>

        {/* 버튼 영역 */}
        <Box sx={buttonAreaSx}>
          <Button
            onClick={handleCancel}
            sx={{
              width: '136px',
              height: '45px',
              borderRadius: '7px',
              border: '1px solid',
              borderColor: 'line.normal',
              backgroundColor: 'background.default',
              fontSize: '17px',
              fontWeight: 600,
              color: 'label.neutral',
              '&:hover': { backgroundColor: 'fill.normal' },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            sx={{
              width: '136px',
              height: '45px',
              borderRadius: '7px',
              backgroundColor: 'primary.main',
              fontSize: '17px',
              fontWeight: 600,
              color: 'background.default',
              '&:hover': { backgroundColor: 'primary.dark' },
              '&.Mui-disabled': {
                backgroundColor: 'interaction.disable',
                color: 'label.disable',
              },
            }}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MyPageEditPage;