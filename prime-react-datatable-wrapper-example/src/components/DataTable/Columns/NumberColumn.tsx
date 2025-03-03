import { NumberInput, Text } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";

type ObjectWithActiveFlag = object;

type NumberBodyDataType = {
  data: ObjectWithActiveFlag[];
};

type NumberBodyOptions = NumberBodyDataType & ColumnOptions;

function NumberBody(columnOptions: NumberBodyOptions) {
  return (currentRow: CurrentRow) => {
    const fieldValue = ''+currentRow[columnOptions.field];
    return (
      <Text size="xl" ta="center">
        {fieldValue}
      </Text>
    );
  };
}

function NumberFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: number) => {
    options.filterApplyCallback(value);
  }, 1000);
  return (
    <NumberInput
      // value={options.value}
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
      size="xs"
      onChange={(value) => {
        handleChange(+value);
      }}
    />
  );
}

export function NumberColumn(columnOptions: NumberBodyOptions): ColumnProps{
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
        body={NumberBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="numeric"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => NumberFilter(options) : undefined}
      />
    )
  };
}