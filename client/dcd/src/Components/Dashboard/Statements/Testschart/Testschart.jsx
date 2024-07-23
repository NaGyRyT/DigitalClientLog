import React from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Testschart( {tests, options} ) {
    const barData = {
        labels: tests.map((data)=> data.log_date),
        datasets: [{
            label: 'Óra',
            data: tests.map((data)=> data.test_ora),
            borderRadius: 5,
            backgroundColor: '#A09CB0',
        },
        {
            label: 'MMSE',
            data: tests.map((data)=> data.test_mmse),
            borderRadius: 5,
            backgroundColor: '#AAC0AA',
        },
        {
            label: 'TYM-HUN',
            data: tests.map((data)=> data.test_tym_hun),
            borderRadius: 5,
            backgroundColor: '#776D5A'
        }
    ]};

  return (
    <Bar data={barData} options={options}/>
  )
}
