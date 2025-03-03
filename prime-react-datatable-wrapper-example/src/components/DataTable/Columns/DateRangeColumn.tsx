import { Flex } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, OptionalLinkRoute } from "../ColumnOptions";
import { DateInput } from "@mantine/dates";

type DateRangeFilterOptions = ColumnOptions;

type DateRangeDataType = {
  data: object[];
}

type DateRangeOptions = DateRangeDataType & ColumnOptions;

function DateRangeBody(columnOptions: DateRangeFilterOptions) {
  return (currentRow: CurrentRow) => {
    const primaryKey = columnOptions.field;
    const primaryValue = currentRow[primaryKey] !== undefined ? currentRow[primaryKey] as Date : null;
    return <>{primaryValue ? primaryValue.toLocaleDateString() : ''}</>;
  };
}

function DateRangeFilter(options: ColumnFilterElementTemplateOptions, columnOptions: DateRangeOptions) {
  const [from, to] = options.value ?? [null, null];
  const timestamps = [...new Set(columnOptions.data.map(row => {
    const rowWithDate = row as Record<string, Date>;
    return rowWithDate[columnOptions.field] ? rowWithDate[columnOptions.field].valueOf() : null;
  }))].filter((timestamp) => timestamp !== null) as number[];
  const minDate = timestamps !== undefined && timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null;
  const maxDate = timestamps !== undefined && timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null;
  return (
    <Flex direction="column">
      <DateInput
        clearable
        defaultValue={minDate || null}
        valueFormat="MM/DD/YY"
        placeholder="Start"
        miw={100}
        onChange={value => {
          options.filterApplyCallback([value, to]);
        }}
      />
      <DateInput
        clearable
        defaultValue={maxDate || null}
        valueFormat="MM/DD/YY"
        placeholder="End"
        miw={100}
        onChange={value => {
          options.filterApplyCallback([from, value]);
        }}
      />
    </Flex>
  );
}

export function DateRangeColumn(columnOptions: DateRangeOptions): ColumnProps & OptionalLinkRoute{
  const isFiltered = typeof columnOptions.isFiltered !== 'undefined' ? !!columnOptions.isFiltered : true; // default to true
  const isUnsortable = typeof columnOptions.isUnsortable !== 'undefined' ? !!columnOptions.isUnsortable : false;
  const isHidden = typeof columnOptions.isHidden !== 'undefined' ? !!columnOptions.isHidden : false;
  const isFrozen = typeof columnOptions.isFrozen !== 'undefined' ? !!columnOptions.isFrozen : false;
  const filterConfig: FilterConfig = {};
  filterConfig[columnOptions.field] = {
    value: null,
    matchMode: FilterMatchMode.CUSTOM
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
    customFilter: {
      filterName: 'custom_'+columnOptions.field,
      filterMethod: (value, filters) => {
        const [from, to] = filters ?? [null, null];
        if (from === null && to === null) {
          return true;
        }
        if (from !== null && to === null){
          return from <= value;
        }
        if (from === null && to !== null){
          return value <= to;
        }
        return from <= value && value <= to;
      }
    },
    filterConfig,
    column: <Column
      key={columnOptions.field}
      field={columnOptions.field}
      header={columnOptions.header}
      body={DateRangeBody(columnOptions)}
      style={columnOptions.style || undefined}
      sortable={!isUnsortable}
      dataType="date"
      showClearButton={false}
      filter={isFiltered}
      filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => DateRangeFilter(options, columnOptions) : undefined}
    />
  };
}