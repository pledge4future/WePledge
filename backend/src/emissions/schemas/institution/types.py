from graphene_django.types import DjangoObjectType

from emissions.models import Institution


class InstitutionType(DjangoObjectType):
    """GraphQL Institution"""

    class Meta:
        """Assign django model"""

        model = Institution
