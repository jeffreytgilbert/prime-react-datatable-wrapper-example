import { Column } from "primereact/column";
import { ColumnOptions, ColumnProps, CurrentRow, FilterConfig, OptionalLinkRoute } from "../ColumnOptions";
import { Media } from "../../../schemas/models/Media";
import { Flex, Popover, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import ImageInRoundedBox from "../../ImageInRoundedBox";

type ObjectWithAppMedia = {
  id: number
  user_id: number,
  media: Media[],
};

type AppMediaBodyDataType = {
  data: ObjectWithAppMedia[];
};

type RequireThumbnailSize = {
  thumbnailSize: number;
};

type AppMediaBodyOptions = RequireThumbnailSize & AppMediaBodyDataType & OptionalLinkRoute & ColumnOptions;

function AppMediaWithPopover({ media, thumbnailSize }: { media: Media, thumbnailSize: number }) {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover width={300} position="right" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <UnstyledButton onMouseEnter={open} onMouseLeave={close}>
          <ImageInRoundedBox
            alt={media.ai_name}
            uuid={media.uuid}
            edits={media.edits}
            size={thumbnailSize}
          />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown w="max-content">
        <div style={{ textAlign: "center", whiteSpace: 'normal' }}>
          <div style={{ maxWidth: 300+'px', lineHeight: '30px', fontSize: '14px' }}>
            {media.ai_category_name ? media.ai_category_name + ' - ' + media.ai_name : media.ai_name}
          </div>
          <div style={{ minWidth: 300+'px', margin: '0 auto' }}>
            <ImageInRoundedBox
              alt={media.ai_name}
              uuid={media.uuid}
              edits={media.edits}
              size={300}
            />
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

function AppMediaBody(columnOptions: AppMediaBodyOptions) {
  const navigate = useNavigate();
  return (currentRow: ObjectWithAppMedia & CurrentRow) => {
    const thumbnailSize = columnOptions.thumbnailSize || 50;
    const thumbnails = currentRow.media && currentRow.media.filter(media => !+media.detail_of_id).map((media: Media) => {
      return (
        <div key={'app-thumbnail-'+'app-'+currentRow.id+'-'+ media.id}>
          <AppMediaWithPopover media={media} thumbnailSize={thumbnailSize} />
        </div>
      );
    });
    return (
      <Flex mih={thumbnailSize} gap="xs" direction="row" wrap="nowrap" onClick={()=>{
        const to = columnOptions.link?.to ? columnOptions.link.to : '/account/applications/$applicationId';
        let params;
        if(columnOptions.link?.params){
          params = Object.fromEntries(Object.entries(columnOptions.link.params).map(([key, value]) => {
            return [key, currentRow[value]];
          }));
        }
        else {
          params = { applicationId: currentRow.id || 0 };
        }
        navigate({
          to: to,
          params: params,
        });
      }}>
        {thumbnails}
      </Flex>
    );
  };
}

export function AppMediaColumn(columnOptions: AppMediaBodyOptions): ColumnProps{
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
        body={AppMediaBody(columnOptions)}
        style={columnOptions.style || undefined}
        sortable={false}
        filter={false}
      />
    )
  };
}