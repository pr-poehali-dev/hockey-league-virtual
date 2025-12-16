import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'finished' | 'live';
  overtime?: boolean;
  shootout?: boolean;
}

interface MatchScheduleProps {
  matches: Match[];
  onEditResult?: (matchId: string) => void;
}

const getStatusBadge = (status: Match['status']) => {
  const statusConfig = {
    scheduled: { label: 'Запланирован', variant: 'secondary' as const },
    live: { label: 'Live', variant: 'destructive' as const },
    finished: { label: 'Завершен', variant: 'default' as const },
  };
  
  return statusConfig[status];
};

export default function MatchSchedule({ matches, onEditResult }: MatchScheduleProps) {
  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card className="overflow-hidden border-border/50 bg-card/95 backdrop-blur">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-3xl font-bold tracking-tight">Календарь матчей</h2>
        <p className="text-muted-foreground mt-1">Расписание и результаты игр</p>
      </div>

      <div className="divide-y divide-border/30">
        {sortedMatches.map((match, index) => {
          const statusBadge = getStatusBadge(match.status);
          const isFinished = match.status === 'finished';
          
          return (
            <div 
              key={match.id} 
              className="p-6 hover:bg-muted/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-[120px]">
                  <div className="text-sm text-muted-foreground">
                    <div className="font-semibold">{match.date}</div>
                    <div className="text-xs">{match.time}</div>
                  </div>
                  <Badge variant={statusBadge.variant} className="animate-pulse-soft">
                    {statusBadge.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 flex-1 justify-center max-w-2xl">
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-semibold text-right">{match.homeTeam.name}</span>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                      {match.homeTeam.logo}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 min-w-[120px] justify-center">
                    {isFinished ? (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold tabular-nums">{match.homeScore}</span>
                        <span className="text-2xl text-muted-foreground">:</span>
                        <span className="text-3xl font-bold tabular-nums">{match.awayScore}</span>
                        {(match.overtime || match.shootout) && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {match.overtime ? 'ОТ' : 'Б'}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">vs</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                      {match.awayTeam.logo}
                    </div>
                    <span className="font-semibold text-left">{match.awayTeam.name}</span>
                  </div>
                </div>

                {onEditResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditResult(match.id)}
                    className="min-w-[120px]"
                  >
                    <Icon name="Edit" size={16} className="mr-2" />
                    {isFinished ? 'Изменить' : 'Внести счет'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
