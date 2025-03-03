import { NumberInput, Text } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";

type RowWithAppRound = {
  current_round: number;
  final_round: number;
} & CurrentRow;

type AppRoundBodyDataType = {
  data: RowWithAppRound[];
};

type AppRoundBodyOptions = AppRoundBodyDataType & ColumnOptions;

function AppRoundBody(columnOptions: AppRoundBodyOptions) {
  return (currentRow: RowWithAppRound) => {
    const roundValue = currentRow[columnOptions.field] as number;
    let roundLabel = 'Round '+roundValue;
    const finalRound = currentRow.final_round ? +currentRow.final_round : 0;
    if(roundValue < 1) {
      roundLabel = 'Not Started';
    }
    else if(roundValue === finalRound) {
      roundLabel = 'Invited';
    }
    else if(roundValue > finalRound) {
      roundLabel = 'Waitlisted';
    }
    else if(+currentRow.current_round === finalRound && roundValue < finalRound) {
      roundLabel = 'Declined, Round ' + roundValue;
    }
    return (
      <Text size="sm" ta="center" fw={1000}>
        {roundLabel}
      </Text>
    );
  };
}

function AppRoundFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: number) => {
    options.filterApplyCallback(value);
  }, 1000);

  return (
    <NumberInput
      styles={{
        controls: {
          display: 'none'
        },
        section: {
          width: '0',
          margin: '0',
          padding: '0',
        },
        input: {
          paddingLeft: '10px',
          paddingRight: '10px',
        },
      }}
      w={80}
      onChange={(value) => {
        handleChange(+value);
      }}
    />
  );
}

export function AppRoundColumn(columnOptions: AppRoundBodyOptions): ColumnProps{
  const isFiltered = typeof columnOptions.isFiltered !== 'undefined' ? !!columnOptions.isFiltered : true; // default to true
  const isUnsortable = typeof columnOptions.isUnsortable !== 'undefined' ? !!columnOptions.isUnsortable : false;
  const isHidden = typeof columnOptions.isHidden !== 'undefined' ? !!columnOptions.isHidden : false;
  const isFrozen = typeof columnOptions.isFrozen !== 'undefined' ? !!columnOptions.isFrozen : false;
  const filterConfig: FilterConfig = {};
  filterConfig[columnOptions.field] = {
    value: null,
    matchMode: FilterMatchMode.EQUALS
  };
  return {
    field: columnOptions.field,
    header: columnOptions.header,
    style: columnOptions.style,
    isFiltered,
    isUnsortable,
    isHidden,
    isFrozen,
    data: columnOptions.data,
    filterConfig,
    column: (
      <Column
        key={columnOptions.field}
        field={columnOptions.field}
        header={columnOptions.header}
        body={AppRoundBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="numeric"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => AppRoundFilter(options) : undefined}
      />
    )
  };
}