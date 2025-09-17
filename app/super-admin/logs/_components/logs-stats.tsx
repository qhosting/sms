

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Activity, TrendingUp } from 'lucide-react';

interface LogsStat {
  action: string;
  _count: {
    action: number;
  };
}

interface LogsStatsProps {
  stats: LogsStat[];
}

export function LogsStats({ stats }: LogsStatsProps) {
  const totalLogs = stats.reduce((sum, stat) => sum + stat._count.action, 0);
  
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_COMPANY: 'Empresas Creadas',
      UPDATE_SYSTEM_CONFIG: 'Config. Actualizadas',
      DELETE_COMPANY: 'Empresas Eliminadas',
      CREDIT_ADJUSTMENT: 'Ajustes de Créditos',
      USER_MANAGEMENT: 'Gestión de Usuarios',
    };
    return labels[action] || action.replace('_', ' ');
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE_COMPANY: 'bg-green-100 text-green-800',
      UPDATE_SYSTEM_CONFIG: 'bg-blue-100 text-blue-800',
      DELETE_COMPANY: 'bg-red-100 text-red-800',
      CREDIT_ADJUSTMENT: 'bg-yellow-100 text-yellow-800',
      USER_MANAGEMENT: 'bg-purple-100 text-purple-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLogs.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Registros de actividad</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipos de Acciones</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.length}</div>
          <p className="text-xs text-muted-foreground">Acciones diferentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acción Más Frecuente</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">
            {stats[0] ? getActionLabel(stats[0].action) : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats[0] ? `${stats[0]._count.action} veces` : 'Sin datos'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
