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
  Loader2,
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

// =============================================================================
// DADOS MOCKADOS
// Trocar por chamadas à API quando o backend estiver pronto.
// =============================================================================

const MOCK_SUMMARY = {
  totalItems: 47,
  completedItems: 18,
  inProgressItems: 12,
  pendingItems: 11,
  overdueItems: 6,
  completionRate: 38.3,
};

const MOCK_ITEMS_BY_STATUS = [
  { name: 'Concluído', value: 18, color: '#22c55e' },
  { name: 'Em Progresso', value: 8, color: '#eab308' },
  { name: 'Revisão', value: 4, color: '#3b82f6' },
  { name: 'Pendente', value: 11, color: '#9ca3af' },
];

const MOCK_ITEMS_BY_PRIORITY = [
  { name: 'Baixa', value: 10, color: '#9ca3af' },
  { name: 'Média', value: 15, color: '#3b82f6' },
  { name: 'Alta', value: 14, color: '#f59e0b' },
  { name: 'Urgente', value: 8, color: '#ef4444' },
];

const MOCK_TOP_BOARDS = [
  { name: 'Projeto Alpha', count: 14, color: '#00d4ff' },
  { name: 'Redesign UI', count: 11, color: '#8b5cf6' },
  { name: 'API Backend', count: 9, color: '#f97316' },
  { name: 'Marketing', count: 7, color: '#22c55e' },
  { name: 'DevOps', count: 6, color: '#ec4899' },
];

