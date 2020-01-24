export const NUMBER_DELTA = 1000;
export const CURRENCT_PREFIX = 'LKR';

export interface IPaginatedResult {
  result: any[];
  paginator: {
    count: number;
  };
}
