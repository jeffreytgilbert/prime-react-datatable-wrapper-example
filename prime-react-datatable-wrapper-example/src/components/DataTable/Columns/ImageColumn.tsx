import { Column } from "primereact/column";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, OptionalLinkRoute } from "../ColumnOptions";
import { Link } from "@tanstack/react-router";
import { Center } from "@mantine/core";

type ObjectWithImage = CurrentRow;

type ImageBodyDataType = {
  data: ObjectWithImage[];
};

type RequireImageComponent = {
  imageComponent: (currentRow: CurrentRow, fieldValue: unknown, columnOptions: ImageBodyOptions) => JSX.Element;
};

type ImageBodyOptions = RequireImageComponent & ImageBodyDataType & OptionalLinkRoute & ColumnOptions;

function ImageBody(columnOptions: ImageBodyOptions) {
  return (currentRow: ObjectWithImage) => {
    return (
      <Center>
        {columnOptions.link ? (
          <Link
            to={columnOptions.link.to}
            params={Object.fromEntries(Object.entries(columnOptions.link.params).map(([key, value]) => {
              return [key, currentRow[value]];
            }))}>
            {columnOptions.imageComponent(currentRow, currentRow[columnOptions.field], columnOptions)}
          </Link>
        ) : (
          <>{columnOptions.imageComponent(currentRow, currentRow[columnOptions.field], columnOptions)}</>
        )}
      </Center>
    );
  };
}

export function ImageColumn(columnOptions: ImageBodyOptions): ColumnProps{
  const isFiltered = typeof columnOptions.isFiltered !== 'undefined' ? !!columnOptions.isFiltered : true; // default to true
  const isUnsortable = typeof columnOptions.isUnsortable !== 'undefined' ? !!columnOptions.isUnsortable : false;
  const isHidden = typeof columnOptions.isHidden !== 'undefined' ? !!columnOptions.isHidden : false;
  const isFrozen = typeof columnOptions.isFrozen !== 'undefined' ? !!columnOptions.isFrozen : false;
  const filterConfig: FilterConfig = {};
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
        body={ImageBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={false}
        filter={false}
      />
    )
  };
}