import { Flex, MultiSelect } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";

type ActionBodyDataType = {
  data: object[];
  actionComponent: (currentRow: CurrentRow, fieldValue: unknown, columnOptions: ActionBodyOptions) => JSX.Element;
};

type ActionBodyOptions = ActionBodyDataType & ColumnOptions;

function ActionBody(columnOptions: ActionBodyOptions) {
  return (currentRow: CurrentRow) => {
    const fieldValue = currentRow[columnOptions.field];

    return (
      <Flex justify="center">
        {columnOptions.actionComponent(currentRow, fieldValue, columnOptions)}
      </Flex>
    );
  };
}

function ActionFilter(options: ColumnFilterElementTemplateOptions, columnOptions: ActionBodyOptions) {
  const uniqueValues = [...new Set(columnOptions.data.map(row => {
    const rowWithStrings = row as Record<string, string>;
    return rowWithStrings[columnOptions.field];
  }))].sort() as string[];
  return (
    <MultiSelect
      data={uniqueValues}
      miw={100}
      maw={200}
      styles={{
        pillsList: {
          maxHeight: '60px',
          overflowY: 'auto'
        }
      }}
      onChange={(value) => {
        options.filterApplyCallback(value);
      }}
    />
  );
}

export function ActionColumn(columnOptions: ActionBodyOptions): ColumnProps{
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
        body={ActionBody(columnOptions)}
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
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => ActionFilter(options, columnOptions) : undefined}
      />
    )
  };
}