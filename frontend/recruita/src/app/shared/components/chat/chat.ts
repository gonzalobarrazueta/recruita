import {Component, ElementRef, input, signal, ViewChild} from '@angular/core';
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
import {filter, firstValueFrom, of, switchMap, take, tap} from 'rxjs';
import {MarkdownPipe} from '../../../pipes/markdown-pipe';
import {Users} from '../../services/users';
import {Voice} from '../../services/voice';
import {average} from 'color.js';

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
  // For audio input
  audioFile = signal<File | null>(null);
  bars = new Array(5);
  chatGradient: string = "";

  isRecording = signal(false);
  audioUrl = signal<string | null>(null);

  // Private variables for the MediaRecorder API
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(private formBuilder: FormBuilder,
              private agentService: Agent,
              private jobsService: Jobs,
              private authService: Auth,
              private CVService: CurriculumVitae,
              private conversationMessagesService: ConversationMessages,
              private usersService: Users,
              private voice: Voice
  ) {
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

                  this.getImageColors()
                    .then(averageColor => {
                      this.chatGradient = `background:  linear-gradient(180deg, ${averageColor} 0%, #131313 60%);`;
                      console.log("gradient", this.chatGradient);
                    })
                    .catch(console.error);

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

  async sendMessage() {

    let userInput: string = "";

    if (this.audioFile()) {
      const response = await firstValueFrom(this.voice.voiceToText(this.audioFile() as File));
      userInput = response["transcription"];
    } else {
      userInput = this.chatForm.get('userInput')?.value;
    }

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
          console.log("Message saved successfully");
        },
        error: (err) => {
          console.error("Error saving message:", err);
        }
      });

    this.scrollToBottom();

    let jobInformation: string = JSON.stringify({
      title: this.jobPosting.title,
      description: this.jobPosting.fullDescription,
      requirements: this.jobPosting.requirements
    });

    this.waitingForAgentResponse = true;

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
    }
  }

  enrichMessageContent(userInput: string, cvContent: string | null): string {
    let enrichedMessage: string = `- User input: ${userInput} `;
    enrichedMessage += this.jobPosting.id ? `- Job ID: ${this.jobPosting.id} ` : "";
    enrichedMessage += cvContent ? `- CV content: ${cvContent} ` : "";
    enrichedMessage += this.currentUser.id ? `- Applicant ID: ${this.currentUser.id} ` : "";
    enrichedMessage += this.userData.email ? `Applicant email: ${this.userData.email} ` : "";
    enrichedMessage += this.associatedRecruiter.email ? `- Recruiter email: ${this.associatedRecruiter.email} ` : "";

    return enrichedMessage;
  }

  private async startRecording(): Promise<void> {
    try {
      // Clear previous recording data
      this.audioChunks = [];
      this.audioUrl.set(null);

      // Request access to the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create a new MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(stream);

      // Listen for the 'dataavailable' event to collect audio chunks
      this.mediaRecorder.addEventListener('dataavailable', event => {
        this.audioChunks.push(event.data);
      });

      // Listen for the 'stop' event to process the final audio blob
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audioUrl.set(audioUrl);

        const audioFile = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
        this.audioFile.set(audioFile);

        // Stop the media stream tracks
        stream.getTracks().forEach(track => track.stop());
      });

      // Start the recording
      this.mediaRecorder.start();
      this.isRecording.set(true);
      console.log('Recording started.');

    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.isRecording.set(false);
    }
  }

  async toggleRecording(): Promise<void> {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
      console.log('Recording stopped.');
    }
  }

  deleteRecording() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl() as string);
    }

    this.audioUrl.set(null);
    this.audioChunks = [];
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    });
  }

  jobRequirementsToArray(requirements: string) {
    return requirements.split(',');
  }

  async getImageColors() {
    return await average(this.jobPosting.companyImage, { format: "hex" })
  }
}
