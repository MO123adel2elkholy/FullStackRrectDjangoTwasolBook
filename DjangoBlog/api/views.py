from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView , RetrieveUpdateDestroyAPIView
from .serializers import PostSerializer
from blog.models import  Post , Category
from rest_framework.permissions import IsAuthenticated , SAFE_METHODS , BasePermission , IsAuthenticatedOrReadOnly
# from django_filters.conf import settings
class PostChangPermission(BasePermission):
    message="Post Editing or deleting is only alowed for authenticated user and user owens the post "
    def has_object_permission(self, request, view, obj):
        if  request.method in SAFE_METHODS:
          return True
        return obj.author== request.user

class PostList(ListCreateAPIView):
    queryset = Post.postobjects.all()
    serializer_class = PostSerializer
    permission_classes =[IsAuthenticated]





class PostDetail(RetrieveUpdateDestroyAPIView , PostChangPermission):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes =[ PostChangPermission]

    