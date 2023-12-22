import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Ageschart( { agesData, options} ) {
    const barData = {
        labels: agesData.map((data)=> data.ages),
        datasets: [{
            label: 'Az ügyfelek korosztály szerinti eloszlása',
            data: agesData.map((data)=> data.piece),
            borderRadius: 5,
            backgroundColor: ['#EAD2AC', '#6096BA', '#A3CEF1', '#8B8C89']
        }],
        options: [{
            plugins: {
                colors: {
                forceOverride: true
                }
        }}]
    }
  return (
    <>
        <Bar data={barData} options={options}/>
    </>
  )
}