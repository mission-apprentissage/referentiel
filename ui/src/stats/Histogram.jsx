import { ResponsiveBar } from "@nivo/bar";
import { BasicTooltip } from "@nivo/tooltip";

export default function Histogram({ xLegend, yLegend, getTooltipLabel, ...rest }) {
  return (
    <ResponsiveBar
      role="application"
      indexBy={"key"}
      enableGridY={false}
      theme={{ background: "#F9F8F6" }}
      margin={{ top: 75, right: 100, bottom: 125, left: 100 }}
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
      tooltip={({ id, value, color }) => {
        let text = getTooltipLabel ? getTooltipLabel({ id }) : id;
        return <BasicTooltip id={text} value={value} color={color} enableChip />;
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
          itemWidth: 100,
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
