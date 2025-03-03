import { Text, TextInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, OptionalLinkRoute } from "../ColumnOptions";
import { useDebouncedCallback } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";

type TextBodyDataType = {
  data: object[];
};

type TextBodyOptions = TextBodyDataType & OptionalLinkRoute & ColumnOptions;

function TextBody(columnOptions: TextBodyOptions) {
  return (currentRow: CurrentRow) => {
    const text = ''+currentRow[columnOptions.field];
    if(columnOptions.link){
      // iterate over the properties of the object and replace the values with the currentRow values
      const params = Object.fromEntries(Object.entries(columnOptions.link.params).map(([key, value]) => {
        return [key, currentRow[value]];
      }));
      return (
        <Text
          size="md"
          maw={300}
          truncate="end"
        >
          <Link
            to={columnOptions.link.to}
            params={params}>
            {text}
          </Link>
        </Text>
      );
    }
    else {
      return (
        <Text
          size="md"
          maw={300}
          truncate="end"
        >
          {text}
        </Text>
      );
    }
  };
}

function TextFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: string) => {
    options.filterApplyCallback(value);
  }, 1000);
  return (
    <TextInput
      miw={100}
      maw={300}
      size="xs"
      onChange={(event) => {
        handleChange(event.currentTarget.value);
      }}
    />
  );
}

export function TextColumn(columnOptions: TextBodyOptions): ColumnProps{
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
        body={TextBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="text"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => TextFilter(options) : undefined}
      />
    )
  };
}