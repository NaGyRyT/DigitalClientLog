import React from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Diseaseseveritychart({diseaseSeverityData, options}) {
    let ownOptions = structuredClone(options);
    let amountOfDiseases = diseaseSeverityData.map((data) => data.early + data.middle + data.late).reduce((a, c)=> a + c);
    ownOptions.plugins.title.display = true;
    ownOptions.plugins.title.text = 'Az aktív ügyfelek betegségének foka felhasználónként (' + amountOfDiseases + ' fő)';
    const barData = {
        labels: diseaseSeverityData.map((data)=> data.name),
        datasets: [{
            label: 'Enyhe',
            data: diseaseSeverityData.map((data)=> data.early),
            borderRadius: 5,
            backgroundColor: ['#AAC0AA'],
        },
        {
            label: 'Középsúlyos',
            data: diseaseSeverityData.map((data)=> data.middle),
            borderRadius: 5,
            backgroundColor: ['#F4B886'],
        },
        {
            label: 'Súlyos',
            data: diseaseSeverityData.map((data)=> data.late),
            borderRadius: 5,
            backgroundColor: ['#E0E2DB'],
        },
    ]
    };
  return (
    <Bar data={barData}  options={ownOptions} />
  )
};
