import { NumberInput, Text } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, OptionalLinkRoute } from "../ColumnOptions";
import { Link } from "@tanstack/react-router";
import { useDebouncedCallback } from "@mantine/hooks";

type RelatedIdNumberBodyDataType = {
  data: object[];
};

type RelatedIdNumberBodyOptions = RelatedIdNumberBodyDataType & OptionalLinkRoute & ColumnOptions;

function RelatedIdNumberBody(columnOptions: RelatedIdNumberBodyOptions) {
  return (currentRow: CurrentRow) => {
    const relatedKey = columnOptions.field;
    const relatedValue = ''+currentRow[relatedKey];

    if(columnOptions.link){
      // iterate over the properties of the object and replace the values with the currentRow values
      const params = Object.fromEntries(Object.entries(columnOptions.link.params).map(([key, value]) => {
        return [key, currentRow[value]];
      }));

      return (
        <Link
          to={columnOptions.link.to}
          params={params}>
          #{relatedValue}
        </Link>
      );
    }
    else {
      return <Text>#{relatedValue}</Text>;
    }
  };
}

function RelatedIdNumberFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: number) => {
    options.filterApplyCallback(value);
  }, 1000);
  return (
    <NumberInput
      miw={100}
      onChange={(value) => {
        handleChange(+value);
      }}
    />
  );
}

export function RelatedIdNumberColumn(columnOptions: RelatedIdNumberBodyOptions): ColumnProps{
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
        body={RelatedIdNumberBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="numeric"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => RelatedIdNumberFilter(options) : undefined}
      />
    )
  };
}