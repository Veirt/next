import { FC, useState } from 'react';
import useConfig from '../../hooks/useConfig';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'next-i18next';

interface IChartProps {
  labels: string[];
  total: string[];
  minWPM: string[];
  maxWPM: string[];
  avgWPM: string[];
  minCPM: string[];
  maxCPM: string[];
  avgCPM: string[];
}

export interface PlayerStatisticChartData {
  month: IChartProps;
  year: IChartProps;
}

const ProfileStatisticChart: FC<PlayerStatisticChartData> = (props) => {
  const { useCPM } = useConfig();
  const { t } = useTranslation();

  const [tab, setTab] = useState<number>(0);

  const chartYear = {
    labels: props.month.labels,
    datasets: [
      {
        label: 'Average',
        fill: true,
        lineTension: 0.2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(251, 146, 60, 0.5)',
        borderWidth: 3,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(251, 146, 60, 0.7)',
        pointBackgroundColor: 'rgba(251, 146, 60, 1)',
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointRadius: 5,
        pointHitRadius: 10,
        data: useCPM !== '0' ? props.month.avgCPM : props.month.avgWPM,
      },
      {
        label: 'Highest',
        fill: true,
        lineTension: 0.2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(43, 108, 176, 0.5)',
        borderWidth: 3,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(43, 108, 176, 0.7)',
        pointBackgroundColor: 'rgba(43, 108, 176, 1)',
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointRadius: 5,
        pointHitRadius: 10,
        data: useCPM !== '0' ? props.month.maxCPM : props.month.maxWPM,
      },
      {
        label: 'Lowest',
        fill: true,
        lineTension: 0.2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(50, 108, 125, 0.5)',
        borderWidth: 3,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(50, 108, 125, 0.7)',
        pointBackgroundColor: 'rgba(50, 108, 125, 1)',
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointRadius: 5,
        pointHitRadius: 10,
        data: useCPM !== '0' ? props.month.minCPM : props.month.minWPM,
      },
    ],
  };

  const chartMonth = {
    labels: props.year.labels,
    datasets: [
      {
        label: 'Average',
        fill: true,
        lineTension: 0.2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(251, 146, 60, 0.5)',
        borderWidth: 3,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(251, 146, 60, 0.7)',
        pointBackgroundColor: 'rgba(251, 146, 60, 1)',
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointRadius: 5,
        pointHitRadius: 10,
        data: useCPM !== '0' ? props.year.avgCPM : props.year.avgWPM,
      },
      {
        label: 'Highest',
        fill: true,
        lineTension: 0.2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(43, 108, 176, 0.5)',
        borderWidth: 3,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(43, 108, 176, 0.7)',
        pointBackgroundColor: 'rgba(43, 108, 176, 1)',
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointRadius: 5,
        pointHitRadius: 10,
        data: useCPM !== '0' ? props.year.maxCPM : props.year.maxWPM,
      },
      {
        label: 'Lowest',
        fill: true,
        lineTension: 0.2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(50, 108, 125, 0.5)',
        borderWidth: 3,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(50, 108, 125, 0.7)',
        pointBackgroundColor: 'rgba(50, 108, 125, 1)',
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointRadius: 5,
        pointHitRadius: 10,
        data: useCPM !== '0' ? props.year.minCPM : props.year.minWPM,
      },
    ],
  };

  return (
    <>
      <div className="flex flex-wrap justify-center lg:justify-between">
        <div className="w-full pb-4 lg:pb-0 lg:w-auto">
          <div className={'text-orange-400 pb-2 normal-case font-semibold text-3xl'}>{t('page.profile.progress')}</div>
        </div>
        <div>
          <div className="flex justify-center mb-8">
            <button type="button" onClick={() => setTab(0)} className={`px-6 w-auto uppercase font-semibold text-lg ${tab !== 0 ? 'text-white' : 'text-orange-400'}`}>
              30 days
            </button>
            <button type="button" onClick={() => setTab(1)} className={`px-6 w-auto uppercase font-semibold text-lg ${tab !== 1 ? 'text-white' : 'text-orange-400'}`}>
              12 months
            </button>
          </div>
        </div>
      </div>
      <div className="h-80 md:h-96 lg:h-108 xl:h-120">
        <Line data={(tab === 0 ? chartYear : chartMonth) as any} options={{ responsive: true, maintainAspectRatio: false }} redraw />
      </div>
    </>
  );
};

export default ProfileStatisticChart;
