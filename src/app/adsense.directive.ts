import { Directive, ElementRef, NgZone, OnInit } from '@angular/core';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Directive({
  selector: '[appAdsense]'
})
export class AdsenseDirective implements OnInit {

  constructor(private el: ElementRef, private zone: NgZone) { }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }
}
