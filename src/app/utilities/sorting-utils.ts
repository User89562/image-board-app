
enum SORT_TYPES {
    fileSize= 'File Size',
    duration = 'Duration',
    importTime = 'Import Time',
    random = 'Random',
    lastViewedTime = 'Last Viewed Time',
    archiveTimestamp = 'Archive Timestamp'
}


export class SortingUtils {
    static sortTypeMap = new Map<string, number>([
        [SORT_TYPES.fileSize, 0],
        [SORT_TYPES.duration, 1],
        [SORT_TYPES.importTime, 2],
        [SORT_TYPES.random, 4],
        [SORT_TYPES.lastViewedTime, 18],
        [SORT_TYPES.archiveTimestamp, 19],
    ]);

    public static get getSortTypeArray(): string[] {
        return Object.values(SORT_TYPES);
    }
    public static get sortTypes(): typeof SORT_TYPES {
        return SORT_TYPES;
      }

    public static findSortTypeInt(sort: string): number | undefined {
        return this.sortTypeMap.get(sort);
    }

    public static getByValue(searchValue: number): string {
        for (let [key, value] of SortingUtils.sortTypeMap.entries()) {
          if (value === searchValue)
            return key;
        }
        return '';

    }
}