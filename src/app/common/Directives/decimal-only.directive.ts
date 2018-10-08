import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[DecimalOnly]'
})
export class DecimalOnlyDirective {
// Allow decimal numbers and negative values
private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
// Allow key codes for special events. Reflect :
// Backspace, tab, end, home
//private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];

private specialKeys: Array<any> = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
  constructor(private el: ElementRef) { }
  @HostListener('keydown', [ '$event' ])
        onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
          if (this.specialKeys.indexOf(event.keyCode) !== -1 ||
          // to allow backspace, enter, escape, arrows  
          (event.which == 65 && event.ctrlKey == true) ||
          // Allow: Ctrl+C        
          (event.which == 67 && event.ctrlKey == true) ||
          // Allow: Ctrl+X
          (event.which == 88 && event.ctrlKey == true) ||
         // Allow: Ctrl+V
          (event.keyCode === 86 && (event.ctrlKey || event.metaKey)))  {
            return;
          }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
          if (next && !String(next).match(this.regex)) {
            event.preventDefault();
          }
      }
}