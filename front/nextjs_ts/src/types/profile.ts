export interface Profile {
    weeklyBudget: number;
    maxPrepTime: number;
    difficultyLevel: 'Easy' | 'Medium' | 'Hard';
    dietaryPreferences: string[];
};
