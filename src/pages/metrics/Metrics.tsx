import { useEffect, useState } from 'react';
import {
  BarChart3,
  ClipboardList,
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  TrendingUp,
  LayoutDashboard,
  CalendarClock,
  ArrowUpRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  LOW: { label: 'Baixa', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  MEDIUM: { label: 'Média', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  HIGH: { label: 'Alta', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  URGENT: { label: 'Urgente', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
};

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

interface Summary {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  pendingItems: number;
  overdueItems: number;
  completionRate: number;
}

interface StatusItem {
  name: string;
  value: number;
  color: string;
}

interface PriorityItem {
  name: string;
  value: number;
  color: string;
}

interface TopBoard {
  name: string;
  count: number;
  color: string;
}

interface Delivery {
  title: string;
  board: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export function Metrics() {
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byStatus, setByStatus] = useState<StatusItem[]>([]);
  const [byPriority, setByPriority] = useState<PriorityItem[]>([]);
  const [topBoards, setTopBoards] = useState<TopBoard[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/metrics/summary`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/metrics/by-status`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/metrics/by-priority`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/metrics/top-boards?limit=5`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API_URL}/metrics/upcoming-deliveries?limit=10`, { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([s, st, pr, tb, dl]) => {
        setSummary(s);
        setByStatus(st);
        setByPriority(pr);
        setTopBoards(tb);
        setDeliveries(dl);
      })
      .finally(() => setLoading(false));
  }, []);

  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#e5e7eb' : '#374151';

  return (
    <div className="mx-auto max-w-6xl">
      {/* Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-50 to-brand-100/60 p-6 sm:p-8 dark:from-brand-950/40 dark:to-brand-900/20">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm dark:bg-gray-800/80">
            <BarChart3 className="h-7 w-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              Métricas
            </h1>
            <p className="mt-0.5 text-base text-gray-600 sm:text-lg dark:text-gray-300">
              Visão geral do seu trabalho
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          icon={<ClipboardList className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
          iconBg="bg-brand-100 dark:bg-brand-900/40"
          label="Total de Itens"
          value={loading ? '...' : summary?.totalItems ?? 0}
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />}
          iconBg="bg-green-100 dark:bg-green-900/40"
          label="Concluídos"
          value={loading ? '...' : summary?.completedItems ?? 0}
        />
        <KpiCard
          icon={<Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
          iconBg="bg-yellow-100 dark:bg-yellow-900/40"
          label="Em Progresso"
          value={loading ? '...' : summary?.inProgressItems ?? 0}
        />
        <KpiCard
          icon={<Circle className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
          iconBg="bg-gray-100 dark:bg-gray-800"
          label="Pendentes"
          value={loading ? '...' : summary?.pendingItems ?? 0}
        />
        <KpiCard
          icon={<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/40"
          label="Atrasados"
          value={loading ? '...' : summary?.overdueItems ?? 0}
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
          iconBg="bg-brand-100 dark:bg-brand-900/40"
          label="Taxa de Conclusão"
          value={loading ? '...' : `${summary?.completionRate ?? 0}%`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Itens por Status - PieChart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40">
              <LayoutDashboard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Itens por Status</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Distribuição atual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={byStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {byStatus.map((entry, index) => (
                  <Cell key={`status-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  color: tooltipText,
                }}
              />
              <Legend
                wrapperStyle={{ color: textColor, fontSize: '13px' }}
                formatter={(value: string) => <span style={{ color: textColor }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Itens por Prioridade - BarChart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40">
              <AlertTriangle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Itens por Prioridade</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quantidade por nível</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byPriority}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 13 }} />
              <YAxis tick={{ fill: textColor, fontSize: 13 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  color: tooltipText,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byPriority.map((entry, index) => (
                  <Cell key={`priority-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 - Top Boards */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40">
            <BarChart3 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Boards com Mais Itens</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top 5 boards por quantidade de itens</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topBoards} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fill: textColor, fontSize: 13 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fill: textColor, fontSize: 13 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                color: tooltipText,
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {topBoards.map((entry, index) => (
                <Cell key={`board-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Próximas Entregas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40">
            <CalendarClock className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Próximas Entregas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Itens com data de entrega definida</p>
          </div>
        </div>

        <div className="space-y-3">
          {deliveries.map((delivery, index) => {
            const dueDate = new Date(delivery.dueDate + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isUrgent = diffDays <= 3;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {delivery.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {delivery.board}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_CONFIG[delivery.priority].className}`}>
                    {PRIORITY_CONFIG[delivery.priority].label}
                  </span>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>
                      {diffDays <= 0
                        ? 'Atrasado'
                        : diffDays === 1
                          ? 'Amanhã'
                          : `Em ${diffDays} dias`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number | string;
}

function KpiCard({ icon, iconBg, label, value }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
