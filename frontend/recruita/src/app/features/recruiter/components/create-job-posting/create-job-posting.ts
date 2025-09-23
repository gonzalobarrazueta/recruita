import {Component, ElementRef, ViewChild} from '@angular/core';
import {MarkdownPipe} from '../../../../pipes/markdown-pipe';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Message, Sender} from '../../../../models/message';
import {User} from '../../../auth/models/user';
import {filter, switchMap, take} from 'rxjs';
import {Auth} from '../../../auth/services/auth';
import {Users} from '../../../../shared/services/users';
import {Agent} from '../../../../shared/services/agent';

@Component({
  selector: 'app-create-job-posting',
  imports: [
    MarkdownPipe,
    ReactiveFormsModule
  ],
  templateUrl: './create-job-posting.html',
  styleUrl: './create-job-posting.scss'
})
export class CreateJobPosting {

  chatForm!: FormGroup;
  messages: Message[] = [];
  waitingForAgentResponse: boolean = false;
  selectedFile: File | null = null;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  currentUser: User = <User>{}; // This only contains the user's id, role and token
  userData: any = null; // This contains the user data like email, phone, organization, etc.
  companyImage: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private usersService: Users,
    private agentService: Agent
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
          // fetch recruiter data
          return this.usersService.getUserById(this.currentUser.id);
        }
      )
    ).subscribe({
      next: (data: any) => {
        this.userData = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  sendMessage() {
    let userInput: string = this.chatForm.get('userInput')?.value;

    let user_message: Message = {
      userId: this.currentUser.id,
      content: userInput,
      conversationId: "",
      sender: Sender.USER
    };

    this.messages.push(user_message);

    this.scrollToBottom();

    this.waitingForAgentResponse = true;

    // Asks agent
    if (this.selectedFile) {
      this.selectedFile = null; // Reset the selected file after sending
    } else {
      this.askAgent(`Crea un nuevo puesto de trabajo con recruiter_id = ${this.currentUser.id} y con company_name = ${this.userData.organization}. Los detalles sobre el puesto son los siguientes: ${userInput}`);
    }

    this.chatForm.reset();
  }

  askAgent(message: string) {
    this.agentService.askAgent(message, "", "")
      .subscribe(data => {
        let ai_message: Message = {
          userId: this.currentUser.id,
          content: data.response,
          conversationId: "",
          sender: Sender.AI
        }

        this.messages.push(ai_message);
        this.waitingForAgentResponse = false;
      });
  }

  onFileSelected(event: any) {

  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    });
  }
}
