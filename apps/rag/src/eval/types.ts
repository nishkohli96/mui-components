export type EvalQuestion = {
  question: string;
  /**
   * Set false only for questions that are deliberately out-of-scope (e.g.
   * unrelated to this docs site) — the eval then checks the "not covered"
   * guardrail fires instead of checking answer content.
   */
  expectMatch: boolean;
  /** Required when expectMatch is true. The answer must contain each of these (case-insensitive substring match). */
  expectedKeywords?: string[];
  /** Required when expectMatch is true. At least one citation must point to this page. */
  expectedPageUrl?: string;
};

export type EvalResult = {
  question: string;
  passed: boolean;
  failures: string[];
  answer: string;
  citedPageUrls: string[];
};

export type EvalRun = {
  timestamp: string;
  total: number;
  passed: number;
  passRate: number;
  results: EvalResult[];
};
