import { ResponsiveBar } from "@nivo/bar";
import { BasicTooltip } from "@nivo/tooltip";
import { theme } from "./nivo";

export default function Histogram({ xLegend, yLegend, getLabel, getColor, ...rest }) {
  return (
    <ResponsiveBar
      theme={theme}
      role="application"
      indexBy={"key"}
      enableGridY={false}
      margin={{ top: 75, right: 50, bottom: 125, left: 100 }}
      padding={0.6}
      enableLabel={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 20,
        tickPadding: 5,
        tickRotation: -25,
        legend: xLegend,
        legendPosition: "middle",
        legendOffset: 100,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLegend,
        legendPosition: "middle",
        legendOffset: -75,
      }}
      colors={({ id }) => getColor(id)}
      legendLabel={({ id }) => getLabel(id)}
      tooltip={({ id, value, color }) => {
        return <BasicTooltip id={getLabel(id)} value={value} color={color} enableChip />;
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "top-left",
          direction: "row",
          justify: false,
          translateY: -50,
          translateX: -75,
          itemsSpacing: 2,
          itemWidth: 110,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      {...rest}
    />
  );
}
