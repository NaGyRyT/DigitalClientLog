import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Groupeventschart( { groupEvents, options} ) {
    const barData = {
        labels: groupEvents.map((data)=> data.log_date),
        datasets: [{
            label: 'Ginko Klub',
            data: groupEvents.map((data)=> data.ginko_klub),
            borderRadius: 5,
            backgroundColor: '#EAD2AC',
        },
        {
            label: 'DPP',
            data: groupEvents.map((data)=> data.dpp),
            borderRadius: 5,
            backgroundColor: '#6096BA',
        },
        {
            label: 'Memória Kuckó',
            data: groupEvents.map((data)=> data.memoria_kucko),
            borderRadius: 5,
            backgroundColor: '#A3CEF1',
        }
    ]};
  return (
    <>
        <Bar data={barData} options={options}/>
    </>
  )
};