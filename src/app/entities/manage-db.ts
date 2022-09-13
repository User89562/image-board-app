export interface Boned {
    boned_stats: BonedStats;
}

export interface BonedStats {
    num_inbox: number;
    num_archive: number;
    num_deleted: number;
    size_inbox: number;
    size_deleted: number;
    earliest_import_time: number;
    total_viewTime: number[];
    total_alternate_files: number;
    total_duplicate_files: number;
    total_potential_pairs: number;

}