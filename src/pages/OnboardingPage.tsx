import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import OnboardingCard from "../components/onboarding/OnboardingCard";
import Step1Name from "../components/onboarding/Step1Name";
import Step2Gender from "../components/onboarding/Step2Gender";
import Step3BirthYear from "../components/onboarding/Step3BirthYear";
import Step4Job from "../components/onboarding/Step4Job";
import Step5ResearchField from "../components/onboarding/Step5ResearchField";
import Step6Purpose from "../components/onboarding/Step6Purpose";
import OnboardingComplete from "../components/onboarding/OnboardingComplete";
import { type Gender, type Job, type Purpose } from "../types/user";

const STEP_TITLES: Record<number, string> = {
  1: "바이옴에게 어떤 이름으로 불리고 싶으세요?",
  2: "성별을 선택해주세요",
  3: "몇년생이신가요?",
  4: "지금 어떤 직무에 있으신가요?",
  5: "연구 분야는 어디이신가요?",
  6: "거의 다 왔어요. 논문 탐색 목적을 선택해주세요",
};

const TOTAL_STEPS = 6;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [researchField, setResearchField] = useState("");
  const [purposes, setPurposes] = useState<Purpose[]>([]);

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleStart = () => {
    navigate("/home");
  };

  const isComplete = currentStep > TOTAL_STEPS;

  return (
    <AuthLayout>
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "calc(14.0625 / 100 * (100vh - 64px))",
          paddingBottom: "calc(27.5 / 100 * (100vh - 64px))",
        }}
      >
        {!isComplete && (
          <Box
            sx={{
              width: "503px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "23px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <IconButton onClick={handleBack} size="small" sx={{ p: 0 }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Typography variant="h3" sx={{ color: "label.strong" }}>
                {STEP_TITLES[currentStep]}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "label.strong" }}>
              {currentStep}/{TOTAL_STEPS}
            </Typography>
          </Box>
        )}

        {/* 카드 */}
        <OnboardingCard>
          {currentStep === 1 && (
            <Step1Name value={name} onChange={setName} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <Step2Gender
              value={gender}
              onChange={setGender}
              onNext={handleNext}
            />
          )}
          {currentStep === 3 && (
            <Step3BirthYear
              value={birthYear}
              onChange={setBirthYear}
              onNext={handleNext}
            />
          )}
          {currentStep === 4 && (
            <Step4Job value={job} onChange={setJob} onNext={handleNext} />
          )}
          {currentStep === 5 && (
            <Step5ResearchField
              value={researchField}
              onChange={setResearchField}
              onNext={handleNext}
            />
          )}
          {currentStep === 6 && (
            <Step6Purpose
              value={purposes}
              onChange={setPurposes}
              onNext={handleNext}
            />
          )}
          {isComplete && <OnboardingComplete onStart={handleStart} />}
        </OnboardingCard>
      </Box>
    </AuthLayout>
  );
};

export default OnboardingPage;
