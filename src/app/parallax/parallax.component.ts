import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'app-parallax',
    templateUrl: './parallax.component.html',
    styleUrls: ['./parallax.component.scss'],
    standalone: false
})
export class ParallaxComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  scrollPosition = 0;

  ngAfterViewInit(): void {
    // Listen to the scroll event on the specific div
    this.scrollContainer.nativeElement.addEventListener('scroll', this.onDivScroll);
  }

  // Function to dynamically adjust background position based on scroll and speed factor
  backgroundPosition(speedFactor: number): string {
    return `${this.scrollPosition * speedFactor}px`;
  }

  onDivScroll = (): void => {
    // Get the current scroll position of the div
    this.scrollPosition = this.scrollContainer.nativeElement.scrollTop;
  };
}