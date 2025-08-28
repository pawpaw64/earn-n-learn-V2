import PointsModel from '../models/pointsModel.js';

class PointsController {
    // Get user points
    static async getUserPoints(req, res) {
        try {
            const userId = req.user.id;
            const points = await PointsModel.getUserPoints(userId);

            if (!points) {
                // Initialize points if not found
                await PointsModel.initializeUserPoints(userId);
                const newPoints = await PointsModel.getUserPoints(userId);
                return res.json({ success: true, points: newPoints });
            }

            res.json({ success: true, points });
        } catch (error) {
            console.error('Error fetching user points:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch points' });
        }
    }

    // Get points history
    static async getPointsHistory(req, res) {
        try {
            const userId = req.user.id;
            const { limit = 50, offset = 0 } = req.query;

            const history = await PointsModel.getPointsHistory(userId, parseInt(limit), parseInt(offset));

            res.json({ success: true, history });
        } catch (error) {
            console.error('Error fetching points history:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch points history' });
        }
    }

    // Get leaderboard
    static async getLeaderboard(req, res) {
        try {
            const { limit = 10 } = req.query;
            const leaderboard = await PointsModel.getLeaderboard(parseInt(limit));

            res.json({ success: true, leaderboard });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
        }
    }

    // Get user achievements
    static async getUserAchievements(req, res) {
        try {
            const userId = req.user.id;
            const achievements = await PointsModel.getUserAchievements(userId);

            res.json({ success: true, achievements });
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch achievements' });
        }
    }

    // Add points (internal method - can be called from other controllers)
    static async addPointsInternal(userId, points, activityType, description, referenceId = null, referenceType = null) {
        try {
            await PointsModel.addPoints(userId, points, activityType, description, referenceId, referenceType);

            // Check for achievements
            await PointsController.checkAchievements(userId, activityType);

            return true;
        } catch (error) {
            console.error('Error adding points:', error);
            return false;
        }
    }

    // Check and award achievements
    static async checkAchievements(userId, activityType) {
        try {
            const points = await PointsModel.getUserPoints(userId);
            const achievements = await PointsModel.getUserAchievements(userId);

            const existingTypes = achievements.map(a => a.achievement_type);

            // First Task Completed
            if (activityType === 'task_completed' && !existingTypes.includes('first_task')) {
                await PointsModel.addAchievement(
                    userId,
                    'first_task',
                    'First Task Completed',
                    'Completed your first task on the platform',
                    'ribbon',
                    { date: new Date() }
                );
            }

            // Skill Sharer (5 skills shared)
            if (activityType === 'skill_shared' && points.skills_shared_points >= 250 && !existingTypes.includes('skill_sharer')) {
                await PointsModel.addAchievement(
                    userId,
                    'skill_sharer',
                    'Skill Sharer',
                    'Shared 5 skills with the community',
                    'book-open',
                    { skillsShared: 5 }
                );
            }

            // Helping Hand (community participation)
            if (activityType === 'community_participation' && points.community_participation_points >= 150 && !existingTypes.includes('helping_hand')) {
                await PointsModel.addAchievement(
                    userId,
                    'helping_hand',
                    'Helping Hand',
                    'Helped 3 community members with their projects',
                    'heart',
                    { helpCount: 3 }
                );
            }

            // Micro Investor (lending activity)
            if (activityType === 'lending_activity' && points.lending_activity_points >= 100 && !existingTypes.includes('micro_investor')) {
                await PointsModel.addAchievement(
                    userId,
                    'micro_investor',
                    'Micro Investor',
                    'Made your first investment',
                    'gem',
                    { firstInvestment: true }
                );
            }

            // Rising Star (10 positive reviews - would need reviews system)
            // This would require a reviews system to be implemented

        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    }
}

export default PointsController;