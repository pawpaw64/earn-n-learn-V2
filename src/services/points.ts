import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface UserPoints {
    points: number;
    tasks_completed_points: number;
    skills_shared_points: number;
    community_participation_points: number;
    lending_activity_points: number;
    created_at: string;
    updated_at: string;
}

export interface PointsHistoryItem {
    points_earned: number;
    activity_type: 'task_completed' | 'skill_shared' | 'community_participation' | 'lending_activity';
    description: string;
    reference_id?: number;
    reference_type?: string;
    created_at: string;
}

export interface LeaderboardItem {
    id: number;
    name: string;
    avatar?: string;
    points: number;
    tasks_completed_points: number;
    skills_shared_points: number;
    community_participation_points: number;
    lending_activity_points: number;
    tasks_count: number;
    skills_count: number;
}

export interface Achievement {
    achievement_type: string;
    title: string;
    description: string;
    icon: string;
    earned_at: string;
    metadata?: any;
}

export const fetchUserPoints = async (): Promise<UserPoints | null> => {
    setAuthToken(localStorage.getItem('token'));
    try {
        const response = await axios.get(`${API_URL}/points`);
        return response.data.points;
    } catch (error) {
        console.error("Error fetching user points:", error);
        return null;
    }
};

export const fetchPointsHistory = async (limit = 50, offset = 0): Promise<PointsHistoryItem[]> => {
    setAuthToken(localStorage.getItem('token'));
    try {
        const response = await axios.get(`${API_URL}/points/history?limit=${limit}&offset=${offset}`);
        return response.data.history;
    } catch (error) {
        console.error("Error fetching points history:", error);
        return [];
    }
};

export const fetchLeaderboard = async (limit = 10): Promise<LeaderboardItem[]> => {
    setAuthToken(localStorage.getItem('token'));
    try {
        const response = await axios.get(`${API_URL}/leaderboard?limit=${limit}`);
        return response.data.leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};

export const fetchUserAchievements = async (): Promise<Achievement[]> => {
    setAuthToken(localStorage.getItem('token'));
    try {
        const response = await axios.get(`${API_URL}/achievements`);
        return response.data.achievements;
    } catch (error) {
        console.error("Error fetching user achievements:", error);
        return [];
    }
};