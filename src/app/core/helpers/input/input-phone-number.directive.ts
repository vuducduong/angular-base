import { Directive, OnInit, ElementRef, HostListener, Input, HostBinding } from '@angular/core';

@Directive({
	selector: '[inputPhoneNumber]'
})

export class InputPhoneNumberDirective implements OnInit {
	
	maxLength: number = 0;
	keyCodeAllow: Array<Number> = [
		46, 8, 9, 35, 36, 37, 38, 39, 40,
		107, 187,
		48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
		96, 97, 98, 99, 100, 101, 102, 103, 104, 105
	]
	//minLength: number = 0;

	@Input() inputPhoneNumber: boolean | undefined;
	
	constructor(
		private elementRef: ElementRef
	) {
		// Defaut
		this.maxLength = 12;
		//this.minLength = 8;
	}

	@HostListener('input', ['$event']) onInput() {
		if (this.inputPhoneNumber) {
			if(this.maxLength > 0){
				const myInput = this.elementRef.nativeElement;
				const length = myInput.value ? myInput.value.length : 0;
				if (length > this.maxLength) {
					myInput.value = myInput.value.substr(0, length - 1);
				}
			}

		}
	}
	

	@HostListener('keydown', ['$event']) onKeyDown() {
		let e = <KeyboardEvent> event;
		if (this.inputPhoneNumber) {
			if (this.keyCodeAllow.indexOf(e.keyCode) !== -1 ||
				// Allow: Ctrl+A
				(e.keyCode == 65 && e.ctrlKey === true) ||
				// Allow: Ctrl+C
				(e.keyCode == 67 && e.ctrlKey === true) ||
				// Allow: Ctrl+X
				(e.keyCode == 88 && e.ctrlKey === true) ||
				// Allow: home, end, left, right
				(e.keyCode >= 35 && e.keyCode <= 39)) {
				// let it happen, don't do anything
				return;
			}else{
				e.preventDefault();
			}
		}
	}

	ngOnInit(): void {
		//if(this.minLength > 0){
		//	this.elementRef.nativeElement.minLength = this.minLength;
		//}
	}
}