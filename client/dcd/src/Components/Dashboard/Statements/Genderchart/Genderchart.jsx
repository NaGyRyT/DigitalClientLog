import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import './Genderchart.css';

export default function Genderchart( { genderData, options } ) {
    let amountOfClients = 0;
    const barData = {
        labels: genderData.map((data)=> data.gender),
        datasets: [{
            label: 'Az aktív ügyfelek nemek szerinti eloszlása',
            data: genderData.map((data)=> {
              amountOfClients += data.piece;
              return data.piece}),
            borderRadius: 5,
            backgroundColor: ['#9BD0F5', '#FFB1C1'],
        }]
    }
  return (
    <div className="position-relative">
        <span size="xs" className="amount-of-clients">{amountOfClients} fő</span>
        <Bar data={barData} options={options}/>        
    </div>
  )
}