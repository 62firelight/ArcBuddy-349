import { Pipe, PipeTransform } from '@angular/core';
/*
 * Shows the display value of a Destiny stat object
 * Usage:
 *   value | destinyStat
 * Example:
 *   If a player has 450 kills, 
 *   and "stat" is a Destiny stat object, then
 *   {{ stat | destinyStat }}
 *   formats to: 450
*/
@Pipe({
  name: 'destinyStat'
})
export class DestinyStatPipe implements PipeTransform {

  transform(value: any): string {
    return value.basic.displayValue;
  }

}
