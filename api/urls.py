from django.urls import path
from .views import TitanicMLAPIView, TitanicReceptionistAPIView

urlpatterns = [
    path('chatbot_ml/', TitanicMLAPIView.as_view(), name='chatbot_ml'),
    path("titanic_receptionist/", TitanicReceptionistAPIView.as_view(), name="titanic_receptionist"),
]
