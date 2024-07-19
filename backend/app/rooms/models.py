from django.db import models

class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('single', 'Одноместный'),
        ('double', 'Двухместный'),
        ('triple', 'Трехместный'),
    ]
    
    CATEGORY_CHOICES = [
        ('standard', 'Стандарт'),
        ('deluxe', 'Делюкс'),
        ('luxury', 'Люкс'),
    ]

    room_type = models.CharField(max_length=50, choices=ROOM_TYPE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    has_child_bed = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.get_room_type_display()} - {self.get_category_display()}"
