import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePlayed'
})
export class TimePlayedPipe implements PipeTransform {

  transform(value: number): number {
    value /= 3600;

    value = Math.floor(value);

    return value;
  }

}
