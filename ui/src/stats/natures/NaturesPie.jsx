import Pie from '../../common/nivo/Pie';
import { openNewTab } from '../../common/utils';
import { getNatureColor, getNatureLabel, getNatureParams } from '../../common/enums/natures';

export function NaturesPie({ stats }) {
  const national = Object.keys(stats.national).reduce((acc, key) => {
    return [
      ...acc,
      {
        id: key,
        label: getNatureLabel(key),
        value: stats.national[key],
      },
    ];
  }, []);

  return (
    <Pie
      label="organismes"
      data={national}
      direction={'column'}
      getLabel={(id) => getNatureLabel(id)}
      getColor={(id) => getNatureColor(id)}
      onClick={({ id }) => openNewTab('/organismes', getNatureParams(id))}
      arcLabelsTextColor="white"
    />
  );
}
