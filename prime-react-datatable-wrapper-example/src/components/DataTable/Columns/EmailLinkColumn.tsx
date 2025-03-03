import { Text, TextInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";

type EmailBodyDataType = {
  data: object[];
};

type EmailBodyOptions = EmailBodyDataType & ColumnOptions;

function EmailBody(columnOptions: EmailBodyOptions) {
  return (currentRow: CurrentRow) => {
    const fieldValue = ''+currentRow[columnOptions.field];
    return (
      <Text size="md" truncate="end" maw={300}>
        <a href={'mailto:' + fieldValue}>{fieldValue}</a>
      </Text>
    );
  };
}

function EmailFilter(options: ColumnFilterElementTemplateOptions) {
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

export function EmailColumn(columnOptions: EmailBodyOptions): ColumnProps{
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
        body={EmailBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="text"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => EmailFilter(options) : undefined}
      />
    )
  };
}