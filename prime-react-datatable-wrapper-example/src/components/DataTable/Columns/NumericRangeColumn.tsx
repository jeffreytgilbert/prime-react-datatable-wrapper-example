import { Link } from "@tanstack/react-router";
import { Flex, NumberInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, OptionalLinkRoute } from "../ColumnOptions";

type NumericRangeFilterOptions = OptionalLinkRoute & ColumnOptions;

type NumericRangeDataType = {
  data: object[];
}

type NumericRangeOptions = NumericRangeDataType & OptionalLinkRoute & ColumnOptions;

function NumericRangeBody(columnOptions: NumericRangeFilterOptions) {
  return (currentRow: CurrentRow) => {
    const primaryKey = columnOptions.field;
    const fieldValue = ''+currentRow[primaryKey];

    if(columnOptions.link){
      // iterate over the properties of the object and replace the values with the currentRow values
      const params = Object.fromEntries(Object.entries(columnOptions.link.params).map(([key, value]) => {
        return [key, currentRow[value]];
      }));

      return (
        <Link
          to={columnOptions.link.to}
          params={params}>
          #{fieldValue}
        </Link>
      );
    }
    else {
      return <>{fieldValue}</>;
    }
  };
}

function NumericRangeFilter(options: ColumnFilterElementTemplateOptions) {
  const [from, to] = options.value ?? [null, null];
  return (
    <Flex direction="column" gap={4}>
      <NumberInput
        // value={from}
        placeholder="from"
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
        onChange={value => {
          options.filterApplyCallback([value, to]);
        }}
      />
      <NumberInput
        // value={to}
        placeholder="to"
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
        onChange={value => {
          options.filterApplyCallback([from, value]);
        }}
      />
    </Flex>
  );
}

export function NumericRangeColumn(columnOptions: NumericRangeOptions): ColumnProps & OptionalLinkRoute{
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
    link: columnOptions.link,
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
      body={NumericRangeBody(columnOptions)}
      style={columnOptions.style || undefined}
      sortable={!isUnsortable}
      dataType="numeric"
      showClearButton={false}
      filter={isFiltered}
      filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => NumericRangeFilter(options) : undefined}
    />
  };
}