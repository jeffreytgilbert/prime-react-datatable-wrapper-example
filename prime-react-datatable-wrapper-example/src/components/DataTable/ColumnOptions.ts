
type CustomNumberFilterObject = {
  filterName: string;
  filterMethod: (value: number, filters: number[]) => boolean;
};

type FilterType = {
  value: string | null,
  matchMode: string
};

export type CurrentRow = {
  [key: string]: unknown;
};

export type NavigateOptionProps = {
  to: string;
  params: Record<string, string>;
};

export type RequireLinkRoute = {
  link: NavigateOptionProps;
};

export type OptionalLinkRoute = {
  link?: NavigateOptionProps;
};

export type FilterConfig = {
  [key: string]: FilterType;
};

export type ColumnOptions = {
  field: string;
  header: string;
  style?: object;
  isUnsortable?: boolean;
  isFiltered?: boolean;
  isHidden?: boolean;
  isFrozen?: boolean;
  customFilter?: CustomNumberFilterObject;
  filterConfig?: FilterConfig;
  column?: JSX.Element;
};

export type ColumnProps = {
  field: string;
  header: string;
  style?: object;
  isUnsortable: boolean;
  isFiltered: boolean;
  isHidden: boolean;
  isFrozen: boolean;
  customFilter?: CustomNumberFilterObject;
  filterConfig: FilterConfig;
  column: JSX.Element;
  data: object[];
};