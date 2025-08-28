import { execute } from '../config/db.js';

class PointsModel {
    // Get user points with breakdown
    static async getUserPoints(userId) {
        try {
            const result = await execute(
                `SELECT 
          points,
          tasks_completed_points,
          skills_shared_points,
          community_participation_points,
          lending_activity_points,
          created_at,
          updated_at
        FROM user_points 
        WHERE user_id = ?`,
                [userId]
            );

            return Array.isArray(result) ? result[0] : result.rows?.[0] || null;
        } catch (error) {
            console.error('Database error in getUserPoints:', error);
            throw new Error(error.message);
        }
    }

    // Get points history for a user
    static async getPointsHistory(userId, limit = 50, offset = 0) {
        try {
            const result = await execute(
                `SELECT 
          points_earned,
          activity_type,
          description,
          reference_id,
          reference_type,
          created_at
        FROM points_history 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`,
                [userId, limit, offset]
            );

            return Array.isArray(result) ? result : result.rows || [];
        } catch (error) {
            console.error('Database error in getPointsHistory:', error);
            throw new Error(error.message);
        }
    }

    // Add points to user
    static async addPoints(userId, points, activityType, description, referenceId = null, referenceType = null) {
        try {
            // Start transaction
            await execute('START TRANSACTION');

            // Insert into points history
            await execute(
                `INSERT INTO points_history 
        (user_id, points_earned, activity_type, description, reference_id, reference_type) 
        VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, points, activityType, description, referenceId, referenceType]
            );

            // Update user points
            const columnMap = {
                'task_completed': 'tasks_completed_points',
                'skill_shared': 'skills_shared_points',
                'community_participation': 'community_participation_points',
                'lending_activity': 'lending_activity_points'
            };

            const column = columnMap[activityType];
            if (column) {
                await execute(
                    `UPDATE user_points 
          SET points = points + ?, ${column} = ${column} + ?
          WHERE user_id = ?`,
                    [points, points, userId]
                );
            } else {
                await execute(
                    `UPDATE user_points 
          SET points = points + ?
          WHERE user_id = ?`,
                    [points, userId]
                );
            }

            await execute('COMMIT');
            return true;
        } catch (error) {
            await execute('ROLLBACK');
            console.error('Database error in addPoints:', error);
            throw new Error(error.message);
        }
    }

    // Get leaderboard
    static async getLeaderboard(limit = 10) {
        try {
            const result = await execute(
                `SELECT 
          u.id,
          u.name,
          u.avatar,
          up.points,
          up.tasks_completed_points,
          up.skills_shared_points,
          up.community_participation_points,
          up.lending_activity_points,
          (SELECT COUNT(*) FROM applications WHERE user_id = u.id) as tasks_count,
          (SELECT COUNT(*) FROM skill_marketplace WHERE user_id = u.id) as skills_count
        FROM users u
        JOIN user_points up ON u.id = up.user_id
        ORDER BY up.points DESC
        LIMIT ?`,
                [limit]
            );

            return Array.isArray(result) ? result : result.rows || [];
        } catch (error) {
            console.error('Database error in getLeaderboard:', error);
            throw new Error(error.message);
        }
    }

    // Initialize points for new user
    static async initializeUserPoints(userId) {
        try {
            await execute(
                `INSERT IGNORE INTO user_points (user_id, points) VALUES (?, 0)`,
                [userId]
            );
            return true;
        } catch (error) {
            console.error('Database error in initializeUserPoints:', error);
            throw new Error(error.message);
        }
    }

    // Get user achievements
    static async getUserAchievements(userId) {
        try {
            const result = await execute(
                `SELECT 
          achievement_type,
          title,
          description,
          icon,
          earned_at,
          metadata
        FROM user_achievements 
        WHERE user_id = ? 
        ORDER BY earned_at DESC`,
                [userId]
            );

            return Array.isArray(result) ? result : result.rows || [];
        } catch (error) {
            console.error('Database error in getUserAchievements:', error);
            throw new Error(error.message);
        }
    }

    // Add achievement
    static async addAchievement(userId, achievementType, title, description, icon, metadata = null) {
        try {
            await execute(
                `INSERT INTO user_achievements 
        (user_id, achievement_type, title, description, icon, metadata) 
        VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, achievementType, title, description, icon, metadata ? JSON.stringify(metadata) : null]
            );
            return true;
        } catch (error) {
            console.error('Database error in addAchievement:', error);
            throw new Error(error.message);
        }
    }
}

export default PointsModel;