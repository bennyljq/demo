import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage-v2',
  templateUrl: './homepage-v2.component.html',
  styleUrls: ['./homepage-v2.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageV2Component {

  constructor(
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Benny's Site");
  }

  name = "Benny";
  descLine1 = ["Physicist", "Mathematician"];
  descLine2 = ["Software Engineer", "Web Developer"];
  descLine3 = ["Data Scientist", "Pianist", "Godfather", "Baker", "Gamer"];
  
  contentClass: string = '';

  goToRoute(route: string) {
    this.contentClass = "fade-out-left";
    setTimeout(() => {
      this.router.navigate([`/${route}`]);
    }, 666);
  }
}