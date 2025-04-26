import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js/auto";
import { useState } from "react";
import { Data } from "../sample_charts.js";

Chart.register(CategoryScale);

export default function PerMonthFollowers() {
    const [chartData,setChartData]=useState(
        {
            labels: Data.map((data) => data.month), 
            datasets: [
              {
                label: "Followers Gained Per Month",
                data: Data.map((data) => data.userGain),
                backgroundColor: [
                    "#0000ff"
                ],
                borderColor: "blue",
                borderWidth: 0,
              }
            ]
          }
    )

    return(
        <>
            <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
            <Bar
                data={chartData}
                options={{
                    scales:{
                        y:{
                            ticks:{
                                min:0,
                                max:100,
                                stepSize:20
                            }
                        }
                    },
                    
                    plugins: {
                        title: {
                        display: true,
                        text: "Followers gained per month",
                        },
                        legend: {
                        display: false
                        },
                        
                    },
                }}
            />
            </div>

        </>
    )
}