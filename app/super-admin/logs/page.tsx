

import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { LogsTable } from './_components/logs-table';
import { LogsStats } from './_components/logs-stats';

export const metadata: Metadata = {
  title: 'Logs del Sistema - Super Admin',
  description: 'Registro de actividades y eventos del sistema',
};

async function getLogsData() {
  const [logs, logStats] = await Promise.all([
    // Recent logs
    prisma.adminLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    }),
    
    // Log statistics
    prisma.adminLog.groupBy({
      by: ['action'],
      _count: {
        action: true
      },
      orderBy: {
        _count: {
          action: 'desc'
        }
      }
    })
  ]);

  return {
    logs,
    logStats
  };
}

export default async function LogsPage() {
  const { logs, logStats } = await getLogsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Logs del Sistema</h1>
        <p className="mt-2 text-gray-600">
          Registro detallado de todas las actividades administrativas
        </p>
      </div>

      <LogsStats stats={logStats} />
      <LogsTable logs={logs} />
    </div>
  );
}
