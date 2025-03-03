import { Text, TextInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";

type ExternalLinkBodyDataType = {
  data: object[];
};

type ExternalLinkBodyOptions = ExternalLinkBodyDataType & ColumnOptions;

function ExternalLinkBody(columnOptions: ExternalLinkBodyOptions) {
  return (currentRow: CurrentRow) => {
    const fieldValue = ''+currentRow[columnOptions.field];
    return (
      <Text size="xs" truncate="end" maw={300}>
        <a href={fieldValue}>{fieldValue}</a>
      </Text>
    );
  };
}

function ExternalLinkFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: string) => {
    options.filterApplyCallback(value);
  }, 1000);
  return (
    <TextInput
      // value={options.value}
      miw={100}
      size="xs"
      onChange={(event) => {
        handleChange(event.currentTarget.value);
      }}
    />
  );
}

export function ExternalLinkColumn(columnOptions: ExternalLinkBodyOptions): ColumnProps{
  const isFiltered = typeof columnOptions.isFiltered !== 'undefined' ? !!columnOptions.isFiltered : true; // default to true
  const isUnsortable = typeof columnOptions.isUnsortable !== 'undefined' ? !!columnOptions.isUnsortable : false;
  const isHidden = typeof columnOptions.isHidden !== 'undefined' ? !!columnOptions.isHidden : false;
  const isFrozen = typeof columnOptions.isFrozen !== 'undefined' ? !!columnOptions.isFrozen : false;
  const filterConfig: FilterConfig = {};
  filterConfig[columnOptions.field] = {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH
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
        body={ExternalLinkBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="text"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => ExternalLinkFilter(options) : undefined}
      />
    )
  };
}