interface MockDelivery {
  title: string;
  board: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

const MOCK_UPCOMING_DELIVERIES: MockDelivery[] = [
  { title: 'Implementar autenticação JWT', board: 'API Backend', dueDate: '2026-07-30', priority: 'HIGH' },
  { title: 'Dashboard de analytics', board: 'Projeto Alpha', dueDate: '2026-08-01', priority: 'URGENT' },
  { title: 'Testes E2E no fluxo de login', board: 'Redesign UI', dueDate: '2026-08-04', priority: 'MEDIUM' },
  { title: 'Documentação da API pública', board: 'API Backend', dueDate: '2026-08-07', priority: 'MEDIUM' },
  { title: 'Campanha de lançamento Q3', board: 'Marketing', dueDate: '2026-08-10', priority: 'HIGH' },
  { title: 'Configurar pipeline CI/CD', board: 'DevOps', dueDate: '2026-08-12', priority: 'LOW' },
];

// =============================================================================
// CONFIGS
// =============================================================================

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  LOW: { label: 'Baixa', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  MEDIUM: { label: 'Média', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  HIGH: { label: 'Alta', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  URGENT: { label: 'Urgente', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
};

// =============================================================================
// COMPONENTE
// =============================================================================

export function Metrics() {
  const { isDark } = useTheme();

  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipText = isDark ? '#e5e7eb' : '#374151';

  return (
    <div className="mx-auto max-w-6xl">
      {/* Banner */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-b2-50 to-b2-100/60 p-6 sm:p-8 dark:from-b2-950/40 dark:to-b2-900/20">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm dark:bg-gray-800/80">
            <BarChart3 className="h-7 w-7 text-b2-600 dark:text-b2-400" />
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
          icon={<ClipboardList className="h-5 w-5 text-b2-600 dark:text-b2-400" />}
          iconBg="bg-b2-100 dark:bg-b2-900/40"
          label="Total de Itens"
          value={MOCK_SUMMARY.totalItems}
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />}
          iconBg="bg-green-100 dark:bg-green-900/40"
          label="Concluídos"
          value={MOCK_SUMMARY.completedItems}
        />
        <KpiCard
          icon={<Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
          iconBg="bg-yellow-100 dark:bg-yellow-900/40"
          label="Em Progresso"
          value={MOCK_SUMMARY.inProgressItems}
        />
        <KpiCard
          icon={<Circle className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
          iconBg="bg-gray-100 dark:bg-gray-800"
          label="Pendentes"
          value={MOCK_SUMMARY.pendingItems}
        />
        <KpiCard
          icon={<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/40"
          label="Atrasados"
          value={MOCK_SUMMARY.overdueItems}
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-b2-600 dark:text-b2-400" />}
          iconBg="bg-b2-100 dark:bg-b2-900/40"
          label="Taxa de Conclusão"
          value={`${MOCK_SUMMARY.completionRate}%`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Itens por Status - PieChart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-100 dark:bg-b2-900/40">
              <LayoutDashboard className="h-5 w-5 text-b2-600 dark:text-b2-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Itens por Status</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Distribuição atual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={MOCK_ITEMS_BY_STATUS}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {MOCK_ITEMS_BY_STATUS.map((entry, index) => (
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-100 dark:bg-b2-900/40">
              <AlertTriangle className="h-5 w-5 text-b2-600 dark:text-b2-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Itens por Prioridade</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quantidade por nível</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOCK_ITEMS_BY_PRIORITY}>
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
                {MOCK_ITEMS_BY_PRIORITY.map((entry, index) => (
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-100 dark:bg-b2-900/40">
            <BarChart3 className="h-5 w-5 text-b2-600 dark:text-b2-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Boards com Mais Itens</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top 5 boards por quantidade de itens</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={MOCK_TOP_BOARDS} layout="vertical">
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
              {MOCK_TOP_BOARDS.map((entry, index) => (
                <Cell key={`board-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Próximas Entregas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2-100 dark:bg-b2-900/40">
            <CalendarClock className="h-5 w-5 text-b2-600 dark:text-b2-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Próximas Entregas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Itens com data de entrega definida</p>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_UPCOMING_DELIVERIES.map((delivery, index) => {
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

      {/*
      ========================================================================
      ENDPOINTS NECESSÁRIOS NO BACKEND
      ========================================================================

      Ao criar a API de métricas no backend, estes são os endpoints
      que devem ser disponibilizados para substituir os dados mockados:

      ─────────────────────────────────────────────────────────────────────
      GET /metrics/summary
      ─────────────────────────────────────────────────────────────────────
      Retorna os KPIs gerais.

      Response:
      {
        "totalItems": number,
        "completedItems": number,
        "inProgressItems": number,
        "pendingItems": number,
        "overdueItems": number,        // itens com dueDate < hoje e status != DONE
        "completionRate": number        // (completedItems / totalItems) * 100
      }

      ─────────────────────────────────────────────────────────────────────
      GET /metrics/by-status
      ─────────────────────────────────────────────────────────────────────
      Contagem de itens agrupados por status.

      Response:
      [
        { "name": "Concluído",  "value": 18, "color": "#22c55e" },
        { "name": "Em Progresso", "value": 8, "color": "#eab308" },
        { "name": "Revisão",    "value": 4,  "color": "#3b82f6" },
        { "name": "Pendente",   "value": 11, "color": "#9ca3af" }
      ]

      ─────────────────────────────────────────────────────────────────────
      GET /metrics/by-priority
      ─────────────────────────────────────────────────────────────────────
      Contagem de itens agrupados por prioridade.

      Response:
      [
        { "name": "Baixa",   "value": 10, "color": "#9ca3af" },
        { "name": "Média",   "value": 15, "color": "#3b82f6" },
        { "name": "Alta",    "value": 14, "color": "#f59e0b" },
        { "name": "Urgente", "value": 8,  "color": "#ef4444" }
      ]

      ─────────────────────────────────────────────────────────────────────
      GET /metrics/top-boards
      ─────────────────────────────────────────────────────────────────────
      Retorna os boards com mais itens (top N).

      Query params: ?limit=5 (default 5)

      Response:
      [
        { "name": "Projeto Alpha",  "count": 14, "color": "#00d4ff" },
        { "name": "Redesign UI",    "count": 11, "color": "#8b5cf6" },
        ...
      ]

      ─────────────────────────────────────────────────────────────────────
      GET /metrics/upcoming-deliveries
      ─────────────────────────────────────────────────────────────────────
      Itens com data de entrega futura (ou atrasados), ordenados por dueDate.

      Query params: ?limit=10 (default 10)

      Response:
      [
        {
          "title": "Implementar auth",
          "board": "API Backend",
          "dueDate": "2026-07-30",
          "priority": "HIGH"
        },
        ...
      ]

      ─────────────────────────────────────────────────────────────────────
      NOTAS DE IMPLEMENTAÇÃO
      ─────────────────────────────────────────────────────────────────────

      1. Todas as rotas devem exigir autenticação (Bearer token).
      2. Métricas devem ser filtradas por usuário logado (apenas boards/itens
         que ele tem acesso).
      3. "overdueItems" = itens onde dueDate < NOW() E status != 'DONE'.
      4. "inProgressItems" = itens com status IN_PROGRESS + REVIEW.
      5. "pendingItems" = itens com status TODO.
      6. As cores nos responses são fixas (para o frontend renderizar os
         gráficos). O backend pode omiti-las e o frontend mapeia localmente.
      7. Para trocar mocks por API real, basta fazer fetch nos endpoints
         acima dentro de um useEffect e substituir as constantes MOCK_*.
      ========================================================================
      */}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTE: KPI Card
// =============================================================================

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
