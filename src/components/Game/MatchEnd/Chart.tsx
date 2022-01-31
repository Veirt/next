import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import useConfig from "../../../hooks/useConfig";
import { SocketChartData } from "../../../types.client.socket";


const Chart = (props: SocketChartData) => {
    const { wpm, labels, words, accuracy, step } = props;
    const { useCPM } = useConfig();

    let chartLabel = 'Words Per Minute';
    const newChartData: number[] = wpm;
    if (useCPM === '1') {
        chartLabel = 'Characters Per Minute';
        const dataLength: number = wpm.length;
        for (let i = 0; i < dataLength; i++) {
            // @ts-ignore
            newChartData[i] = Math.round((newChartData[i] * 5 + Number.EPSILON) * 100) / 100;
        }
    }

    const lineData: any = {
        type: 'line',
        labels: labels,
        datasets: [
            {
                yAxisID: 'A',
                label: chartLabel,
                fill: true,
                lineTension: 0.25,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(246, 173, 85, 0.5)',
                borderWidth: '3',
                borderCapStyle: 'butt',
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(246, 173, 85, 0.7)',
                pointBackgroundColor: 'rgba(246, 173, 85, 1)',
                pointBorderWidth: 1,
                pointHoverRadius: 7,
                pointRadius: 5,
                pointHitRadius: 500,
                data: newChartData,
            },
            {
                yAxisID: 'B',
                label: 'Second per Word',
                fill: true,
                lineTension: 0.25,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(43, 108, 176, 0)',
                borderWidth: '3',
                borderCapStyle: 'butt',
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(43, 108, 176, 0.7)',
                pointBackgroundColor: 'rgba(43, 108, 176, 1)',
                pointBorderWidth: 3,
                pointHoverRadius: 4,
                pointRadius: 4,
                pointHitRadius: 12,
                data: words,
            },
        ],
    };

    const lineOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            yAxes: [
            {
                id: 'A',
                position: 'left',
                scaleLabel: {
                display: true,
                labelString: chartLabel
                }
            },
            {
                id: 'B',
                position: 'right',
                scaleLabel: {
                display: true,
                labelString: 'Seconds Per Word'
                }
            }
            ]
        }
    };

    return (
        <>
            <div style={{ zIndex: -1 }} className="w-full h-full text-gray-100 text-center bg-gray-825 rounded-lg px-2 py-3.5" >
                <div style={{ height: '350px' }}>
                    <Line data={lineData} options={lineOptions} redraw={true} />
                </div>
            </div>
        </>
    )
}

export default Chart;