import { Link } from "@tanstack/react-router";
import { Flex, NumberInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, RequireLinkRoute } from "../ColumnOptions";

type PrimaryIdNumericRangeFilterOptions = RequireLinkRoute & ColumnOptions;

type ObjectWithId = {
  id: number;
};

type PrimaryIdNumericRangeDataType = {
  data: ObjectWithId[];
}

type PrimaryIdNumericRangeOptions = PrimaryIdNumericRangeDataType & RequireLinkRoute & ColumnOptions;

function PrimaryIdNumericRangeBody(columnOptions: PrimaryIdNumericRangeFilterOptions) {
  return (currentRow: CurrentRow) => {
    const primaryKey = columnOptions.field || 'id';
    const fieldValue = ''+currentRow[primaryKey];

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
  };
}

function PrimaryIdNumericRangeFilter(options: ColumnFilterElementTemplateOptions) {
  const [from, to] = options.value ?? [null, null];
  return (
    <Flex direction="column" gap={4}>
      <NumberInput
        placeholder="from"
        miw={100}
        size="xs"
        onChange={value => {
          options.filterApplyCallback([value, to]);
        }}
      />
      <NumberInput
        placeholder="to"
        miw={100}
        size="xs"
        onChange={value => {
          options.filterApplyCallback([from, value]);
        }}
      />
    </Flex>
  );
}

export function PrimaryIdNumericRangeColumn(columnOptions: PrimaryIdNumericRangeOptions): ColumnProps & RequireLinkRoute{
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
    field: columnOptions.field || 'id',
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
      key={columnOptions.field || 'id'}
      field={columnOptions.field || 'id'}
      header={columnOptions.header}
      body={PrimaryIdNumericRangeBody(columnOptions)}
      style={columnOptions.style || undefined}
      sortable={!isUnsortable}
      dataType="numeric"
      showClearButton={false}
      filter={isFiltered}
      filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => PrimaryIdNumericRangeFilter(options) : undefined}
    />
  };
}