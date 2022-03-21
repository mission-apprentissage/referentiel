import { ResponsivePie } from "@nivo/pie";
import { theme } from "./nivo";
import { BasicTooltip } from "@nivo/tooltip";
import { Legends } from "./Legends";

export default function Pie({ data, getLabel, getColor, getTooltipLabel, height = "500px", ...rest }) {
  return (
    <>
      <Legends
        definitions={data.map((item) => {
          return { label: item.label, color: getColor(item.id) };
        })}
      />
      <div style={{ height }}>
        <ResponsivePie
          theme={theme}
          data={data}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
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
          {...rest}
        />
      </div>
    </>
  );
}
