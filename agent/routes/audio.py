from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette import status
from openai import OpenAI
from dotenv import load_dotenv
import subprocess
import tempfile

load_dotenv()

router = APIRouter(
    prefix='/audio',
    tags=['audio']
)

openai_client = OpenAI()

@router.post(
    path='',
    status_code=status.HTTP_200_OK
)
async def voice_to_agent(
    audio_file: UploadFile = File(...)
):
    try:

        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp_in:
            tmp_in.write(await audio_file.read())
            tmp_in_path = tmp_in.name

        tmp_out_path = tmp_in_path.rsplit(".", 1)[0] + ".mp3"

         # Convert any input format to mp3
        subprocess.run(
            ["ffmpeg", "-i", tmp_in_path, "-ar", "16000", "-ac", "1", tmp_out_path],
            check=True
        )

        with open(tmp_out_path, "rb") as f:
            transcript = openai_client.audio.transcriptions.create(
                model="gpt-4o-mini-transcribe",
                file=f
            )

        return { 'transcription': transcript.text }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
