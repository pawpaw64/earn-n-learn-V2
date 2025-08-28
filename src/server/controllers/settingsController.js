import SettingsModel from '../models/settingsModel.js';

class SettingsController {
    // Get user settings
    static async getUserSettings(req, res) {
        try {
            const userId = req.user.id;
            let settings = await SettingsModel.getUserSettings(userId);

            if (!settings) {
                // Initialize settings if not found
                await SettingsModel.initializeUserSettings(userId);
                settings = await SettingsModel.getUserSettings(userId);
            }

            res.json({ success: true, settings });
        } catch (error) {
            console.error('Error fetching user settings:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch settings' });
        }
    }

    // Update user settings
    static async updateUserSettings(req, res) {
        try {
            const userId = req.user.id;
            const { emailNotifications, taskReminders, skillMatchAlerts, darkMode } = req.body;

            const updated = await SettingsModel.updateUserSettings(userId, {
                emailNotifications,
                taskReminders,
                skillMatchAlerts,
                darkMode
            });

            if (updated) {
                res.json({ success: true, message: 'Settings updated successfully' });
            } else {
                res.status(400).json({ success: false, message: 'Failed to update settings' });
            }
        } catch (error) {
            console.error('Error updating user settings:', error);
            res.status(500).json({ success: false, message: 'Failed to update settings' });
        }
    }
}

export default SettingsController;