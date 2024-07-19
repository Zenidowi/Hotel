from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'client', 'room', 'check_in_date', 'check_out_date', 'total_cost', 'status']
