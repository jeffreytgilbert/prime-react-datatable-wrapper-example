import { Button, NativeSelect, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  PaginatorNextPageLinkOptions,
  PaginatorPrevPageLinkOptions,
  PaginatorTemplateOptions,
} from "primereact/paginator";

type DataTablePaginatorProps = {
  rowsPerPageOptions: number[];
};

function dataTablePaginator({ rowsPerPageOptions }: DataTablePaginatorProps) {
  const paginatorTemplate: PaginatorTemplateOptions = {
    layout:
      "RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport",
    RowsPerPageDropdown: (options) => {
      // console.log(options, options.props.totalPages, options.props.page, options.props.totalRecords);
      // @ts-expect-error: The documentation and ts types are not correct. Total pages only populates on the props for this function
      const totalPages = options.totalPages || options.props.totalPages;
      if (totalPages < 2) return;
      return (
        <NativeSelect
          variant="unstyled"
          data={rowsPerPageOptions.map((option) => ({
            value: "" + option,
            label: option + " rows per page",
          }))}
          value={"" + options.value}
          onChange={(evt) =>
            options.onChange({
              value: evt.currentTarget.value,
              originalEvent: evt,
              target: {
                name: evt.currentTarget.name,
                id: evt.currentTarget.id,
                value: evt.currentTarget.value,
              },
              preventDefault: evt.preventDefault,
              stopPropagation: evt.stopPropagation,
            })
          }
          size="xs"
          radius="xs"
        />
      );
    },
    PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
      // console.log(options, options.props.totalPages, options.props.page, options.props.totalRecords);
      // @ts-expect-error: The documentation and ts types are not correct. Total pages only populates on the props for this function
      const totalPages = options.totalPages || options.props.totalPages;
      if (totalPages < 2) return;
      return (
        <Button
          onClick={options.onClick}
          disabled={options.disabled}
          variant="light"
          size="xs"
          radius="xl"
          m="0 3px"
        >
          <IconChevronLeft size={16} />
        </Button>
      );
    },
    NextPageLink: (options: PaginatorNextPageLinkOptions) => {
      // console.log(options, options.props.totalPages, options.props.page, options.props.totalRecords);
      // @ts-expect-error: The documentation and ts types are not correct. Total pages only populates on the props for this function
      const totalPages = options.totalPages || options.props.totalPages;
      if (totalPages < 2) return;
      return (
        <Button
          onClick={options.onClick}
          disabled={options.disabled}
          variant="light"
          size="xs"
          radius="xl"
          m="0 3px"
        >
          <IconChevronRight size={16} />
        </Button>
      );
    },
    PageLinks: (options) => {
      // @ts-expect-error: The documentation and ts types are not correct. Total pages only populates on the props for this function
      const totalPages = options.totalPages || options.props.totalPages;
      if (totalPages < 2) return;
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        return (
          <span
            style={{
              userSelect: "none",
              cursor: "not-allowed",
              padding: "0.5rem 0.75rem",
              opacity: 0.5,
            }}
          >
            &hellip;
          </span>
        );
      }
      return (
        <Button
          onClick={options.onClick}
          variant={options.currentPage === options.page ? "light" : "subtle"}
          disabled={options.currentPage === options.page}
          size="xs"
          radius="xl"
          m="0 3px"
        >
          {options.page + 1}
        </Button>
      );
    },
    CurrentPageReport: (options) => {
      if (options.totalPages < 2)
        return (
          <Text
            style={{
              userSelect: "none",
              opacity: 0.5,
            }}
            p="0.5rem 0.75rem"
            size="xs"
            m="0 3px"
          >
            Total Records: {options.totalRecords}
          </Text>
        );
      return (
        <Text
          style={{
            userSelect: "none",
            opacity: 0.5,
          }}
          p="0.5rem 0.75rem"
          size="xs"
          m="0 3px"
        >
          page {options.currentPage} of {options.totalPages}
        </Text>
      );
    },
  };
  return paginatorTemplate;
}

export { dataTablePaginator };
