import React from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Shapofactivitieschart({shapeOfActivities, options}) {
    const barData = {
        labels: shapeOfActivities.map((data)=> data.log_date),
        datasets: [{
            label: 'Személyes',
            data: shapeOfActivities.map((data)=> data.personal),
            borderRadius: 5,
            backgroundColor: '#E0E2DB',
        },
        {
            label: 'Telefonos',
            data: shapeOfActivities.map((data)=> data.phone),
            borderRadius: 5,
            backgroundColor: '#C95D63',
        },
        {
            label: 'Online',
            data: shapeOfActivities.map((data)=> data.online),
            borderRadius: 5,
            backgroundColor: '#F6AE2D',
        }
    ]};
  return (
    <Bar data={barData} options={options}/>
  )
}
