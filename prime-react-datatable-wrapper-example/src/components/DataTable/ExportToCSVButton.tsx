import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { DataTable } from "primereact/datatable";
import { useCallback } from "react";

type ExportToCSVButtonProps = {
  tableRef: React.MutableRefObject<DataTable<object[]> | null>,
};

function ExportToCSVButton({
  tableRef,
}: ExportToCSVButtonProps) {

  const exportCSV = useCallback(() => {
    if(!tableRef.current) return;
    tableRef.current.exportCSV({
      selectionOnly: false
    });
  }, [tableRef]);

  return (
    <Button
      onClick={exportCSV}
      rightSection={<IconDownload size={16} />}
      variant="subtle"
      size="xs"
    >CSV</Button>
  );
}

export default ExportToCSVButton;