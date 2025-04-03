import Pie from '../../common/nivo/Pie';
import { getValidationColor, getValidationLabel, getValidationParams } from '../../common/enums/validation';
import { openNewTab } from '../../common/utils';

export function ValidationPie({ stats }) {
  const national = Object.keys(stats.national || {}).reduce((acc, key) => {
    return [
      ...acc,
      {
        id: key,
        label: getValidationLabel(key),
        value: stats.national[key],
      },
    ];
  }, []);

  return (
    <Pie
      label="organismes"
      data={national}
      direction={'column'}
      getLabel={(id) => getValidationLabel(id)}
      getColor={(id) => getValidationColor(id)}
      onClick={({ id }) => openNewTab('/organismes', getValidationParams(id))}
    />
  );
}
