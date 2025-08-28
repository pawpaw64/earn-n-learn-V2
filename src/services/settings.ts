import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface UserSettings {
    email_notifications: boolean;
    task_reminders: boolean;
    skill_match_alerts: boolean;
    dark_mode: boolean;
    created_at: string;
    updated_at: string;
}

export const fetchUserSettings = async (): Promise<UserSettings | null> => {
    setAuthToken(localStorage.getItem('token'));
    try {
        const response = await axios.get(`${API_URL}/settings`);
        return response.data.settings;
    } catch (error) {
        console.error("Error fetching user settings:", error);
        return null;
    }
};

export const updateUserSettings = async (settings: Partial<UserSettings>) => {
    setAuthToken(localStorage.getItem('token'));
    try {
        const response = await axios.put(`${API_URL}/settings`, {
            emailNotifications: settings.email_notifications,
            taskReminders: settings.task_reminders,
            skillMatchAlerts: settings.skill_match_alerts,
            darkMode: settings.dark_mode
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user settings:", error);
        throw error;
    }
};