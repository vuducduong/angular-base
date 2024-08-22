import {Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatCheckbox} from "@angular/material/checkbox";


@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {
  dataRef: any;
  searchForm: FormGroup;
  dataSearch: any[] = [];
  dataChecked = [];
  isDisabled = false;
  isCheckedAll: boolean = false;
  dataCheckedOld: string[] = [];
  dataListSearch: string[] = [];
  queryOld: Object = {};
  checkClickSearch: boolean = false;
  dataAll = [];

  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  constructor(
    public _dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) {
    this.dataRef = data;
    this.searchForm = this._formBuilder.group({
      column: [''],
      sort: [''],
      search: ['', [Validators.maxLength(50)]],
      search_list: [''],
      checked_all: ['']
    });
  }

  async ngOnInit() {
   

  }

  closeDialog(): void {
    this._dialogRef.close();
  }

  setValueChecked(): void {

  }

  saveSearch(): void {
  }

  sortDate(e: any): void {

  }

  async searchList() {

  }

  isChecked(value: any): boolean {
    return this.dataCheckedOld.indexOf(value.toString()) !== -1 || this.dataListSearch.indexOf(value.toString()) !== -1;
  }

  selectAll(event: any): void {
   
  }

}
