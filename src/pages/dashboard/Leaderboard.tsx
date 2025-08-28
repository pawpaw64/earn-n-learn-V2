import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, User } from "lucide-react";
import { fetchLeaderboard, LeaderboardItem } from "@/services/points";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await fetchLeaderboard(20);
                setLeaderboard(data);
            } catch (error) {
                console.error("Error loading leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 1: return <Medal className="h-5 w-5 text-gray-400" />;
            case 2: return <Award className="h-5 w-5 text-amber-600" />;
            default: return <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8">Loading leaderboard...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">See who's leading in points and contributions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Top Contributors
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No leaderboard data available
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((user, index) => (
                                <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-center w-10 h-10">
                                        {getRankIcon(index)}
                                    </div>

                                    <Avatar className="h-12 w-12">
                                        {user.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                        ) : (
                                            <AvatarFallback>
                                                <User className="h-6 w-6" />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.tasks_count} tasks • {user.skills_count} skills shared
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{user.points}</div>
                                        <div className="text-sm text-muted-foreground">points</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}