import { Component } from '@angular/core';
import { Message } from '../../../models/message';
import {Agent} from '../../services/agent';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {

  chatForm!: FormGroup;
  messages: Message[] = [];

  constructor(private formBuilder: FormBuilder, private agentService: Agent) {
    this.chatForm = this.formBuilder.group({
      userInput: ['', Validators.required]
    });
  }

  sendMessage() {
    let userInput: string = this.chatForm.get('userInput')?.value;

    if (userInput) {
      this.agentService.sendMessage(userInput)
        .subscribe(response => {
          console.log(response);
        })
    }

    this.chatForm.reset();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      console.log(input.files[0])
    }
  }
}
