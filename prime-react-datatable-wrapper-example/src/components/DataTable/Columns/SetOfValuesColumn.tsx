import { MultiSelect, Pill } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";

type SetOfValuesBodyDataType = {
  data: object[];
  setOfValues: string[];
};

type SetOfValuesBodyOptions = SetOfValuesBodyDataType & ColumnOptions;

function SetOfValuesBody(columnOptions: SetOfValuesBodyOptions) {
  return (currentRow: CurrentRow) => {
    const fieldValue = ''+currentRow[columnOptions.field];
    return (
      <Pill>
        {fieldValue}
      </Pill>
    );
  };
}

function SetOfValuesFilter(options: ColumnFilterElementTemplateOptions, columnOptions: SetOfValuesBodyOptions) {
  const uniqueValues = [...new Set(columnOptions.setOfValues)];
  return (
    <MultiSelect
      data={uniqueValues}
      miw={100}
      onChange={(value) => {
        options.filterApplyCallback(value);
      }}
    />
  );
}

export function SetOfValuesColumn(columnOptions: SetOfValuesBodyOptions): ColumnProps{
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
        body={SetOfValuesBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="text"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => SetOfValuesFilter(options, columnOptions) : undefined}
      />
    )
  };
}