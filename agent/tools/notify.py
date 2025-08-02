from langchain_core.tools import tool
from email.message import EmailMessage
import smtplib

@tool
def send_notification(
        accepted: bool,
        email_subject_for_applicant: str,
        email_content_for_applicant: str,
        email_subject_for_recruiter: str,
        email_content_for_recruiter: str,
        applicant_email: str,
        recruiter_email: str):
    """
    Sends an email notification to users.
    There are two cases when to send an email:
     1. If the variable `accepted` is true, then you have to send a notification via email to both the applicant and recruiter:

        - For the applicant, set the `email_content_for_applicant` to a positive personalized message and write an appropriate `email_subject`.
        - For the recruiter, set the `email_content_for_recruiter` to a message informing them that the applicant is considered as an idle candidate. Set an `email_subject`.

        Both `applicant_email` and `recruiter_email` are required and will be provided to you.

     2. If the variable `accepted` is false, then you have to send a notification via email only to the applicant letting them know that they don't fit the position.

        - For this, set the `email_content_for_applicant` to a personalized message containing feedback and write an appropriate `email_subject`. Use a professional but friendly tone.

        Only `applicant_email` is required.
    """

    s = smtplib.SMTP('localhost')

    # For applicants
    email_for_applicant = EmailMessage()
    email_for_applicant.set_content(email_content_for_applicant)

    email_for_applicant['Subject'] = email_subject_for_applicant
    email_for_applicant['From'] = 'recruita_agent@recruiting.com'
    email_for_applicant['To'] = applicant_email

    s.send_message(email_for_applicant)

    if accepted:
        email_for_recruiter = EmailMessage()
        email_for_recruiter.set_content(email_content_for_recruiter)

        email_for_recruiter['Subject'] = email_subject_for_recruiter
        email_for_recruiter['From'] = 'recruita_agent@recruiting.com'
        email_for_recruiter['To'] = recruiter_email

        s.send_message(email_for_recruiter)
    s.quit()

    return 'Email notification sent.'