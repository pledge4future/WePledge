from graphene_django.types import DjangoObjectType

from emissions.models import ResearchField


class ResearchFieldType(DjangoObjectType):
    """GraphQL Research Field"""

    class Meta:
        """Assign django model"""

        model = ResearchField