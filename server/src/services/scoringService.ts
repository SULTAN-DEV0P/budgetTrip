import { Place } from '../types/index.js';

export const scoringService = {
  scorePlaces(places: Place[], interests: string[] = [], targetBudgetPerUnit?: number): Place[] {
    return [...places].sort((a, b) => {
      const scoreA = this.calculateScore(a, interests, targetBudgetPerUnit);
      const scoreB = this.calculateScore(b, interests, targetBudgetPerUnit);
      return scoreB - scoreA;
    });
  },

  calculateScore(place: Place, userInterests: string[] = [], targetBudgetPerUnit?: number): number {
    // 1. Rating Score (0 to 25 points)
    const ratingScore = (place.rating / 5) * 25;

    // 2. Interest Score (0 to 20 points)
    let interestScore = 0;
    if (userInterests.length > 0 && place.tags) {
      const lowerTags = place.tags.map((t) => t.toLowerCase());
      userInterests.forEach((interest) => {
        if (lowerTags.some((t) => t.includes(interest.toLowerCase()))) {
          interestScore += 10;
        }
      });
      interestScore = Math.min(20, interestScore);
    }

    // 3. Distance Score (0 to 15 points)
    const dist = place.distanceKm || 2.5;
    const distanceScore = Math.max(0, 15 - dist * 2);

    // 4. Budget Score (0 to 40 points)
    let budgetScore = 30; // Default healthy score
    if (targetBudgetPerUnit && targetBudgetPerUnit > 0) {
      const ratio = place.estimatedPrice / targetBudgetPerUnit;
      if (ratio <= 1.0) {
        budgetScore = 40;
      } else if (ratio <= 1.3) {
        budgetScore = 25;
      } else {
        budgetScore = Math.max(0, 40 - (ratio - 1) * 30);
      }
    }

    return ratingScore + interestScore + distanceScore + budgetScore;
  },
};
