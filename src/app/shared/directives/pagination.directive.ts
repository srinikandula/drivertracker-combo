import { Directive } from '@angular/core';

@Directive({
  selector: '[appPagination]',
})
export class PaginationDirective {
  constructor() {}

  static pagination(res: any, data: any): void {
    let count,
      add,
      total = 0,
      size = 0;
    count = res;
    if (data.pageSizes.length === 0) {
      if (count >= 50) {
        data.pageSizes.push(50);
        if (data.size !== 50) {
          data.pageSizes.push(data.size);
        }
      }
      for (let i = 0; i < 4; i++) {
        add = Math.ceil((50 + count) / 50);
        add = Math.ceil(add / 50) * 20;
        total = total + add;
        if (total >= count) {
          break;
        } else {
          data.pageSizes.push(total);
        }
      }
      data.pageSizes.push(count);
    } else {
      data.pageSizes = [];
      if (count >= 50) {
        data.pageSizes.push(50);
        if (data.size !== 50) {
          data.pageSizes.push(data.size);
        }
      }
      for (let i = 0; i < 4; i++) {
        add = Math.ceil((50 + count) / 50);
        add = Math.ceil(add / 50) * 20;
        total = total + add;
        if (total >= count) {
          break;
        } else {
          data.pageSizes.push(total);
        }
      }
      data.pageSizes.push(count);
    }
    data.pageSizes = [...new Set(data.pageSizes)];
    data.pageSizes.sort((a: number, b: number) => a - b);
    size = data.pageSizes.length;
  }
}
