import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-contents',
  templateUrl: './contact-contents.component.html',
  styleUrls: ['./contact-contents.component.scss']
})
export class ContactContentsComponent {

  download_resume() {
    // window.open("/assets/Bennys Resume - November 2023.pdf", '_blank');
    let link = document.createElement("a");
    link.download = "Benny's Resume - August 2024.pdf";
    link.href = "assets/Benny's Resume - August 2024.pdf";
    link.click();
  }

}
