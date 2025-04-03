import { ResponsivePie } from '@nivo/pie';
import { theme } from './nivo';
import { BasicTooltip } from '@nivo/tooltip';
import { Legends } from './Legends';
import { Col, GridRow } from '../dsfr/fondamentaux';
import { cloneElement } from 'react';
import { percentage } from '../utils.js';

const buildTotalCentricLayer = (label, total) => {
  return ({ centerX, centerY }) => {
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '0.875rem',
          fill: 'rgb(106, 106, 106)',
        }}
      >
        {total} {label || ''}
      </text>
    );
  };
};

export default function Pie({
  data,
  direction,
  label,
  getLabel,
  getColor,
  getTooltipLabel,
  height = '500px',
  ...rest
}) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  const pie = (
    <ResponsivePie
      theme={theme}
      data={data}
      margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
      innerRadius={0.4}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      arcLinkLabel={({ id }) => getLabel(id)}
      colors={({ id }) => getColor(id)}
      tooltip={({ datum }) => {
        const { id, value, color } = datum;
        const v = `${Math.round(percentage(value, total))}% (${value})`;
        return <BasicTooltip id={getLabel(id)} value={v} color={color} enableChip />;
      }}
      layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', buildTotalCentricLayer(label, total)]}
      {...rest}
    />
  );

  const legends = (
    <Legends
      definitions={data.map((item) => {
        return { label: item.label, color: getColor(item.id) };
      })}
    />
  );

  if (direction === 'column') {
    return (
      <GridRow modifiers="middle" style={{ backgroundColor: '#f9f8f6' }}>
        <Col modifiers={'12 offset-sm-2 sm-3'}>{cloneElement(legends, { direction, justify: 'between' })}</Col>
        <Col modifiers={'12 sm-7'}>
          <div style={{ height }}>{pie}</div>
        </Col>
      </GridRow>
    );
  }

  return (
    <>
      {legends}
      <div style={{ height }}>{pie}</div>
    </>
  );
}
