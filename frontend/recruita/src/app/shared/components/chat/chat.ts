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
import {filter, of, switchMap, take, tap} from 'rxjs';
import {MarkdownPipe} from '../../../pipes/markdown-pipe';
import {Users} from '../../services/users';

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
  currentUser: User = <User>{}; // This only contains the user's id, role and token
  userData: any = null; // This contains the user data like email, phone, organization, etc.
  chatForm!: FormGroup;
  messages: Message[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  waitingForAgentResponse: boolean = false;
  selectedFile: File | null = null;
  cvContent: string = "";
  associatedRecruiter: any = null;

  constructor(private formBuilder: FormBuilder, private agentService: Agent, private jobsService: Jobs,
              private authService: Auth,
              private CVService: CurriculumVitae,
              private conversationMessagesService: ConversationMessages,
              private usersService: Users) {
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

        // fetch applicant data
        return this.usersService.getUserById(this.currentUser.id).pipe(
          tap(data => {
            this.userData = data;
          }),
          // continue with job logic
          switchMap(() => {
            if (this.id()) {
              return this.jobsService.getJobById(this.id() as string).pipe(
                switchMap(data => {
                  this.jobPosting = data[0];
                  // fetch recruiter data using the recruiter_id from the job posting
                  return this.usersService.getUserById(this.jobPosting.recruiterId).pipe(
                    tap(data => {
                      this.associatedRecruiter = data;
                    }),
                    switchMap(() =>
                      this.conversationMessagesService
                        .getConversation(
                          this.currentUser.id,
                          this.jobPosting.id
                        )
                    )
                  );
                })
              );
            } else {
              // skip conversation call
              return of(null);
            }
          })
        );
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
    let messageForAgent: string = "";

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

    let jobInformation: string = JSON.stringify({
      title: this.jobPosting.title,
      description: this.jobPosting.fullDescription,
      requirements: this.jobPosting.requirements
    });

    // Asks agent
    if (this.selectedFile) {
      this.CVService.uploadCV(this.selectedFile, this.currentUser.id, this.jobPosting.id)
        .subscribe({
          next: (data) => {
            this.cvContent = data["response"]["content"];

            messageForAgent = this.enrichMessageContent(user_message.content, this.cvContent);

            this.askAgent(messageForAgent, jobInformation, this.conversation.id);
          },
          error: (e) => {
            console.error('Error uploading CV:', e)
          }
        });
      this.selectedFile = null; // Reset the selected file after sending
    } else {
      this.askAgent(userInput, jobInformation, this.conversation.id);
    }

    this.chatForm.reset();
  }

  askAgent(message: string, jobInformation: string, conversationId: string) {
    this.agentService.askAgent(
      message,
      jobInformation,
      conversationId,
    )
      .subscribe(data => {
        this.waitingForAgentResponse = true;

        let ai_message: Message = {
          userId: this.currentUser.id,
          content: data.response,
          conversationId: this.conversation.id,
          sender: Sender.AI
        }

        this.messages.push(ai_message);
        this.conversationMessagesService.createMessage(ai_message);

        this.waitingForAgentResponse = false;
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(input.files[0])
    }
  }

  enrichMessageContent(userInput: string, cvContent: string | null): string {
    let enrichedMessage: string = `- User input: ${userInput} `;
    enrichedMessage += cvContent ? `- CV content: ${cvContent} ` : "";
    enrichedMessage += this.userData.email ? `Applicant email: ${this.userData.email} ` : "";
    enrichedMessage += this.associatedRecruiter.email ? `- Recruiter email: ${this.associatedRecruiter.email} ` : "";

    return enrichedMessage;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    });
  }
}
