import * as React from 'react';
import { SelectOption } from '../../schemas/models/SelectOption';

type SearchThumbnailSizeContextState = {
  searchThumbnailSize: SelectOption | undefined,
  setSearchThumbnailSize: React.Dispatch<React.SetStateAction<SelectOption | undefined>>,
  allThumbnailSizeOptions: SelectOption[] | undefined,
  setAllThumbnailSizeOptions: React.Dispatch<React.SetStateAction<SelectOption[] | undefined>>,
}

export const SearchThumbnailSizeContext = React.createContext<SearchThumbnailSizeContextState | undefined>(undefined)

export function useSearchThumbnailSize(){
  const context = React.useContext(SearchThumbnailSizeContext);
  if(typeof context === "undefined"){
    throw new Error('useSearchThumbnailSize must be within SearchThumbnailSizeProvider')
  }
  return context
}