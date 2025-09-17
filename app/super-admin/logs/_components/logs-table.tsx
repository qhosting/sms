

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdminLog {
  id: string;
  action: string;
  entity: string | null;
  description: string;
  metadata: any;
  createdAt: Date;
  adminId: string | null;
  adminEmail: string | null;
}

interface LogsTableProps {
  logs: AdminLog[];
}

export function LogsTable({ logs }: LogsTableProps) {
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.description.toLowerCase().includes(filter.toLowerCase()) ||
    (log.adminEmail && log.adminEmail.toLowerCase().includes(filter.toLowerCase()))
  );

  const getActionBadge = (action: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      CREATE_COMPANY: { 
        label: 'Crear Empresa', 
        className: 'bg-green-100 text-green-800' 
      },
      UPDATE_SYSTEM_CONFIG: { 
        label: 'Config Sistema', 
        className: 'bg-blue-100 text-blue-800' 
      },
      DELETE_COMPANY: { 
        label: 'Eliminar Empresa', 
        className: 'bg-red-100 text-red-800' 
      },
      CREDIT_ADJUSTMENT: { 
        label: 'Ajuste Créditos', 
        className: 'bg-yellow-100 text-yellow-800' 
      },
      USER_MANAGEMENT: { 
        label: 'Gestión Usuario', 
        className: 'bg-purple-100 text-purple-800' 
      },
    };

    const badge = badges[action] || { 
      label: action.replace('_', ' '), 
      className: 'bg-gray-100 text-gray-800' 
    };

    return (
      <Badge className={badge.className}>
        {badge.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-indigo-600" />
            Registro de Actividades ({logs.length})
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filtrar logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {logs.length === 0 ? 'No hay logs disponibles' : 'No se encontraron logs'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {logs.length === 0 
                ? 'Las actividades aparecerán aquí cuando ocurran.' 
                : 'Intenta con otros términos de búsqueda.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acción</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 truncate">
                          {log.description}
                        </p>
                        {log.entity && (
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {log.entity.slice(-8)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {log.adminEmail ? (
                          <div>
                            <p className="text-gray-900">{log.adminEmail}</p>
                            {log.adminId && (
                              <p className="text-xs text-gray-500">
                                ID: {log.adminId.slice(-8)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Sistema</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(log.createdAt, { 
                          addSuffix: true,
                          locale: es
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
