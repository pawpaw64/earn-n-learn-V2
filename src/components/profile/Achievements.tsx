import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Heart, Gem, Star, BookOpen } from "lucide-react";
import { fetchUserAchievements, Achievement } from "@/services/points";
import { formatDistanceToNow } from "date-fns";

const getAchievementIcon = (icon: string) => {
    switch (icon) {
        case 'ribbon': return Trophy;
        case 'book-open': return BookOpen;
        case 'heart': return Heart;
        case 'gem': return Gem;
        case 'star': return Star;
        default: return Award;
    }
};

export default function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAchievements = async () => {
            setLoading(true);
            try {
                const data = await fetchUserAchievements();
                setAchievements(data);
            } catch (error) {
                console.error("Error loading achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAchievements();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Badges & Achievements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">Loading achievements...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Badges & Achievements
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Showcase your achievements and milestones on the platform
                </p>
            </CardHeader>
            <CardContent>
                {achievements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No achievements earned yet. Keep participating to earn badges!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement, index) => {
                            const IconComponent = getAchievementIcon(achievement.icon);
                            return (
                                <div key={index} className="text-center space-y-2 p-4 border rounded-lg">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                            <IconComponent className="w-8 h-8 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold">{achievement.title}</h3>
                                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                    <Badge variant="outline" className="text-xs">
                                        {formatDistanceToNow(new Date(achievement.earned_at), { addSuffix: true })}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}