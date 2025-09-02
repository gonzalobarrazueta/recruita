from typing import Optional
from langchain_openai import OpenAIEmbeddings
from langchain_core.tools import tool
from dotenv import load_dotenv

import numpy as np
import requests
import logging
import os

load_dotenv()

@tool
def apply_to_job(
    cv_content: str,
    job_id: str,
    job_description: str,
    applicant_id: str,
    applicant_email: str,
    recruiter_email: str,
    threshold: Optional[float] = 0.75
) -> str:
    """
    Úsalo cuando un postulante quiera aplicar a una oferta de trabajo.

    Argumentos:
    - cv_content: Texto extraído del CV del postulante.
    - job_id: Identificador del trabajo.
    - job_description: Descripción textual de la oferta de trabajo.
    - applicant_id: Identificador del postulante.
    - applicant_email: Correo de contacto del postulante.
    - recruiter_email: Correo de contacto del reclutador.
    - threshold: Umbral de coincidencia entre 0 y 1 (valor por defecto = 0.75).

    Funcionamiento:
    Esta herramienta compara el contenido del CV con la descripción del puesto para
    determinar el nivel de compatibilidad del postulante con la vacante.

    - Si el nivel de coincidencia >= threshold:
        Se envían correos de confirmación tanto al postulante como al reclutador,
        indicando que la aplicación fue exitosa. También se devuelve una respuesta
        positiva al postulante.

    - Si el nivel de coincidencia < threshold:
        Se devuelve un mensaje de rechazo cordial, acompañado de retroalimentación
        útil para el postulante.
    """

    match_percentage = compute_similarity(cv_content, job_description)
    print(f'match_percentage: {match_percentage}')

    # Save match data
    try:
        response = requests.post(
            url=f'{os.getenv('JOB_POSTINGS_API_URL')}/matches/add',
            json={
                'job_id': job_id,
                'applicant_id': applicant_id,
                'match_percentage': match_percentage
            },
            timeout=10
        )
        # Handle non-200 responses
        if not response.ok:
            logging.error(
                f"Failed to add match. Status: {response.status_code}"
                f"Response: {response.text}"
            )
    except requests.RequestException as e:
        logging.error(f'Request to add match failed: {e}')

    if match_percentage >= threshold:
        # Positive match
        send_email(
            applicant_email,
            "Confirmación de postulación",
            f"¡Felicidades! Hemos recibido tu postulación y cumples con los requisitos para el puesto. "
            f"Tu match es del {match_percentage:.0%}. Pronto nos pondremos en contacto contigo."
        )
        send_email(
            recruiter_email,
            "Nuevo candidato para tu vacante",
            f"Un candidato ha aplicado a tu vacante con un match del {match_percentage:.0%}. "
            f"Por favor revisa su CV."
        )
        return f"¡Excelente noticia! Tu perfil coincide en un {match_percentage:.0%} con los requisitos del puesto. Hemos enviado tu postulación al reclutador."

    else:
        # Low match
        return (
            f"Hemos revisado tu perfil y actualmente coincide en un {match_percentage:.0%} con los requisitos del puesto. "
            "Te sugerimos mejorar la experiencia o habilidades indicadas en la descripción del trabajo antes de volver a aplicar."
        )

embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")

def compute_similarity(cv: str, job: str) -> float:
    cv_emb = embeddings_model.embed_query(cv)
    job_emb = embeddings_model.embed_query(job)
    # Cosine similarity
    sim = np.dot(cv_emb, job_emb) / (np.linalg.norm(cv_emb) * np.linalg.norm(job_emb))
    return float(sim)

def send_email(to: str, subject: str, body: str):
    print(f"Sending email to {to}: {subject}\n{body}")
