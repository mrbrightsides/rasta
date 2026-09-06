import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface RadarDataPoint {
  metric: string;
  fullName: string;
  [key: string]: string | number;
}

interface RadarChartCompProps {
  data: RadarDataPoint[];
  series: Array<{
    key: string;
    name: string;
    color: string;
    fillColor?: string;
  }>;
  height?: number;
}

export default function RadarChartComp({
  data,
  series,
  height = 320,
}: RadarChartCompProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div style={{ width: '100%', height }} className="min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              stroke="#CBD5E1"
            />
            {series.map((s) => (
              <Radar
                key={s.key}
                name={s.name}
                dataKey={s.key}
                stroke={s.color}
                fill={s.fillColor || s.color}
                fillOpacity={0.25}
                strokeWidth={2.5}
                dot={{ r: 3, fill: s.color }}
              />
            ))}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const metricPoint = payload[0].payload as RadarDataPoint;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs border border-slate-700">
                      <p className="font-bold text-slate-200 mb-1">
                        {metricPoint.fullName || metricPoint.metric}
                      </p>
                      {payload.map((entry: any, index: number) => (
                        <div
                          key={`item-${index}`}
                          className="flex items-center justify-between gap-4 py-0.5"
                        >
                          <span
                            className="flex items-center gap-1.5"
                            style={{ color: entry.color }}
                          >
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name}:
                          </span>
                          <span className="font-semibold text-white">
                            {entry.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '8px' }}
              formatter={(value) => (
                <span className="text-xs font-semibold text-slate-700">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
