import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

interface TranscriptionResponse {
  transcription: string;
}

@Injectable({
  providedIn: 'root'
})
export class Voice {

  private voiceApiURL: string = `${environment.AGENT_API_URL}/audio`;

  constructor(private http: HttpClient) { }

  voiceToText(audioFile: File) {
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    console.log("filetype:", audioFile.type);

    return this.http.post<TranscriptionResponse>(this.voiceApiURL, formData);
  }
}
