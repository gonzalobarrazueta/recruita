import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-cta-button',
  imports: [],
  templateUrl: './cta-button.html',
  styleUrl: './cta-button.scss'
})
export class CtaButton {
  @Input() text: string = '';
  @Input() type: string = 'submit';
  @Input() isDisabled: boolean = false;
  @Output() clickEvent = new EventEmitter<void>();

  constructor() {
  }

  onClick(): void {
    if (!this.isDisabled) {
      this.clickEvent.emit();
    }
  }
}
