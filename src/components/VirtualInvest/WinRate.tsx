// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from '@nivo/pie';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsivePie = ({ data }: any) => {
  const { win, loss } = data;

  const winRate = [
    {
      id: 'loss',
      label: 'loss',
      value: loss,
      color: 'rgba(38, 166, 154, 1)',
    },
    {
      id: 'win',
      label: 'win',
      value: win,
      color: 'rgba(255, 78, 66, 1)',
    },
  ];
  const color = 'rgba(38, 166, 154, 1)';

  return (
    <ResponsivePie
      data={winRate}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      startAngle={-180}
      innerRadius={0.5}
      activeOuterRadiusOffset={8}
      // colors={{ scheme: 'blues' }}
      // colors={'rgba(38, 166, 154, 1)'}
      colors={color}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0]],
      }}
      enableArcLinkLabels={false}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={0}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 1]],
      }}
      isInteractive={false}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'win',
          },
          id: 'win',
        },
        {
          match: {
            id: 'loss',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'go',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'python',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'scala',
          },
          id: 'lines',
        },
        {
          match: {
            id: 'lisp',
          },
          id: 'lines',
        },
        {
          match: {
            id: 'elixir',
          },
          id: 'lines',
        },
        {
          match: {
            id: 'javascript',
          },
          id: 'lines',
        },
      ]}
      legends={[]}
    />
  );
};

export default MyResponsivePie;
