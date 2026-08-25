from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView , RetrieveDestroyAPIView
from .serializers import PostSerializer
from blog.models import  Post , Category
# Create your views here.

class PostList(ListCreateAPIView):
    queryset = Post.postobjects.all()
    serializer_class = PostSerializer





class PostDetail(RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    