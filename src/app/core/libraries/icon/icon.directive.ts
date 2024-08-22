import { Directive, HostBinding, Renderer2, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { IconLibrarie } from './icon.librarie';

@Directive({
	selector: '[nameIcon]'
})

export class IconDirective implements OnInit, OnChanges {
	@Input() nameIcon!: string;
	
	private iconDef: any;
	private prevClasses! : string[];


	@HostBinding('innerHtml')
	html: SafeHtml = '';
	
	constructor(
		private elementRef: ElementRef,
		private domSanitizer: DomSanitizer,
		private iconLibrarie: IconLibrarie,
		private renderer: Renderer2,
	) { }
	
	ngOnInit() {
		this.iconDef = this.renderIcon(this.nameIcon);
	}
	
	ngOnChanges() {
		if (this.iconDef) {
			this.iconDef = this.renderIcon(this.nameIcon);
		}
	}
	
	renderIcon(nameIcon: string = 'default') {
		// const content: keyof IconLibrarie = this.iconLibrarie;
		const content = this.iconLibrarie.iconPack[nameIcon as keyof typeof this.iconLibrarie.iconPack];
		let cont = String(content);
		
		if (cont) {
			this.html = this.domSanitizer.bypassSecurityTrustHtml(cont);
		}
		this.assignClasses([nameIcon, 'ita-icon']);
		return nameIcon;
	}
	
	private assignClasses(classes: string[]) {
		// this.prevClasses.forEach((className: string) => {
		// 	this.renderer.removeClass(this.elementRef.nativeElement, className);
		// });

		// classes.forEach((className: string) => {
		// 	this.renderer.addClass(this.elementRef.nativeElement, className);
		// });

		this.prevClasses = classes;
	}
}