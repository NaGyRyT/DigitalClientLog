import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Logchart( { logData, options} ) {
    const barData = {
        labels: logData.map((data)=> data.log_date),
        datasets: [{
            label: 'Naplóbejegyzések száma havi lebontásban',
            data: logData.map((data)=> data.log_count),
        }]
    }
  
  return (
    <>
        <Line data={barData} options={options}/>
    </>
  )
}