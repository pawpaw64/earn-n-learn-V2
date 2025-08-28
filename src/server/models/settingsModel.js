import { execute } from '../config/db.js';

class SettingsModel {
    // Get user settings
    static async getUserSettings(userId) {
        try {
            const result = await execute(
                `SELECT 
          email_notifications,
          task_reminders,
          skill_match_alerts,
          dark_mode,
          created_at,
          updated_at
        FROM user_settings 
        WHERE user_id = ?`,
                [userId]
            );

            return Array.isArray(result) ? result[0] : result.rows?.[0] || null;
        } catch (error) {
            console.error('Database error in getUserSettings:', error);
            throw new Error(error.message);
        }
    }

    // Update user settings
    static async updateUserSettings(userId, settings) {
        const { emailNotifications, taskReminders, skillMatchAlerts, darkMode } = settings;

        try {
            const result = await execute(
                `UPDATE user_settings 
        SET email_notifications = ?, task_reminders = ?, skill_match_alerts = ?, dark_mode = ?
        WHERE user_id = ?`,
                [emailNotifications, taskReminders, skillMatchAlerts, darkMode, userId]
            );

            return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in updateUserSettings:', error);
            throw new Error(error.message);
        }
    }

    // Initialize settings for new user
    static async initializeUserSettings(userId) {
        try {
            await execute(
                `INSERT IGNORE INTO user_settings (user_id) VALUES (?)`,
                [userId]
            );
            return true;
        } catch (error) {
            console.error('Database error in initializeUserSettings:', error);
            throw new Error(error.message);
        }
    }
}

export default SettingsModel;