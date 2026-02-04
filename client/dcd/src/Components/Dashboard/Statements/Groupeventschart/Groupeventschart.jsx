import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Groupeventschart({ groupEvents, options }) {

  const labels = groupEvents.map(item => item.log_date);

  const datasetsConfig = [
    {
      key: 'ginko_klub',
      label: 'Ginko Klub',
      backgroundColor: '#EAD2AC',
    },
    {
      key: 'dpp',
      label: 'DPP',
      backgroundColor: '#6096BA',
    },
    {
      key: 'memoria_kucko',
      label: 'Memória Kuckó',
      backgroundColor: '#A3CEF1',
    },
    {
      key: 'muzeum_jarat',
      label: 'Múzeum járat',
      backgroundColor: '#aac0aa',
    },
    {
      key: 'emlek_kepek',
      label: 'Emlék-képek',
      backgroundColor: '#8fc277',
    }
  ];

  const datasets = datasetsConfig
    .map(cfg => {
      const values = groupEvents.map(item => item[cfg.key]);

      // CSAK akkor jelenjen meg, ha van legalább egy > 0 érték
      const hasData = values.some(v => Number(v) > 0);

      if (!hasData) return null;

      return {
        label: cfg.label,
        data: values,
        borderRadius: 5,
        backgroundColor: cfg.backgroundColor,
      };
    })
    .filter(Boolean);

  // ha minden 0 → ne jelenjen meg a chart se
  if (datasets.length === 0) {
    return null; // vagy egy "Nincs megjeleníthető adat" üzenet
  }

  const barData = {
    labels,
    datasets,
  };

  return <Bar data={barData} options={options} />;
}