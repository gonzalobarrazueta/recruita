import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { Message, Sender } from '../../../models/message';
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
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  waitingForAgentResponse: boolean = false;
  selectedFile: File | null = null;

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

    if (this.selectedFile) {
      this.selectedFile = null; // Reset the selected file after sending
    }

    this.messages.push({
      id: '',
      userId: '',
      content: userInput,
      conversationId: '',
      created_at: '',
      sender: Sender.USER
    });

    this.scrollToBottom();
    this.waitingForAgentResponse = true;

    if (userInput) {
      this.agentService.sendMessage(userInput)
        .subscribe(data => {
          this.messages.push({
            id: '',
            userId: '',
            content: data.response,
            conversationId: '',
            created_at: '',
            sender: Sender.AI
          });

          this.waitingForAgentResponse = false;

        })
    }

    this.chatForm.reset();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(input.files[0])
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    });
  }
}
