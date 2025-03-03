import { MultiSelect, Text } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";

type RowWithJuryRound = {
  id?: number;
  final_round?: number;
};

type JuryRoundBodyDataType = {
  data: RowWithJuryRound[];
};

type JuryRoundBodyOptions = JuryRoundBodyDataType & ColumnOptions;

function JuryRoundBody(columnOptions: JuryRoundBodyOptions) {
  return (currentRow: CurrentRow) => {
    const roundValue = currentRow[columnOptions.field] as number;
    const finalRound = currentRow.final_round ? currentRow.final_round : 0;
    let roundLabel = 'Round '+roundValue;
    if(roundValue < 1) {
      roundLabel = roundLabel+', Not Started';
    }
    else if(roundValue === finalRound) {
      roundLabel = roundLabel+', Completed';
    }
    return (
      <Text size="sm" ta="center" fw={1000}>
        {roundLabel}
      </Text>
    );
  };
}

function JuryRoundFilter(options: ColumnFilterElementTemplateOptions, columnOptions: JuryRoundBodyOptions) {
  const handleChange = useDebouncedCallback((value: string[]) => {
    options.filterApplyCallback(value);
  }, 1000);

  const rounds = [...new Set(columnOptions.data.map((row: Record<string, unknown>) => {
    return row[columnOptions.field];
  }))].sort().map(round => {
    return ''+round;
  }) as string[];

  return (
    <MultiSelect
      // value={options.value}
      data={rounds}
      w={100}
      onChange={(value) => {
        handleChange(value);
      }}
    />
  );
}

export function JuryRoundColumn(columnOptions: JuryRoundBodyOptions): ColumnProps{
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
        body={JuryRoundBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="numeric"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => JuryRoundFilter(options, columnOptions) : undefined}
      />
    )
  };
}