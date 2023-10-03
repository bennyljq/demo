import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent {

  constructor(private router: Router){}
  
  async goHome() {
    this.router.navigate(['/main']);
  }

}
