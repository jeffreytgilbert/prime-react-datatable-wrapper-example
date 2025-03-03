import { SearchThumbnailSizeContext } from "./context"
import { SelectOption } from "../../schemas/models/SelectOption";
import { useState } from "react";

export const SearchThumbnailSizeProvider: React.FC<React.PropsWithChildren> = ({children})=>{
  const [ searchThumbnailSize, setSearchThumbnailSize ] = useState<SelectOption | undefined>(undefined);
  const [ allThumbnailSizeOptions, setAllThumbnailSizeOptions ] = useState<SelectOption[] | undefined>(undefined);

  const values = {
    searchThumbnailSize,
    setSearchThumbnailSize,
    allThumbnailSizeOptions,
    setAllThumbnailSizeOptions,
  }

  return <SearchThumbnailSizeContext.Provider value={values}>{children}</SearchThumbnailSizeContext.Provider>
}