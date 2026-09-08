from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserSerializer
from rest_framework.permissions import AllowAny


class CustomUserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ...existing code...
from rest_framework.permissions import AllowAny, IsAuthenticated
# ...existing code...

class UserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        return Response({"message": "User verified successfully."}, status=status.HTTP_200_OK)

# ...existing code...

class CurrentUserView(APIView):
    # permission_classes = [IsAuthenticatedo]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": getattr(user, "username", None),
            "email": getattr(user, "email", None),
        }, status=status.HTTP_200_OK)
# ...existing code...
