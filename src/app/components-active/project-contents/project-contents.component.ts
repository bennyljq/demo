import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-project-contents',
    templateUrl: './project-contents.component.html',
    styleUrls: ['./project-contents.component.scss'],
    standalone: false
})
export class ProjectContentsComponent {

  innerWidth: any;
  hover1 = false;
  hover2 = false;
  hover3 = false;
  hover4 = false;
  hover5 = false;
  hover6 = false;
  hover7 = false;
  hover8 = false;
  hover9 = false;
  hover10 = false;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  go_to_link(url: string) {
    window.open(url, '_blank');
  }

  download_article() {
    // window.open("/assets/Bennys Resume - November 2023.pdf", '_blank');
    let link = document.createElement("a");
    link.download = "On the Infinitude of Twin Primes - Benny Lim.pdf";
    link.href = "assets/Benny_Twin_Prime.pdf";
    link.click();
  }
  
  showScrollButton = false;
  currentScroll = 0;
  
  onScroll(event: any) {
    this.currentScroll = event.target.scrollTop
    this.showScrollButton = this.currentScroll > 200
  }

  scrollToTop() {
    // Scroll to the top of the page
    let container = document.getElementsByClassName("history-container")[0] as HTMLElement
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
