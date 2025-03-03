import { NumberInput } from "@mantine/core";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, RequireLinkRoute } from "../ColumnOptions";
import { Link } from "@tanstack/react-router";
import { useDebouncedCallback } from "@mantine/hooks";

type PrimaryIdNumberBodyDataType = {
  data: object[];
};

type PrimaryIdNumberBodyOptions = PrimaryIdNumberBodyDataType & RequireLinkRoute & ColumnOptions;

function PrimaryIdNumberBody(columnOptions: PrimaryIdNumberBodyOptions) {
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

function PrimaryIdNumberFilter(options: ColumnFilterElementTemplateOptions) {
  const handleChange = useDebouncedCallback((value: number) => {
    options.filterApplyCallback(value);
  }, 1000);
  return (
    <NumberInput
      // value={options.value}
      leftSection="#"
      styles={{
        controls: {
          display: 'none'
        },
        section: {
          width: '20px',
          margin: '0',
          padding: '0',
        },
        input: {
          paddingLeft: '17px',
          paddingRight: '7px',
        },
      }}
      w={80}
      size="xs"
      onChange={(value) => {
        handleChange(+value);
      }}
    />
  );
}

export function PrimaryIdNumberColumn(columnOptions: PrimaryIdNumberBodyOptions): ColumnProps{
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
        body={PrimaryIdNumberBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={!isUnsortable}
        dataType="numeric"
        showClearButton={false}
        filter={isFiltered}
        filterElement={isFiltered ? (options: ColumnFilterElementTemplateOptions) => PrimaryIdNumberFilter(options) : undefined}
      />
    )
  };
}