import { Profile } from '@/types/profile';

export function getDifficultyOptions(selectedDifficulty: Profile['difficultyLevel']): Profile['difficultyLevel'][] {
    const allOptions: Profile['difficultyLevel'][] = ['Easy', 'Medium', 'Hard'];
    const index = allOptions.indexOf(selectedDifficulty);
    if (index === -1) {
        return [];
    }
    return allOptions.slice(0, index + 1);
}