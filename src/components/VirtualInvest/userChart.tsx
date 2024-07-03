import { ResponsiveLine } from '@nivo/line';

const MyResponsiveLine = ({ data }: any) => {
  //   const profitArray = data;
  const profitArray = Array.isArray(data) ? data : [];
  // console.log(profitArray);

  const chartData = [
    {
      id: 'profits',
      color: 'blue',
      data: profitArray.map((value: any, index: any) => ({
        x: `${index + 1} 회`,
        y: value !== null ? value.toFixed(2) : 0,
      })),
    },
  ];

  return (
    <>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 80, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false,
        }}
        curve="natural"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '게임 횟수',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={'blue'}
        lineWidth={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enablePointLabel={true}
        pointLabelYOffset={-12}
        enableArea={true}
        areaBaselineValue={50}
        areaOpacity={0.05}
        useMesh={true}
        legends={[
          {
            anchor: 'top',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: -30,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 24,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default MyResponsiveLine;
