from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TripSerializer
from .models import Trip
from .user_serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from datetime import date, timedelta

# Create your views here.
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def trip_list(request):
    if request.method =='GET':
        #read trips
        trips=Trip.objects.filter(user=request.user)
        serializer=TripSerializer(trips,many=True)
        return Response(serializer.data)
    if request.method=='POST':
        #create trip
        serializer=TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors)
@api_view(['POST'])
def register(request):
    serializer=UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['POST'])
def login(request):
    username=request.data.get("username")
    password=request.data.get("password")
    user=authenticate(username=username,password=password)
    if user:
        refresh=RefreshToken.for_user(user)
        access=refresh.access_token
        return Response({
            "refresh":str(refresh),
            "access":str(access)
        })
    else:
        return Response({
            "message":"invalid"
        })
    
@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def trip_detail(request, pk):
    trip = Trip.objects.get(id=pk, user=request.user)
    if request.method=='GET':
        serializer=TripSerializer(trip)
        return Response(serializer.data)
    if request.method=="PUT":
        serializer=TripSerializer(trip,data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    if request.method=='DELETE':
        trip.delete()
        return Response({"message":"Trip deleted succesfully"})

    #serializer = TripSerializer(trip)
    return Response(serializer.data)


def create_itinerary(destination, start_date, end_date):
    start_date = date.fromisoformat(start_date)
    end_date = date.fromisoformat(end_date)

    itinerary = []

    activities = [
        {
            "morning": "Explore the destination",
            "afternoon": "Visit a local sightseeing spot",
            "evening": "Try local food and relax",
        },
        {
            "morning": "Enjoy a local activity",
            "afternoon": "Explore local markets",
            "evening": "Relax and have dinner",
        },
        {
            "morning": "Visit a nearby attraction",
            "afternoon": "Have lunch and explore",
            "evening": "Prepare for the next day",
        },
    ]

    total_days = (end_date - start_date).days + 1

    for day_number in range(total_days):
        current_date = start_date + timedelta(days=day_number)
        daily_activities = activities[day_number % len(activities)]

        itinerary.append({
            "day": day_number + 1,
            "date": current_date.isoformat(),
            "destination": destination,
            "morning": daily_activities["morning"],
            "afternoon": daily_activities["afternoon"],
            "evening": daily_activities["evening"],
        })

    return itinerary

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_itinerary(request):
    destination = request.data.get("destination")
    start_date = request.data.get("start_date")
    end_date = request.data.get("end_date")
    budget = request.data.get("budget")

    if not destination or not start_date or not end_date or not budget:
        return Response({
            "error": "Please provide destination, start_date, end_date and budget."
        }, status=400)

    try:
        itinerary = create_itinerary(
            destination,
            start_date,
            end_date
        )

        return Response({
            "destination": destination,
            "budget": budget,
            "itinerary": itinerary
        })

    except (ValueError, TypeError):
        return Response({
            "error": "Invalid date format. Use YYYY-MM-DD."
        }, status=400)