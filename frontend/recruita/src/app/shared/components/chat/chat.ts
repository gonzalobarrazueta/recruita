import { Component, input } from '@angular/core';
import { Message } from '../../../models/message';
import { Agent } from '../../services/agent';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobPosting } from '../../../models/job-posting';
import { Jobs } from '../../services/jobs';

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {

  id = input.required<string>(); // gets the value from the path parameter
  jobPosting: JobPosting = <JobPosting>{};
  chatForm!: FormGroup;
  messages: Message[] = [];

  constructor(private formBuilder: FormBuilder, private agentService: Agent, private jobsService: Jobs) {
    this.chatForm = this.formBuilder.group({
      userInput: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.id()) {
      this.jobsService.getJobById(this.id() as string)
        .subscribe(data => this.jobPosting = data[0]);
    }
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
