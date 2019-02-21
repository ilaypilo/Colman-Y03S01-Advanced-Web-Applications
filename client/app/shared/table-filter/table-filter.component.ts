import {Injectable, Component} from '@angular/core';

@Injectable()

@Component({
  selector: 'app-table-filter',
})
export class TableFilter {

  public static createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      let flag = true;
      Object.keys(searchTerms).forEach(function(key) {
        if (searchTerms[key] !== '') {
          if (!data[key] || data[key].toString().indexOf(searchTerms[key]) === -1) {
            flag = false;
          }
        } 
      })
      return flag;
    }
    return filterFunction;
  }
}
