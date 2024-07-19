from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name