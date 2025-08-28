import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Moon } from "lucide-react";
import { fetchUserSettings, updateUserSettings, UserSettings } from "@/services/settings";
import { toast } from "sonner";

export default function ProfileSettings() {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const data = await fetchUserSettings();
                setSettings(data);
            } catch (error) {
                console.error("Error loading settings:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const handleSaveNotificationSettings = async () => {
        if (!settings) return;

        setSaving(true);
        try {
            await updateUserSettings({
                email_notifications: settings.email_notifications,
                task_reminders: settings.task_reminders,
                skill_match_alerts: settings.skill_match_alerts,
                dark_mode: settings.dark_mode
            });
            toast.success("Notification settings saved successfully!");
        } catch (error) {
            console.error("Error saving notification settings:", error);
            toast.error("Failed to save notification settings");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAppearanceSettings = async () => {
        if (!settings) return;

        setSaving(true);
        try {
            await updateUserSettings({
                email_notifications: settings.email_notifications,
                task_reminders: settings.task_reminders,
                skill_match_alerts: settings.skill_match_alerts,
                dark_mode: settings.dark_mode
            });
            toast.success("Appearance settings saved successfully!");
        } catch (error) {
            console.error("Error saving appearance settings:", error);
            toast.error("Failed to save appearance settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8">Loading settings...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8">Failed to load settings</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Settings
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Manage how you receive notifications
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive email updates about activity
                            </p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={settings.email_notifications}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, email_notifications: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="task-reminders">Task Reminders</Label>
                            <p className="text-sm text-muted-foreground">
                                Get reminders about upcoming task deadlines
                            </p>
                        </div>
                        <Switch
                            id="task-reminders"
                            checked={settings.task_reminders}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, task_reminders: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="skill-match-alerts">Skill Match Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Be notified when someone matches your skill exchange
                            </p>
                        </div>
                        <Switch
                            id="skill-match-alerts"
                            checked={settings.skill_match_alerts}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, skill_match_alerts: checked })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleSaveNotificationSettings}
                        disabled={saving}
                        className="bg-card-foreground text-card hover:bg-card-foreground/90"
                    >
                        {saving ? "Saving..." : "Save Notification Settings"}
                    </Button>
                </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Moon className="h-5 w-5" />
                        Appearance
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Customize how the application looks
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Switch between light and dark themes
                            </p>
                        </div>
                        <Switch
                            id="dark-mode"
                            checked={settings.dark_mode}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, dark_mode: checked })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleSaveAppearanceSettings}
                        disabled={saving}
                        className="bg-card-foreground text-card hover:bg-card-foreground/90"
                    >
                        {saving ? "Saving..." : "Save Appearance Settings"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}