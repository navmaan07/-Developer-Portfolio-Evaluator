import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const radarData = {
  labels: ['Quality', 'Activity', 'Community', 'Documentation', 'Impact'],
  datasets: [
    {
      label: 'Score Breakdown',
      data: [88, 80, 92, 85, 78],
      backgroundColor: 'rgba(56, 189, 248, 0.22)',
      borderColor: 'rgba(56, 189, 248, 0.96)',
      borderWidth: 2,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: '#ffffff',
      pointHoverRadius: 6,
    },
  ],
};

const languageData = {
  labels: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'],
  datasets: [
    {
      label: 'Language usage',
      data: [42, 26, 14, 10, 8],
      backgroundColor: [
        '#38bdf8',
        '#7c3aed',
        '#f97316',
        '#22c55e',
        '#fb7185',
      ],
      borderRadius: 12,
      barPercentage: 0.6,
    },
  ],
};

const heatmapData = [
  { label: 'Mon', value: 2 },
  { label: 'Tue', value: 5 },
  { label: 'Wed', value: 4 },
  { label: 'Thu', value: 3 },
  { label: 'Fri', value: 6 },
  { label: 'Sat', value: 2 },
  { label: 'Sun', value: 1 },
];

function heatColor(value) {
  const alpha = Math.min(0.9, 0.25 + value * 0.1);
  return `rgba(56, 189, 248, ${alpha})`;
}

export default function App() {
  return (
    <div className="charts-shell">
      <header className="charts-header">
        <div>
          <p className="eyebrow">Day 12</p>
          <h1>Charts + Visualization</h1>
          <p className="subtitle">
            Visualize performance scores and language distribution for the portfolio.
          </p>
        </div>
      </header>

      <main className="charts-grid">
        <section className="chart-card">
          <div className="card-heading">
            <h2>Radar score chart</h2>
            <p>Compare five core portfolio metrics in a single view.</p>
          </div>
          <div className="chart-wrapper">
            <Radar data={radarData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                  },
                  angleLines: {
                    color: 'rgba(148, 163, 184, 0.14)',
                  },
                  pointLabels: {
                    color: '#cbd5e1',
                    font: {
                      size: 12,
                    },
                  },
                  ticks: {
                    color: '#94a3b8',
                    stepSize: 20,
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: '#cbd5e1',
                  },
                },
              },
            }} />
          </div>
        </section>

        <section className="chart-card">
          <div className="card-heading">
            <h2>Language bar chart</h2>
            <p>Show the most-used languages for the portfolio evaluation.</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={languageData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  ticks: {
                    color: '#cbd5e1',
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  max: 50,
                  ticks: {
                    color: '#94a3b8',
                  },
                  grid: {
                    color: 'rgba(148, 163, 184, 0.18)',
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }} />
          </div>
        </section>

        <section className="chart-card heatmap-card">
          <div className="card-heading">
            <h2>Heatmap overview</h2>
            <p>Activity intensity by day of the week.</p>
          </div>
          <div className="heatmap-grid">
            {heatmapData.map((item) => (
              <div key={item.label} className="heatmap-cell">
                <span className="day-label">{item.label}</span>
                <div className="heatbar" style={{ background: heatColor(item.value) }}>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
