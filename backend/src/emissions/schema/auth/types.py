from graphene_django.types import DjangoObjectType

from emissions.models import CustomUser

class UserType(DjangoObjectType):
    """GraphQL User Type"""

    class Meta:
        """Assign django model"""

        model = CustomUser