import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { fetchUserPoints, fetchPointsHistory, UserPoints, PointsHistoryItem } from "@/services/points";
import { formatDistanceToNow } from "date-fns";

export default function PointsOverview() {
    const [points, setPoints] = useState<UserPoints | null>(null);
    const [history, setHistory] = useState<PointsHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [pointsData, historyData] = await Promise.all([
                    fetchUserPoints(),
                    fetchPointsHistory(20)
                ]);

                setPoints(pointsData);
                setHistory(historyData);
            } catch (error) {
                console.error("Error loading points data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Points Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">Loading points data...</div>
                </CardContent>
            </Card>
        );
    }

    if (!points) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Points Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">No points data available</div>
                </CardContent>
            </Card>
        );
    }

    const currentMonth = new Date().getMonth();
    const currentMonthHistory = history.filter(item =>
        new Date(item.created_at).getMonth() === currentMonth
    );
    const monthlyGain = currentMonthHistory.reduce((sum, item) => sum + item.points_earned, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Points Overview
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Track your points and see how you're earning them
                </p>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold">{points.points} Points</h3>
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                    <TrendingUp className="h-4 w-4" />
                                    +{monthlyGain} this month
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Project/Work Completed</span>
                                    <span className="text-sm text-muted-foreground">{points.tasks_completed_points} points</span>
                                </div>
                                <Progress
                                    value={(points.tasks_completed_points / points.points) * 100}
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Skills Shared</span>
                                    <span className="text-sm text-muted-foreground">{points.skills_shared_points} points</span>
                                </div>
                                <Progress
                                    value={(points.skills_shared_points / points.points) * 100}
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Community Participation</span>
                                    <span className="text-sm text-muted-foreground">{points.community_participation_points} points</span>
                                </div>
                                <Progress
                                    value={(points.community_participation_points / points.points) * 100}
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Material Exchange</span>
                                    <span className="text-sm text-muted-foreground">{points.lending_activity_points} points</span>
                                </div>
                                <Progress
                                    value={(points.lending_activity_points / points.points) * 100}
                                    className="h-2"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        {history.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No points history available
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.description}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="font-bold">
                                            +{item.points_earned}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}