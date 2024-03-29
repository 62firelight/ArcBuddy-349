import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TimePlayedPipe } from '../timePlayed/time-played.pipe';
/*
 * Shows the display value of a Destiny stat object
 * Usage:
 *   value | destinyStat
 * Example:
 *   If a player has 450 kills, 
 *   and "stat" is a Destiny stat object, then
 *   {{ stat | destinyStat }}
 *   formats to: 450
 * 
 *   There are exceptions to this, such as when
 *   the name of the stat is secondsPlayed.
 *   Check the transform() method for those
 *   exceptions.
*/
@Pipe({
  name: 'destinyStat'
})
export class DestinyStatPipe implements PipeTransform {

  transform(value: any, decimal?: boolean): string {
    if (value.statId == 'secondsPlayed') {
      value = value.basic.value;

      const timePlayedPipe = new TimePlayedPipe();
      value = timePlayedPipe.transform(value);

      return `${value} hours`;
    }

    if (decimal == true) {
      return value.basic.value;
    }

    const decimalPipe = new DecimalPipe("en-US");
    const displayValue = decimalPipe.transform(value.basic.displayValue);

    return displayValue != null ? displayValue : value.basic.displayValue;
  }

}
