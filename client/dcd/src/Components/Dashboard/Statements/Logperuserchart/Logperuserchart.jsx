import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";


export default function Logperuserchart( {logPerUserData, options} ) {
    const barData = {
        labels: logPerUserData.map((data)=> data.name),
        datasets: [{
            label: 'Az ügyfélkapcsolatok száma felhasználónként',
            data: logPerUserData.map((data)=> data.piece),
            borderRadius: 5,
            backgroundColor: ['#EAD2AC', '#6096BA', '#A3CEF1', '#8B8C89', '#A0A083', '#C9ADA1', '#EAE0CC'],
        }]
    }
return (
    <Bar data={barData}  options={options} />
  )
};