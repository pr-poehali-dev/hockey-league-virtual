import { useState } from 'react';
import StandingsTable, { Team } from '@/components/StandingsTable';
import MatchSchedule, { Match } from '@/components/MatchSchedule';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const initialTeams: Team[] = [
  { id: '1', name: 'Северные Волки', logo: '🐺', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '2', name: 'Ледяные Драконы', logo: '🐉', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '3', name: 'Стальные Медведи', logo: '🐻', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '4', name: 'Огненные Тигры', logo: '🐯', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '5', name: 'Морские Акулы', logo: '🦈', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '6', name: 'Снежные Барсы', logo: '🐆', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '7', name: 'Грозовые Орлы', logo: '🦅', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
  { id: '8', name: 'Лесные Рыси', logo: '🐱', gamesPlayed: 0, wins: 0, losses: 0, overtimeLosses: 0, goalsFor: 0, goalsAgainst: 0 },
];

const initialMatches: Match[] = [
  {
    id: 'm1',
    date: '2024-12-20',
    time: '19:00',
    homeTeam: { id: '1', name: 'Северные Волки', logo: '🐺' },
    awayTeam: { id: '2', name: 'Ледяные Драконы', logo: '🐉' },
    status: 'scheduled',
  },
  {
    id: 'm2',
    date: '2024-12-20',
    time: '21:00',
    homeTeam: { id: '3', name: 'Стальные Медведи', logo: '🐻' },
    awayTeam: { id: '4', name: 'Огненные Тигры', logo: '🐯' },
    status: 'scheduled',
  },
  {
    id: 'm3',
    date: '2024-12-21',
    time: '19:00',
    homeTeam: { id: '5', name: 'Морские Акулы', logo: '🦈' },
    awayTeam: { id: '6', name: 'Снежные Барсы', logo: '🐆' },
    status: 'scheduled',
  },
  {
    id: 'm4',
    date: '2024-12-21',
    time: '21:00',
    homeTeam: { id: '7', name: 'Грозовые Орлы', logo: '🦅' },
    awayTeam: { id: '8', name: 'Лесные Рыси', logo: '🐱' },
    status: 'scheduled',
  },
  {
    id: 'm5',
    date: '2024-12-22',
    time: '19:00',
    homeTeam: { id: '2', name: 'Ледяные Драконы', logo: '🐉' },
    awayTeam: { id: '3', name: 'Стальные Медведи', logo: '🐻' },
    status: 'scheduled',
  },
  {
    id: 'm6',
    date: '2024-12-22',
    time: '21:00',
    homeTeam: { id: '4', name: 'Огненные Тигры', logo: '🐯' },
    awayTeam: { id: '5', name: 'Морские Акулы', logo: '🦈' },
    status: 'scheduled',
  },
];

export default function Index() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleEditResult = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
      setIsAdminOpen(true);
    }
  };

  const handleSaveResult = (matchId: string, homeScore: number, awayScore: number, overtime: boolean, shootout: boolean) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          homeScore,
          awayScore,
          status: 'finished' as const,
          overtime,
          shootout,
        };
      }
      return m;
    });
    setMatches(updatedMatches);

    const updatedTeams = teams.map(team => {
      const teamCopy = { ...team };

      if (team.id === match.homeTeam.id) {
        teamCopy.gamesPlayed += 1;
        teamCopy.goalsFor += homeScore;
        teamCopy.goalsAgainst += awayScore;

        if (homeScore > awayScore) {
          teamCopy.wins += 1;
        } else {
          if (overtime || shootout) {
            teamCopy.overtimeLosses += 1;
          } else {
            teamCopy.losses += 1;
          }
        }
      }

      if (team.id === match.awayTeam.id) {
        teamCopy.gamesPlayed += 1;
        teamCopy.goalsFor += awayScore;
        teamCopy.goalsAgainst += homeScore;

        if (awayScore > homeScore) {
          teamCopy.wins += 1;
        } else {
          if (overtime || shootout) {
            teamCopy.overtimeLosses += 1;
          } else {
            teamCopy.losses += 1;
          }
        }
      }

      return teamCopy;
    });

    setTeams(updatedTeams);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-2 flex items-center gap-3">
                <span className="text-4xl">🏒</span>
                Первая Хоккейная Лига
              </h1>
              <p className="text-muted-foreground text-lg">Виртуальная лига в игре Puck</p>
            </div>
            <Button size="lg" className="gap-2">
              <Icon name="Users" size={20} />
              Статистика игроков
            </Button>
          </div>
        </header>

        <Tabs defaultValue="standings" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="standings" className="text-base gap-2">
              <Icon name="Trophy" size={18} />
              Таблица
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-base gap-2">
              <Icon name="Calendar" size={18} />
              Календарь
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="animate-fade-in">
            <StandingsTable teams={teams} />
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <MatchSchedule matches={matches} onEditResult={handleEditResult} />
          </TabsContent>
        </Tabs>
      </div>

      <AdminPanel
        match={selectedMatch}
        teams={teams}
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setSelectedMatch(null);
        }}
        onSave={handleSaveResult}
      />
    </div>
  );
}
