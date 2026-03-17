export interface Idea {
  id: string;
  name: string;
  problem: string;
  targetAudience: string;
  solution: string;
  howItWorks: string;
  whyUseful: string;
  differential: string;
  expectedResult: string;
  createdAt: number;
}

export type Pillar = 'problem' | 'audience' | 'solution' | 'impact';
