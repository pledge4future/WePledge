from django.core.mail import send_mail
from pathlib import Path
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging
from django.core.mail import EmailMessage

logger = logging.getLogger('test')

class EmailClient:
    """Handles sending emails"""

    def __init__(self, template_dir: str):
        """
        Initialize
        :param template_dir: Path to directory containing templates
        """
        self.template_dir = Path(template_dir) / 'email'

    def get_template_email(self, name: str, values: str = None):
        """
        Get template for email text from template folder
        :param name: Name of template
        :param values: Values which should be replaced in template text
        :return:
        """
        if not values:
            values = {}
        template_file = self.template_dir / (name + '_email.html')
        if not template_file.exists():
            raise FileNotFoundError(f'{template_file} does not exist.')
        html_message = render_to_string(template_file, values)
        text_content = strip_tags(html_message)  # Strip the html tag. So people can see the pure text at least.
        return text_content, html_message

    def get_template_subject(self, name: str, values: str = None):
        """
        Get template for email subject from template folder
        :param name: Name of template
        :param values: Values which should be replaced in template subject text
        :return:
        """
        if not values:
            values = {}
        template_file = self.template_dir / (name + '_subject.txt')
        if not template_file.exists():
            raise FileNotFoundError(f'{template_file} does not exist.')
        subject = render_to_string(template_file, values)
        return subject

    def send_email(self, subject: str, html_message: str, from_email: str, to_email: str):
        """
        Sends email
        :param subject: Subject text
        :param text: Email text
        :param html_message: Email text as html
        :param from_email: Email address of sender
        :param to_email: Email address of recipient
        :return:
        """
        mail = EmailMessage(
            subject,
            html_message,
            from_email,
            [to_email],
        )
        mail.fail_silently = False
        mail.content_subtype = 'html'
        mail.send()



