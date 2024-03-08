import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Citychart( { cityData, options} ) {
    const barData = {
        labels: cityData.map((data)=> data.city),
        datasets: [{
            label: 'Az ügyfelek településssek szerinti eloszlása',
            data: cityData.map((data)=> data.piece),
            backgroundColor: ['#EAD2AC', '#6096BA', '#A3CEF1', '#8B8C89']
        }]
    }
  return (
    <>
        <Bar data={barData} options={options}/>
    </>
  )
}