import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import useConfig from "../../../hooks/useConfig";
import { SocketChartData } from "../../../types.client.socket";


const Chart = (props: SocketChartData) => {
    const { wpm, labels, words } = props;
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
                borderColor: 'rgba(251, 146, 60, 0.5)',
                borderWidth: '3',
                borderCapStyle: 'butt',
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(251, 146, 60, 0.7)',
                pointBackgroundColor: 'rgba(251, 146, 60, 1)',
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
        animation: {
            duration: 0
        },
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
                    labelString: 'Miliseconds Per Word'
                    }
                }
            ]
        }
    };

    return (
        <>
            <div style={{ zIndex: -1 }} className="w-full h-full text-gray-100 text-center bg-gray-825 rounded-lg px-2 py-3.5" >
                <div className="h-48 sm:h-56 md:h-64 lg:h-88">
                    <Line data={lineData} options={lineOptions} redraw={true} />
                </div>
            </div>
        </>
    )
}

export default Chart;