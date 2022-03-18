import { ResponsivePie } from "@nivo/pie";
import { theme } from "./nivo";

export default function Pie(props) {
  return (
    <ResponsivePie
      theme={theme}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 5,
          itemWidth: 100,
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
      {...props}
    />
  );
}
