import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorJPIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'ページに項目';
  override nextPageLabel     = '次のページ';
  override previousPageLabel = '前のページ';
  override firstPageLabel = '先頭ページ';
  override lastPageLabel = '最後のページ';

  override getRangeLabel = function (page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return '0 から ' + length;
    }
    length = Math.max(length, 0);
    
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' から ' + length;
  };
}