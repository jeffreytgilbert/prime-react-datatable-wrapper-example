import { Button, Flex, Select, Space } from "@mantine/core";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableSelectionMultipleChangeEvent,
  DataTableSortMeta,
  DataTableStateEvent,
  DataTableValue,
  DataTableValueArray,
} from "primereact/datatable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconFilterOff, IconPhoto } from "@tabler/icons-react";
import {
  useMediaQuery,
  useLocalStorage,
  useThrottle,
  useWindowSize,
} from "@uidotdev/usehooks";
import { VirtualScrollerProps } from "primereact/virtualscroller";
import ExportToCSVButton from "./ExportToCSVButton";
import { ColumnProps } from "./ColumnOptions";
import { dataTablePaginator } from "./DataTablePaginator";
import { NavigateOptions, useMatch, useNavigate, useSearch } from "@tanstack/react-router";
import { FilterService } from "primereact/api";
import { format } from "@formkit/tempo";
import { useSearchThumbnailSize } from '../../context/SearchThumbnailSize/context';

type FilteredSortedSearchResultsProps = {
  rows: object[];
  columns: ColumnProps[];
  tableStyle?: object;
  onSelectionChange?: (
    event: DataTableSelectionMultipleChangeEvent<DataTableValueArray>
  ) => void;
  virtualScrollerOptions?: VirtualScrollerProps;
  bulkActionButtons?: React.ReactNode;
  selection?: DataTableValue[];
  selectionMode?: "multiple" | "checkbox" | null;
  sortMode?: "single" | "multiple" | undefined;
  yOffset?: number;
  xOffset?: number;
  id?: string | number;
};

export type DataTableFilterState = {
  columnOrder: string[];
  filters: DataTableFilterMeta;
  first: number;
  multiSortMeta: DataTableSortMeta[] | null | undefined;
  rows: number;
  selection: DataTableValue[];
};

type RenderHeaderProps = {
  bulkActionButtons: React.ReactNode;
  clearFilter: () => void;
  xOffset: number;
};

const SFP_VERSION: string | number = 2;

const RenderHeader: React.FC<RenderHeaderProps> = ({
  bulkActionButtons,
  clearFilter,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max-content 1fr 150px",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {bulkActionButtons ? bulkActionButtons : <Space />}
      <Space />
      <Button
        type="button"
        leftSection={<IconFilterOff size={16} />}
        size="sm"
        style={{ width: "100%" }}
        variant="light"
        onClick={clearFilter}
      >
        Clear Filters
      </Button>
    </div>
  );
};

const wrapFilterMeta = (filterData: DataTableStateEvent) => {
  return {
    lastTouched: format(new Date(), "full"),
    sfp: filterData,
  };
};

