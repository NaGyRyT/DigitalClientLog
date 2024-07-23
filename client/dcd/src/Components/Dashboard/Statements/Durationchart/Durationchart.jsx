import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";


export default function Durationchart( {durationData, options} ) {
    const barData = {
        labels: durationData.map((data)=> data.duration),
        datasets: [{
            label: 'Az ügyfélkapcsolatok időtartama',
            data: durationData.map((data)=> data.piece),
            borderRadius: 5,
            backgroundColor: ['#EAD2AC', '#6096BA', '#A3CEF1', '#8B8C89', '#A0A083', '#776D5A', '#AAC0AA', '#F4B886', '#E0E2DB'],
        }]
    }
return (
    <Bar data={barData}  options={options} />
  )
};