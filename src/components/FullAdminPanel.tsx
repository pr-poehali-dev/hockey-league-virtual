import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import type { Team } from './StandingsTable';
import type { Match } from './MatchSchedule';

interface FullAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  matches: Match[];
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => void;
  onAddMatch: (match: Match) => void;
  onLogout: () => void;
  seasonNumber: number;
  onUpdateSeason: (season: number) => void;
}

export default function FullAdminPanel({
  isOpen,
  onClose,
  teams,
  matches,
  onUpdateTeam,
  onUpdateMatch,
  onAddMatch,
  onLogout,
  seasonNumber,
  onUpdateSeason,
}: FullAdminPanelProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [newSeason, setNewSeason] = useState(seasonNumber.toString());

  const handleSaveTeam = (team: Team) => {
    onUpdateTeam(team.id, team);
    setEditingTeam(null);
  };

  const handleSaveMatch = (match: Match) => {
    onUpdateMatch(match.id, match);
    setEditingMatch(null);
  };

  const handleSaveSeason = () => {
    const season = parseInt(newSeason);
    if (!isNaN(season) && season > 0) {
      onUpdateSeason(season);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl">Полная админ-панель</DialogTitle>
            <Button variant="destructive" onClick={onLogout} size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="teams" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teams">Команды</TabsTrigger>
            <TabsTrigger value="matches">Матчи</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4 mt-6">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Команда</TableHead>
                    <TableHead className="text-center">Игры</TableHead>
                    <TableHead className="text-center">Победы</TableHead>
                    <TableHead className="text-center">Поражения</TableHead>
                    <TableHead className="text-center">ОТ/Б</TableHead>
                    <TableHead className="text-center">Забито</TableHead>
                    <TableHead className="text-center">Пропущено</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{team.logo}</span>
                          <span className="font-semibold">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{team.gamesPlayed}</TableCell>
                      <TableCell className="text-center">{team.wins}</TableCell>
                      <TableCell className="text-center">{team.losses}</TableCell>
                      <TableCell className="text-center">{team.overtimeLosses}</TableCell>
                      <TableCell className="text-center">{team.goalsFor}</TableCell>
                      <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTeam(team)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4 mt-6">
            <div className="space-y-2">
              {matches.map((match) => (
                <Card key={match.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-sm text-muted-foreground min-w-[100px]">
                        {match.date} {match.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{match.homeTeam.logo}</span>
                        <span className="font-medium">{match.homeTeam.name}</span>
                      </div>
                      <div className="font-bold">
                        {match.status === 'finished' ? `${match.homeScore}:${match.awayScore}` : 'vs'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{match.awayTeam.logo}</span>
                        <span className="font-medium">{match.awayTeam.name}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMatch(match)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="season">Номер сезона</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="season"
                      type="number"
                      value={newSeason}
                      onChange={(e) => setNewSeason(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button onClick={handleSaveSeason}>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {editingTeam && (
        <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Редактировать команду</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название команды</Label>
                <Input
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Эмодзи (логотип)</Label>
                <Input
                  value={editingTeam.logo}
                  onChange={(e) => setEditingTeam({ ...editingTeam, logo: e.target.value })}
                  placeholder="🏒"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Игры</Label>
                  <Input
                    type="number"
                    value={editingTeam.gamesPlayed}
                    onChange={(e) => setEditingTeam({ ...editingTeam, gamesPlayed: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Победы</Label>
                  <Input
                    type="number"
                    value={editingTeam.wins}
                    onChange={(e) => setEditingTeam({ ...editingTeam, wins: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Поражения</Label>
                  <Input
                    type="number"
                    value={editingTeam.losses}
                    onChange={(e) => setEditingTeam({ ...editingTeam, losses: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Поражения ОТ/Б</Label>
                  <Input
                    type="number"
                    value={editingTeam.overtimeLosses}
                    onChange={(e) => setEditingTeam({ ...editingTeam, overtimeLosses: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Забито</Label>
                  <Input
                    type="number"
                    value={editingTeam.goalsFor}
                    onChange={(e) => setEditingTeam({ ...editingTeam, goalsFor: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Пропущено</Label>
                  <Input
                    type="number"
                    value={editingTeam.goalsAgainst}
                    onChange={(e) => setEditingTeam({ ...editingTeam, goalsAgainst: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTeam(null)}>Отмена</Button>
              <Button onClick={() => handleSaveTeam(editingTeam)}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {editingMatch && (
        <Dialog open={!!editingMatch} onOpenChange={() => setEditingMatch(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Редактировать матч</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата</Label>
                  <Input
                    type="date"
                    value={editingMatch.date}
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Время</Label>
                  <Input
                    type="time"
                    value={editingMatch.time}
                    onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                  />
                </div>
              </div>
              {editingMatch.status === 'finished' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Счет хозяев</Label>
                    <Input
                      type="number"
                      value={editingMatch.homeScore || 0}
                      onChange={(e) => setEditingMatch({ ...editingMatch, homeScore: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Счет гостей</Label>
                    <Input
                      type="number"
                      value={editingMatch.awayScore || 0}
                      onChange={(e) => setEditingMatch({ ...editingMatch, awayScore: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMatch(null)}>Отмена</Button>
              <Button onClick={() => handleSaveMatch(editingMatch)}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
