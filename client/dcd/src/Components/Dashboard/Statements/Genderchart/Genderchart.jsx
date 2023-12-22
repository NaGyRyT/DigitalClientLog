import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Genderchart( { genderData, options } ) {
    const barData = {
        labels: genderData.map((data)=> data.gender),
        datasets: [{
            label: 'Az ügyfelek nemek szerinti eloszlása',
            data: genderData.map((data)=> data.piece),
            borderRadius: 5,
            backgroundColor: ['#9BD0F5', '#FFB1C1']
        }]
    }
  return (
    <>
        <Bar data={barData} options={options}/>
    </>
  )
}