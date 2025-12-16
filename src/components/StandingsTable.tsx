import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Team {
  id: string;
  name: string;
  logo: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  overtimeLosses: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface StandingsTableProps {
  teams: Team[];
}

const calculatePoints = (wins: number, overtimeLosses: number): number => {
  return wins * 2 + overtimeLosses * 1;
};

const calculateGoalDiff = (goalsFor: number, goalsAgainst: number): number => {
  return goalsFor - goalsAgainst;
};

const getRowClassName = (position: number): string => {
  if (position === 7 || position === 8) {
    return 'bg-danger-zone/10 border-l-4 border-l-danger-zone hover:bg-danger-zone/20';
  }
  if (position === 6) {
    return 'bg-playoff-zone/10 border-l-4 border-l-playoff-zone hover:bg-playoff-zone/20';
  }
  return 'hover:bg-muted/50';
};

export default function StandingsTable({ teams }: StandingsTableProps) {
  const sortedTeams = [...teams].sort((a, b) => {
    const pointsA = calculatePoints(a.wins, a.overtimeLosses);
    const pointsB = calculatePoints(b.wins, b.overtimeLosses);
    
    if (pointsB !== pointsA) return pointsB - pointsA;
    
    const diffA = calculateGoalDiff(a.goalsFor, a.goalsAgainst);
    const diffB = calculateGoalDiff(b.goalsFor, b.goalsAgainst);
    
    if (diffB !== diffA) return diffB - diffA;
    
    return b.goalsFor - a.goalsFor;
  });

  return (
    <Card className="overflow-hidden border-border/50 bg-card/95 backdrop-blur">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-3xl font-bold tracking-tight">Турнирная таблица</h2>
        <p className="text-muted-foreground mt-1">Сезон 2024/2025</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-12 text-center font-semibold">#</TableHead>
              <TableHead className="min-w-[200px] font-semibold">Команда</TableHead>
              <TableHead className="text-center font-semibold">Игры</TableHead>
              <TableHead className="text-center font-semibold">Победы</TableHead>
              <TableHead className="text-center font-semibold">Поражения</TableHead>
              <TableHead className="text-center font-semibold">Поражения ОТ/Б</TableHead>
              <TableHead className="text-center font-semibold">Очки</TableHead>
              <TableHead className="text-center font-semibold">Забито</TableHead>
              <TableHead className="text-center font-semibold">Пропущено</TableHead>
              <TableHead className="text-center font-semibold">+/-</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.map((team, index) => {
              const position = index + 1;
              const points = calculatePoints(team.wins, team.overtimeLosses);
              const goalDiff = calculateGoalDiff(team.goalsFor, team.goalsAgainst);
              
              return (
                <TableRow 
                  key={team.id} 
                  className={`${getRowClassName(position)} transition-all duration-300 border-border/30 animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TableCell className="text-center font-bold text-lg">{position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl font-bold overflow-hidden">
                        {team.logo}
                      </div>
                      <span className="font-semibold text-base">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{team.gamesPlayed}</TableCell>
                  <TableCell className="text-center font-medium text-green-400">{team.wins}</TableCell>
                  <TableCell className="text-center font-medium text-red-400">{team.losses}</TableCell>
                  <TableCell className="text-center font-medium text-yellow-400">{team.overtimeLosses}</TableCell>
                  <TableCell className="text-center font-bold text-xl text-primary">{points}</TableCell>
                  <TableCell className="text-center font-medium">{team.goalsFor}</TableCell>
                  <TableCell className="text-center font-medium">{team.goalsAgainst}</TableCell>
                  <TableCell className={`text-center font-bold ${goalDiff > 0 ? 'text-green-400' : goalDiff < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {goalDiff > 0 ? '+' : ''}{goalDiff}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t border-border/50 bg-muted/30 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-danger-zone/40 border-l-2 border-l-danger-zone"></div>
          <span className="text-muted-foreground">Зона вылета (7-8 места)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-playoff-zone/40 border-l-2 border-l-playoff-zone"></div>
          <span className="text-muted-foreground">Переходная зона (6 место)</span>
        </div>
      </div>
    </Card>
  );
}
