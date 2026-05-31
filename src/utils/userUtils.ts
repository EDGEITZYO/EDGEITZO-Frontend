export const birthYearToAgeGroup = (birthYear: number): string => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear + 1;
  const decade = Math.floor(age / 10) * 10;
  return `${decade}대`;
};

export const ageGroupToLabel = (birthYear: number): string => {
  return birthYearToAgeGroup(birthYear);
};
