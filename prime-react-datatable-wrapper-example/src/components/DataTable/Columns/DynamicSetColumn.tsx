import { MultiSelect, Pill } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";

type DynamicSetBodyDataType = {
  data: object[];
};

type DynamicSetBodyOptions = DynamicSetBodyDataType & ColumnOptions;

function DynamicSetBody(columnOptions: DynamicSetBodyOptions) {
  return (currentRow: CurrentRow) => {
    const fieldValue = ''+currentRow[columnOptions.field];
    return (
      <Pill size="lg">
        {fieldValue}
      </Pill>
    );
  };
}

function DynamicSetFilter(options: ColumnFilterElementTemplateOptions, columnOptions: DynamicSetBodyOptions) {
  const uniqueValues = [...new Set(columnOptions.data.map(row => {
    const rowWithStrings = row as Record<string, string>;
    return rowWithStrings[columnOptions.field];
  }))].sort() as string[];
  return (
    <MultiSelect
      data={uniqueValues}
      miw={75}
      maw={150}
      searchable
      styles={{
        pillsList: {
          maxHeight: '60px',
          overflowY: 'auto',
        }
      }}
      size="xs"
      onChange={(value) => {
        options.filterApplyCallback(value || '');
      }}
    />
  );
}

export function DynamicSetColumn(columnOptions: DynamicSetBodyOptions): ColumnProps{
  const isFiltered = typeof columnOptions.isFiltered !== 'undefined' ? !!columnOptions.isFiltered : true; // default to true
  const isUnsortable = typeof columnOptions.isUnsortable !== 'undefined' ? !!columnOptions.isUnsortable : false;
  const isHidden = typeof columnOptions.isHidden !== 'undefined' ? !!columnOptions.isHidden : false;
  const isFrozen = typeof columnOptions.isFrozen !== 'undefined' ? !!columnOptions.isFrozen : false;
  const filterConfig: FilterConfig = {};
  filterConfig[columnOptions.field] = {
    value: null,
    matchMode: FilterMatchMode.IN
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
        body={DynamicSetBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="text"
        // showFilterMatchModes={false}
        // showFilterMenuOptions={false}
        // showAddButton={false}
        // showApplyButton={false}
        // showFilterOperator={false}
        showClearButton={false}
        showFilterMenu={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => DynamicSetFilter(options, columnOptions) : undefined}
      />
    )
  };
}