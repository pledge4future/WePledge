from django.db import models
from emissions.models import CustomUser, WorkingGroup

class WorkingGroupJoinRequest(models.Model):
    """Request of a user to join a working group"""

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=False, null=False)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=False)
    timestamp = models.DateTimeField(auto_now_add=True, null=False)
    status_choices = [('Pending', 'pending' ), ('representative_notified', 'representative_notified')]
    status = models.CharField(max_length=50, choices=status_choices, null=False, blank=False)

    class Meta:
        """Specifies which attributes must be unique together"""
        #unique_together = ("user", "working_group")

    def __str__(self):
        return f"{self.user.first_name}, {self.user.last_name}"
