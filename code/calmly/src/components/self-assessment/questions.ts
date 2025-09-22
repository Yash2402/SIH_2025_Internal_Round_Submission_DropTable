// src/lib/questionnaires.ts

export interface Question {
  id: number;
  text: string;
}

// The 9 questions for the Patient Health Questionnaire (Depression)
export const phq9Questions: Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things" },
  { id: 2, text: "Feeling down, depressed, or hopeless" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
  { id: 4, text: "Feeling tired or having little energy" },
  { id: 5, text: "Poor appetite or overeating" },
  { id: 6, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
  { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
  { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
  { id: 9, text: "Thoughts that you would be better off dead or of hurting yourself in some way" },
];

// The 7 questions for the Generalized Anxiety Disorder questionnaire
export const gad7Questions: Question[] = [
    { id: 1, text: "Feeling nervous, anxious, or on edge" },
    { id: 2, text: "Not being able to stop or control worrying" },
    { id: 3, text: "Worrying too much about different things" },
    { id: 4, text: "Trouble relaxing" },
    { id: 5, text: "Being so restless that it's hard to sit still" },
    { id: 6, text: "Becoming easily annoyed or irritable" },
    { id: 7, text: "Feeling afraid as if something awful might happen" },
];

// The standardized answer options and their corresponding point values
export const answerOptions = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

// These functions will be used on the results page to interpret the scores
export const getPhq9Interpretation = (score: number) => {
  if (score >= 20) return { level: "Severe Depression", risk: "High" };
  if (score >= 15) return { level: "Moderately Severe Depression", risk: "Moderate to High" };
  if (score >= 10) return { level: "Moderate Depression", risk: "Moderate" };
  if (score >= 5) return { level: "Mild Depression", risk: "Low" };
  return { level: "Minimal Depression", risk: "Minimal" };
};

export const getGad7Interpretation = (score: number) => {
    if (score >= 15) return { level: "Severe Anxiety", risk: "High" };
    if (score >= 10) return { level: "Moderate Anxiety", risk: "Moderate" };
    if (score >= 5) return { level: "Mild Anxiety", risk: "Low" };
    return { level: "Minimal Anxiety", risk: "Minimal" };
};