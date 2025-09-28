from django.urls import path
from .views import TitanicMLAPIView

urlpatterns = [
    path('chatbot_ml/', TitanicMLAPIView.as_view(), name='chatbot_ml'),
]
