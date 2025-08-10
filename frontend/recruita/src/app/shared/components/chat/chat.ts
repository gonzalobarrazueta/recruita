import {Component, ElementRef, input, ViewChild} from '@angular/core';
import {Message, Sender} from '../../../models/message';
import {Agent} from '../../services/agent';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JobPosting} from '../../../models/job-posting';
import {Jobs} from '../../services/jobs';
import {CurriculumVitae} from '../../services/curriculum-vitae';
import {Auth} from '../../../features/auth/services/auth';
import {Conversation} from '../../../models/conversation';
import {User} from '../../../features/auth/models/user';
import {ConversationMessages} from '../../services/conversation-messages';
import {filter, of, switchMap, take} from 'rxjs';
import {MarkdownPipe} from '../../../pipes/markdown-pipe';

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule,
    MarkdownPipe
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {

  id = input.required<string>(); // gets the value from the path parameter
  jobPosting: JobPosting = <JobPosting>{};
  conversation: Conversation = <Conversation>{};
  currentUser: User = <User>{};
  chatForm!: FormGroup;
  messages: Message[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  waitingForAgentResponse: boolean = false;
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder, private agentService: Agent, private jobsService: Jobs,
              private authService: Auth,
              private CVService: CurriculumVitae,
              private conversationMessagesService: ConversationMessages) {
    this.chatForm = this.formBuilder.group({
      userInput: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.pipe(
      filter(user => !!user),
      take(1),
      switchMap(user => {
        this.currentUser = user;

        if (this.id()) {
          return this.jobsService.getJobById(this.id() as string).pipe(
            switchMap(data => {
              this.jobPosting = data[0];

              return this.conversationMessagesService.getConversation(
                this.currentUser.id,
                this.jobPosting.id
              );
            })
          );
        } else {
          // skip conversation call
          return of(null);
        }
      })
    ).subscribe({
      next: (data: any) => {
        if (data) {
          this.conversation = data;
        }
      },
      error: (err) => console.error('Error:', err)
    });
  }

  sendMessage() {
    let userInput: string = this.chatForm.get('userInput')?.value;

    if (this.selectedFile) {
      this.CVService.uploadCV(this.selectedFile, this.currentUser.id)
        .subscribe(
          {
            next: (data) => console.log(data),
            error: (e) => console.error('Error uploading file:', e)
          }
        );
    }

    this.selectedFile = null; // Reset the selected file after sending

    let user_message: Message = {
      userId: this.currentUser.id,
      content: userInput,
      conversationId: this.conversation.id,
      sender: Sender.USER
    };
    this.messages.push(user_message);

    this.conversationMessagesService
      .createMessage(user_message)
      .subscribe({
        next: () => {
          console.log("Message sent successfully");
        },
        error: (err) => {
          console.error("Error sending message:", err);
        }
      });

    this.scrollToBottom();
    this.waitingForAgentResponse = true;

    // Asks agent
    let jobInformation: string = JSON.stringify({
      title: this.jobPosting.title,
      description: this.jobPosting.fullDescription,
      requirements: this.jobPosting.requirements
    });

    this.agentService.askAgent(
      user_message.content,
      jobInformation,
      this.conversation.id
    )
      .subscribe(data => {
        let ai_message: Message = {
          userId: this.currentUser.id,
          content: data.response,
          conversationId: this.conversation.id,
          sender: Sender.AI
        }
        this.messages.push(ai_message);
        this.conversationMessagesService.createMessage(ai_message);

        this.waitingForAgentResponse = false;
      })

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
