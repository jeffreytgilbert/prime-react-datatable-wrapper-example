import { Text, TextInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";
import { formatPhoneNumber } from "../formatPhoneNumber";

type ObjectWithActiveFlag = object;

type PhoneBodyDataType = {
  data: ObjectWithActiveFlag[];
};

type PhoneBodyOptions = PhoneBodyDataType & ColumnOptions;

function PhoneBody(columnOptions: PhoneBodyOptions) {
  return (currentRow: CurrentRow) => {
    const unfilteredPhoneNumber = currentRow[columnOptions.field] as string;
    const { formattedPhone, filteredNumber } = formatPhoneNumber(unfilteredPhoneNumber);
    // Link to call the phone number on click
    return (
      <Text size="md">
        <a title={"Original Number: "+unfilteredPhoneNumber} href={'tel:' + filteredNumber}>{formattedPhone}</a>
      </Text>
    );
  };
}

function PhoneFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: string) => {
    const filteredNumber = formatPhoneNumber(value).filteredNumber;
    options.filterApplyCallback(filteredNumber);
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

export function PhoneColumn(columnOptions: PhoneBodyOptions): ColumnProps{
  const isFiltered = typeof columnOptions.isFiltered !== 'undefined' ? !!columnOptions.isFiltered : true; // default to true
  const isUnsortable = typeof columnOptions.isUnsortable !== 'undefined' ? !!columnOptions.isUnsortable : false;
  const isHidden = typeof columnOptions.isHidden !== 'undefined' ? !!columnOptions.isHidden : false;
  const isFrozen = typeof columnOptions.isFrozen !== 'undefined' ? !!columnOptions.isFrozen : false;
  const filterConfig: FilterConfig = {};
  filterConfig[columnOptions.field] = {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
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
        body={PhoneBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="text"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => PhoneFilter(options) : undefined}
      />
    )
  };
}