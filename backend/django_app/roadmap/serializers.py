from rest_framework import serializers
from roadmap.models import CareerRole,RoadMap

class CareerRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRole
        fields = '__all__'

class RoadMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadMap
        fields = '__all__'



        