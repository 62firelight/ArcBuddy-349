import { Pipe, PipeTransform } from '@angular/core';
/*
 * Formats camel case 
 * Usage:
 *   value | camelConverter
 * Example:
 *   {{ "camelCase" | camelConverter }}
 *   formats to: Camel Case
*/
@Pipe({ name: 'camelConverter' })
export class CamelConverterPipe implements PipeTransform {
  transform(value: string): string {
    return value
      // insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, function (str) { return str.toUpperCase(); });;
  }
}