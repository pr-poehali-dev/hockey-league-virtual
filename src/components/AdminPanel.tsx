import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import type { Match } from './MatchSchedule';
import type { Team } from './StandingsTable';

interface AdminPanelProps {
  match: Match | null;
  teams: Team[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (matchId: string, homeScore: number, awayScore: number, overtime: boolean, shootout: boolean) => void;
}

export default function AdminPanel({ match, teams, isOpen, onClose, onSave }: AdminPanelProps) {
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [overtime, setOvertime] = useState(false);
  const [shootout, setShootout] = useState(false);

  const handleOpen = (open: boolean) => {
    if (!open) {
      setHomeScore('');
      setAwayScore('');
      setOvertime(false);
      setShootout(false);
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!match) return;
    
    const home = parseInt(homeScore);
    const away = parseInt(awayScore);
    
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      alert('Пожалуйста, введите корректный счет');
      return;
    }

    if (home === away) {
      alert('Счет не может быть равным. Укажите победителя в ОТ или буллитах');
      return;
    }

    onSave(match.id, home, away, overtime, shootout);
    handleOpen(false);
  };

  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Внести результат матча</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                {match.homeTeam.logo}
              </div>
              <span className="font-semibold text-sm">{match.homeTeam.name}</span>
            </div>
            
            <span className="text-muted-foreground text-sm">vs</span>
            
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="font-semibold text-sm text-right">{match.awayTeam.name}</span>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                {match.awayTeam.logo}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeScore">Счет хозяев</Label>
              <Input
                id="homeScore"
                type="number"
                min="0"
                placeholder="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="text-lg font-bold text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="awayScore">Счет гостей</Label>
              <Input
                id="awayScore"
                type="number"
                min="0"
                placeholder="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="text-lg font-bold text-center"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Clock" size={20} className="text-muted-foreground" />
                <div>
                  <Label htmlFor="overtime" className="cursor-pointer">Овертайм</Label>
                  <p className="text-xs text-muted-foreground">Матч решен в дополнительное время</p>
                </div>
              </div>
              <Switch
                id="overtime"
                checked={overtime}
                onCheckedChange={(checked) => {
                  setOvertime(checked);
                  if (checked) setShootout(false);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Target" size={20} className="text-muted-foreground" />
                <div>
                  <Label htmlFor="shootout" className="cursor-pointer">Буллиты</Label>
                  <p className="text-xs text-muted-foreground">Матч решен в серии буллитов</p>
                </div>
              </div>
              <Switch
                id="shootout"
                checked={shootout}
                onCheckedChange={(checked) => {
                  setShootout(checked);
                  if (checked) setOvertime(false);
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} className="min-w-[120px]">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
