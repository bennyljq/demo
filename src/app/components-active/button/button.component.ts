import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() text: string = "Button Text"
  @Input() size: "small" | "medium" | "large" = "medium"
  @Input() type: "primary" | "secondary" | "tertiary" | "minimal" | "important" | "importantAlt" = "primary"

  buttonStyle: any = {}
  flat: boolean | undefined;
  blue = "DodgerBlue"
  orange = "Tomato"
  grey = "DarkGray"

  ngOnInit(): void {
    this.refresh()
  }
  ngOnChanges(): void {
    this.refresh()
  }
  refresh() {
    this.flat = ['primary', 'important', 'minimal'].includes(this.type)
    switch(this.size) {
      case 'small':
        this.buttonStyle["font-size"] = "12px"
        this.buttonStyle["height"] = "24px"
        this.buttonStyle["line-height"] = "24px"
        break
      case 'medium':
        this.buttonStyle["font-size"] = "16px"
        this.buttonStyle["height"] = "36px"
        this.buttonStyle["line-height"] = "36px"
        break
      case 'large':
        this.buttonStyle["font-size"] = "20px"
        this.buttonStyle["height"] = "48px"
        this.buttonStyle["line-height"] = "48px"
        break
    }
    switch(this.type) {
      case 'primary':
        this.buttonStyle["background-color"] = this.blue
        this.buttonStyle["color"] = "white"
        break
      case 'secondary':
        this.buttonStyle["border"] = `1px solid ${this.blue}`
        this.buttonStyle["color"] = this.blue
        break
      case 'tertiary':
        break
      case 'minimal':
        this.buttonStyle["color"] = this.blue
        break
      case 'important':
        this.buttonStyle["background-color"] = this.orange
        this.buttonStyle["color"] = "white"
        break
      case 'importantAlt':
        this.buttonStyle["border"] = `1px solid ${this.orange}`
        this.buttonStyle["color"] = this.orange
        break
    }
  }

  

}
