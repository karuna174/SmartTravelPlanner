from django.urls import path
from . import views
urlpatterns = [
    path('',views.trip_list),
    path('register/',views.register),
    path('login/',views.login),
    path('<int:pk>/',views.trip_detail),
    path('generate-itinerary/',views.generate_itinerary),
]