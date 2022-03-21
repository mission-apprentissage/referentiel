import { ResponsivePie } from "@nivo/pie";
import { theme } from "./nivo";
import { BasicTooltip } from "@nivo/tooltip";

export default function Pie({ getLabel, getColor, getTooltipLabel, ...rest }) {
  return (
    <ResponsivePie
      theme={theme}
      margin={{ top: 80, right: 80, bottom: 40, left: 80 }}
      innerRadius={0.4}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      arcLinkLabel={({ id }) => getLabel(id)}
      colors={({ id }) => getColor(id)}
      tooltip={({ datum }) => {
        let { id, value, color } = datum;
        return <BasicTooltip id={getLabel(id)} value={value} color={color} enableChip />;
      }}
      legends={[
        {
          anchor: "top-left",
          direction: "row",
          justify: false,
          translateY: -55,
          translateX: -50,
          itemsSpacing: 5,
          itemWidth: 110,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
      {...rest}
    />
  );
}
