import React from 'react';
import Chart from 'react-apexcharts';

interface DashboardChartProps {
  type: 'sales' | 'products';
  period: 'day' | 'week' | 'month';
}

const DashboardChart: React.FC<DashboardChartProps> = ({ type, period }) => {
  // Demo data for charts
  const salesData = {
    day: [4500, 5200, 3800, 6100, 5300, 4900, 7200],
    week: [28000, 32000, 25000, 38000, 35000],
    month: [42000, 48000, 38000, 52000, 45000, 58000],
  };
  
  const productsData = {
    day: [
      { name: 'دهان أبيض مطفي', data: 5 },
      { name: 'دهان أساس خارجي', data: 4 },
      { name: 'دهان ديكوري ذهبي', data: 3 },
      { name: 'دهان مقاوم للرطوبة', data: 7 },
      { name: 'دهان عازل حراري', data: 2 },
    ],
    week: [
      { name: 'دهان أبيض مطفي', data: 15 },
      { name: 'دهان أساس خارجي', data: 12 },
      { name: 'دهان ديكوري ذهبي', data: 8 },
      { name: 'دهان مقاوم للرطوبة', data: 18 },
      { name: 'دهان عازل حراري', data: 6 },
    ],
    month: [
      { name: 'دهان أبيض مطفي', data: 45 },
      { name: 'دهان أساس خارجي', data: 38 },
      { name: 'دهان ديكوري ذهبي', data: 25 },
      { name: 'دهان مقاوم للرطوبة', data: 52 },
      { name: 'دهان عازل حراري', data: 22 },
    ],
  };

  const getLabels = () => {
    if (period === 'day') {
      return ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    } else if (period === 'week') {
      return ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    } else {
      return ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    }
  };

  if (type === 'sales') {
    const options = {
      chart: {
        id: 'sales-chart',
        toolbar: {
          show: false,
        },
        fontFamily: 'Cairo, sans-serif',
      },
      xaxis: {
        categories: getLabels(),
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            return `${value.toLocaleString('ar-EG')} ج.م`;
          },
        },
      },
      colors: ['#0284c7'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return `${value.toLocaleString('ar-EG')} ج.م`;
          },
        },
      },
    };

    const series = [
      {
        name: 'المبيعات',
        data: salesData[period],
      },
    ];

    return <Chart options={options} series={series} type="area" height="100%" />;
  } else {
    // Product chart
    const currentProducts = productsData[period];
    const options = {
      chart: {
        id: 'products-chart',
        toolbar: {
          show: false,
        },
        fontFamily: 'Cairo, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '70%',
          distributed: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      colors: ['#0284c7', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        offsetX: 5,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      xaxis: {
        categories: currentProducts.map(product => product.name),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
    };

    const series = [
      {
        name: 'الكمية',
        data: currentProducts.map(product => product.data),
      },
    ];

    return <Chart options={options} series={series} type="bar" height="100%" />;
  }
};

export default DashboardChart;