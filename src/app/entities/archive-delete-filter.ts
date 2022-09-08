import { HydrusFile } from './hydrus-file';
export class UserFiles {
    constructor(){
        this.archive = [];
        this.skipped = [];
        this.delete = [];
    }
    archive: HydrusFile[];
    skipped: HydrusFile[];
    delete: HydrusFile[];
}