export const FilteredSortedSearchResults: React.FC<FilteredSortedSearchResultsProps> = ({
  rows,
  columns,
  tableStyle,
  onSelectionChange = () => {},
  virtualScrollerOptions,
  bulkActionButtons,
  selection = [],
  selectionMode = null,
  sortMode = "multiple",
  yOffset = 0,
  xOffset = 0,
}) => {
  const dt = useRef(null);
  const navigate = useNavigate();
  const queryParams = useSearch({ strict: false });
  const match = useMatch({ strict: false });
  const filteredFilters = useMemo(() => {
    return columns
      .filter((column) => column.isFiltered)
      .map((column) => {
        return column.filterConfig;
      });
  }, [columns]);

  const defaultFilters = useMemo(
    () => Object.assign({}, ...filteredFilters),
    [filteredFilters]
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [updatedFilterStateLocalStorage, setUpdatedFilterStateLocalStorage] =
    useLocalStorage<{
      lastTouched: string;
      sfp: DataTableStateEvent | null | undefined;
    } | null>(`sfp:${SFP_VERSION}:${match.routeId}`, null);

  const [containsImageColumn, setContainsImageColumn] = useState(false);
  const {
    searchThumbnailSize,
    setSearchThumbnailSize,
    allThumbnailSizeOptions,
    setAllThumbnailSizeOptions
  } = useSearchThumbnailSize();

  useEffect(()=>{
    setAllThumbnailSizeOptions([
      {value: '25', label: 'x-small'},
      {value: '50', label: 'small'},
      {value: '75', label: 'medium'},
      {value: '100', label: 'large'},
      {value: '200', label: 'x-large'},
    ]);
  }, [setAllThumbnailSizeOptions]);
  useEffect(() => {
    columns
      .filter((column) => column.customFilter)
      .map((column) => {
        if (
          column.customFilter &&
          column.customFilter.filterName &&
          column.customFilter.filterMethod
        ) {
          FilterService.register(
            column.customFilter.filterName,
            column.customFilter.filterMethod
          );
        }
      });
    const imageColumn = columns.find((column) => {
      if(['event_logo', 'media'].includes(column.field)){
        return column;
      }
    });
    if(imageColumn){
      setContainsImageColumn(true);
    }
    else {
      setContainsImageColumn(false);
    }
  }, [columns]);

  const handleFilterChange = useCallback(
    (event: DataTableStateEvent) => {
      const wrappedMeta = wrapFilterMeta(event);
      setUpdatedFilterStateLocalStorage(() => {
        const state = {
          ...wrappedMeta
        };
        return state;
      });
      setFilters(event.filters);
      navigate({
        replace: true,
        search: { ...wrappedMeta },
      } as NavigateOptions);
    }, [setUpdatedFilterStateLocalStorage, navigate]
  );

  const clearFilter = useCallback(() => {
    setFilters({});
    setUpdatedFilterStateLocalStorage({
      lastTouched: format(new Date(), "full"),
      sfp: undefined,
    });
    navigate({
      replace: true,
      search: {},
    } as NavigateOptions);
  }, [setUpdatedFilterStateLocalStorage, navigate]);

  const [hasParams] = useState(Object.keys(queryParams).length !== 0);
  useEffect(() => {
    if (hasParams) {
      setFilters(queryParams?.sfp?.filters as DataTableFilterMeta);
      setUpdatedFilterStateLocalStorage((prev) => {
        const data = queryParams?.sfp;
        return wrapFilterMeta({ ...prev, ...data });
      });
    }
    else if (updatedFilterStateLocalStorage?.sfp && !hasParams) {
      setFilters(updatedFilterStateLocalStorage.sfp.filters);
    }
    else {
      setFilters(defaultFilters);
    }
  }, [queryParams, hasParams, defaultFilters, updatedFilterStateLocalStorage, setUpdatedFilterStateLocalStorage]);

  const { height } = useWindowSize();
  const debounceHeight = useThrottle(height, 16);
  const [scrollerOptions, setScrollerOptions] = useState<VirtualScrollerProps | undefined>(virtualScrollerOptions);
  const [overflowHeight, setOverflowHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (debounceHeight && debounceHeight > 800) {
      setScrollerOptions(virtualScrollerOptions);
      setOverflowHeight("calc(" + 100 + "dvh - " + yOffset + "px)");
    }
    else {
      setScrollerOptions(undefined);
      setOverflowHeight(undefined);
    }
  }, [
    debounceHeight,
    virtualScrollerOptions,
    yOffset,
    setScrollerOptions,
    setOverflowHeight,
  ]);

  const rowsPerPageOptions = useMemo(() => [50, 100, 1000, 3000], []);
  const paginatorTemplate = dataTablePaginator({
    rowsPerPageOptions,
  });

  const matchesMobile = useMediaQuery('(max-width: 768px)');

  return (
    <DataTable
      onFilter={handleFilterChange}
      onSort={handleFilterChange}
      dataKey="id"
      value={rows}
      tableStyle={tableStyle}
      size="small"
      emptyMessage="No Results Found"
      showGridlines={false}
      reorderableColumns={true}
      reorderableRows={false}
      stripedRows={true}
      removableSort
      sortMode={sortMode}
      scrollable={!matchesMobile}
      scrollHeight={!matchesMobile ? overflowHeight : undefined}
      virtualScrollerOptions={!matchesMobile ? scrollerOptions: undefined}
      header={
        <RenderHeader
          bulkActionButtons={bulkActionButtons}
          clearFilter={clearFilter}
          xOffset={xOffset}
        />
      }
      filters={filters}
      multiSortMeta={updatedFilterStateLocalStorage?.sfp?.multiSortMeta}
      filterDisplay="row"
      onSelectionChange={onSelectionChange}
      selection={selection}
      selectionMode={selectionMode}
      rows={rowsPerPageOptions[0]}
      rowsPerPageOptions={rowsPerPageOptions}
      paginator={true}
      paginatorTemplate={paginatorTemplate}
      currentPageReportTemplate={"{first} to {last} of {totalRecords}"}
      paginatorLeft={
        containsImageColumn ?
        <Flex direction="row" gap="xs">
          <IconPhoto size={35}/>
          <Select
            defaultValue="50"
            value={searchThumbnailSize?.value}
            data={allThumbnailSizeOptions}
            onChange={(selectedValue) => {
              const selectedOption = allThumbnailSizeOptions?.find((option) => option.value === selectedValue);
              setSearchThumbnailSize(selectedOption);
            }}
            maw={100}
          />
        </Flex> :
        <Space w={135} />
      }
      paginatorRight={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            width: "135px",
          }}
        >
          <ExportToCSVButton tableRef={dt} />
        </div>
      }
      ref={dt}
    >
      {selectionMode === "multiple" && (
        <Column selectionMode="multiple" style={{ width: "3em" }} />
      )}
      {columns
        .filter((column) => !column.isHidden)
        .map((column) => {
          return column.column;
        })}
    </DataTable>
  );
};
