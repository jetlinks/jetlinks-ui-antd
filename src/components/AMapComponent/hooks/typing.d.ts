interface PlaceSearchOptions {
  pageSize: number;
  pageIndex: number;
  city?: string;
  type?: string;
  extensions?: string;
}
type resultCityType = {
  name: string;
  citycode: string;
  adcode: string;
  count: string;
};

type searchFnResult = {
  info?: string;
  keywordList?: string[];
  cityList?: resultCityType[];
  poiList?: {
    pageIndex: number;
    pageSize: number;
    count: number;
    pois: any[];
  };
};

type searchFn = (status: string, result: searchFnResult) => void;

interface PlaceSearch {
  new (options: PlaceSearchOptions);
  search: (keyword: string, callback: searchFn) => void;
  searchInBounds: (keyword: string, bounds: number[], callback: searchFn) => void;
  searchNearBy: (keyword: string, center: any, radius: number) => void;
}
