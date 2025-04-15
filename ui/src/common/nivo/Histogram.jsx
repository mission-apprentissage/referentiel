import { ResponsiveBar } from '@nivo/bar';
import { BasicTooltip } from '@nivo/tooltip';
import { theme } from './nivo';
import { Legends } from './Legends';
import { percentage } from '../utils';


export default function Histogram ({
                                     title,
                                     series,
                                     xLegend,
                                     yLegend,
                                     getSerieLabel,
                                     getSerieColor,
                                     groupBy = 'key',
                                     height = '500px',
                                     ...rest
                                   }) {
  return (
    <>
      <Legends
        definitions={series.map((group) => {
          return { label: getSerieLabel(group), color: getSerieColor(group) };
        })}
      />
      <div style={{ height }}>
        <ResponsiveBar
          ariaLabel={title}
          theme={theme}
          role="application"
          keys={series}
          indexBy={groupBy}
          enableGridY={false}
          margin={{ top: 50, right: 50, bottom: 125, left: 100 }}
          padding={0.6}
          enableLabel={false}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize:       0,
            tickPadding:    25,
            tickRotation:   -25,
            legend:         xLegend,
            legendPosition: 'middle',
            legendOffset:   100,
          }}
          axisLeft={{
            tickSize:       5,
            tickPadding:    5,
            tickRotation:   0,
            legend:         yLegend,
            legendPosition: 'middle',
            legendOffset:   -75,
          }}
          colors={({ id }) => getSerieColor(id)}
          legendLabel={({ id }) => getSerieLabel(id)}
          tooltip={({ id, value, color, data }) => {
            const total = series.map((s) => data[s]).reduce((acc, v) => acc + v, 0);
            const v = `${Math.round(percentage(value, total))}% (${value})`;
            return <BasicTooltip id={getSerieLabel(id)} value={v} color={color} enableChip />;
          }}
          {...rest}
        />
      </div>
    </>
  );
}
