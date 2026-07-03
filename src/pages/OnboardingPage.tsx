import { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Step1Name from "../components/onboarding/Step1Name";
import Step2Gender from "../components/onboarding/Step2Gender";
import Step3BirthYear from "../components/onboarding/Step3BirthYear";
import Step4Job from "../components/onboarding/Step4Job";
import Step5ResearchField from "../components/onboarding/Step5ResearchField";
import Step6Purpose from "../components/onboarding/Step6Purpose";
import OnboardingComplete from "../components/onboarding/OnboardingComplete";
import { type Gender, type Role, type Purpose } from "../types/user";
import { authApi } from "../api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { mypageKeys } from "../queries/keys";

const TOTAL_STEPS = 6;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromSignupFlow = !!location.state;
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [job, setJob] = useState<Role | null>(null);
  const [researchField, setResearchField] = useState("");
  const [purposes, setPurposes] = useState<Purpose[]>([]);

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    else navigate("/signup/complete");
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleStart = async () => {
    if (!gender || !birthYear || !job) return;
    const currentYear = new Date().getFullYear();
    const age = Math.floor((currentYear - birthYear + 1) / 10) * 10;
    const ageGroup = `${age}대`;
    try {
      await authApi.createProfile({
        name,
        gender,
        age: ageGroup,
        role: job,
        research_field: researchField,
        purposes,
        purpose_custom: undefined,
      });
      queryClient.invalidateQueries({ queryKey: mypageKeys.detail() });
      navigate("/home", { replace: true });
    } catch {
      // TODO: 에러 처리
    }
  };

  const isComplete = currentStep > TOTAL_STEPS;

  return (
    <AuthLayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: "240px",
          "@media (min-width: 600px) and (max-width: 1199px)": {
            py: "302px",
          },
          "@media (max-width: 599px)": {
            py: 0,
            alignItems: "stretch",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "940px",
            justifyContent: "center",
            "@media (min-width: 600px) and (max-width: 1199px)": {
              width: "480px",
            },
            "@media (max-width: 599px)": {
              width: "100%",
            },
          }}
        >
          {currentStep === 1 && (
            <Step1Name
              value={name}
              onChange={setName}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              showBackButton={cameFromSignupFlow}
            />
          )}
          {currentStep === 2 && (
            <Step2Gender
              value={gender}
              onChange={setGender}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          )}
          {currentStep === 3 && (
            <Step3BirthYear
              value={birthYear}
              onChange={setBirthYear}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          )}
          {currentStep === 4 && (
            <Step4Job
              value={job}
              onChange={setJob}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          )}
          {currentStep === 5 && (
            <Step5ResearchField
              value={researchField}
              onChange={setResearchField}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          )}
          {currentStep === 6 && (
            <Step6Purpose
              value={purposes}
              onChange={setPurposes}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          )}
          {isComplete && (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                "@media (max-width: 599px)": {
                  padding: "0 16px",
                  minHeight: "100vh",
                  alignItems: "center",
                },
              }}
            >
              <Box
                sx={{
                  "@media (max-width: 599px)": {
                    display: "flex",
                    padding: "24px 0 32px 0",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "54px",
                    alignSelf: "stretch",
                  },
                }}
              >
                <OnboardingComplete onStart={handleStart} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default OnboardingPage;
