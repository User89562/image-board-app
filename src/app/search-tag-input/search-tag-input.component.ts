import { FileService } from './../services/file.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {  MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { TagUtils } from '../utilities/tag-utils';
import { SortingUtils } from '../utilities/sorting-utils';

@Component({
  selector: 'app-search-tag-input',
  templateUrl: './search-tag-input.component.html',
  styleUrls: ['./search-tag-input.component.scss']
})
//TODO: sortType and sortDir as output-event emitters
export class SearchTagInputComponent implements OnInit {
  sortTypes: string [];
  selectedSort: string | undefined;
  sortTypeNum: number | undefined; 
  selectedDir: boolean;
  searchTags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  tagUtils = TagUtils;
  sortingUtils = SortingUtils;

  tagCtrl = new FormControl();
  //filteredTags: Observable<string[]>;

  @Output() tags = new EventEmitter<string[]>();
  @Output() sortType = new EventEmitter<number>();
  @Output() sortDir = new EventEmitter<boolean>();
  @Input() initalTags?: string[];
  @Input() initalSortType?: number;
  @Input() initalSortDir?: boolean;

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  //@ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(public fileService: FileService) {
    this.sortTypes = this.sortingUtils.getSortTypeArray;
    this.selectedSort = this.sortingUtils.sortTypes.importTime;
    this.sortTypeNum = this.sortingUtils.findSortTypeInt(this.sortingUtils.sortTypes.importTime);
    this.selectedDir = false;
    
    
    /*
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((tag: string) => this._filter(tag))
    );*/
   }

  ngOnInit() {
    if (this.initalTags) {
      this.searchTags = this.initalTags;
      this.tags.emit(this.searchTags);
    }
    if (this.initalSortType) {
      this.sortTypeNum = this.initalSortType;
      this.selectedSort = this.sortingUtils.getByValue(this.initalSortType);
    }
    if (this.initalSortDir) {
      this.selectedDir = this.initalSortDir;
    }
  }

  chipInputEvent(event: MatChipInputEvent): void {
    /*
    if(this.matAutocomplete.isOpen && this.matAutocomplete.options.some(x => x.active)) {
      return;
    }*/

    const input = event.chipInput.inputElement;
    const value = event.value.toLowerCase(); // Hydrus tags are always lowercase

    this.addSearchTag(value);

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  addSearchTag(tag: string) {
    const value = tag.toLowerCase();
    if ((value || '').trim()) {
      this.searchTags.push(value);
    }

    this.tags.emit(this.searchTags);
  }


  removeSearchTag(tag: string): void {
    const index = this.searchTags.indexOf(tag);

    if (index >= 0) {
      this.searchTags.splice(index, 1);
    }

    this.tags.emit(this.searchTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addSearchTag(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

/*
  private _filter(value: string): string[] {
    let filterValue = value ? value.toLowerCase() : '';
    const isNegated = filterValue.startsWith('-');
    if (isNegated) {
      filterValue = filterValue.substring(1);
    }

    let results = Array.from(this.filesService.getKnownTags())
      .filter(tag => tag.toLowerCase().indexOf(filterValue) !== -1)
      .filter(tag => !this.searchTags.includes(tag)).slice(0, 25);

    if (isNegated) {
      results = results.map(t => `-${t}`);
    }

    return results;
  }*/

  sortSelectionChange(event: any): void {
    if (event.isUserInput) {
      this.sortType.emit(this.sortingUtils.findSortTypeInt(event.source.value));
    }
  }

  changeSortDirection(event: any): void {
      this.selectedDir =!this.selectedDir;
      this.sortDir.emit(this.selectedDir);
  }

}
