import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterById'
})
export class FilterByIdPipe implements PipeTransform {
 
  transform(items: any[], id?: string): any {
    return items.find(item => item.id === id);
  }

}