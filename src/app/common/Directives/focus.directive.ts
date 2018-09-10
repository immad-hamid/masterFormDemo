import { Directive, EventEmitter, Input, Inject, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[Focus]'
})
export class FocusDirective {
  @Input('focus') focusEvent: EventEmitter<boolean>;
  constructor(public renderer: Renderer, public elementRef: ElementRef) { }
  setFocus(id: string) {   
  //  debugger
    if (this.elementRef.nativeElement.name === id) {
      console.log(`Setting focus on '${id}'...`);
      this.renderer.invokeElementMethod(
        this.elementRef.nativeElement,
        'focus',
        []
      );
    }
  }
}
