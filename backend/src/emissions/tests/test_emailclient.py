from dotenv import load_dotenv
load_dotenv("../../.env")
from backend.src.emissions.email_client import EmailClient
from django.conf import settings

TEMPLATE_DIR = settings.TEMPLATES[0]['DIRS'][0]


def test_emailclient():
    """Tests whether setting up EmailClient works"""
    client = EmailClient(template_dir=TEMPLATE_DIR)
    assert isinstance(client, EmailClient)


def test_get_template_email():
    """Tests whether getting an email template works"""
    client = EmailClient(template_dir=TEMPLATE_DIR)
    email_text, html_text = client.get_template_email('join_request')
    assert isinstance(email_text, str)


def test_get_template_subject():
    """Tests whether getting an email subject template works"""
    client = EmailClient(template_dir=TEMPLATE_DIR)
    email_text = client.get_template_subject('join_request')
    assert isinstance(email_text, str)


def test_send_email():
    """Tests whether sending an email works"""

    client = EmailClient(template_dir=TEMPLATE_DIR)
    from_email = "no-reply@pledge4future.org"
    to_email = "christina_ludwig@gmx.net"

    _, html_text = client.get_template_email('join_request')
    email_subject = client.get_template_subject('join_request')
    client.send_email(email_subject, html_text, from_email, to_email)
