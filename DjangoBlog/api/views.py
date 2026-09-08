from django.shortcuts import render
from rest_framework.generics import (  RetrieveAPIView , ListAPIView)
from .serializers import PostSerializer , readPostSerializer ,CategorySerializer
from blog.models import  Post , Category
from rest_framework.permissions import IsAuthenticated  , IsAuthenticatedOrReadOnly
from .pemissions import PostChangPermission
from rest_framework import filters
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

# Display Posts

# from django_filters.conf import settings



class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes =[IsAuthenticatedOrReadOnly]



# ...existing code...
class PostList(ListAPIView):
    queryset = Post.postobjects.prefetch_related('author').prefetch_related('category')
    serializer_class = readPostSerializer
    permission_classes =[IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    # allow searching by title, slug, excerpt or content (icontains by default)
    search_fields = ['title', 'slug', 'excerpt', 'content']
# ...existing code...


class PostDetail(RetrieveAPIView , PostChangPermission):
    queryset = Post.postobjects.prefetch_related('author').prefetch_related('category')
    serializer_class = readPostSerializer
    permission_classes =[ PostChangPermission]

    # def get_object(self):
    #     pass 

    




class CreatePost(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        print(request.data)
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminPostDetail(generics.RetrieveUpdateAPIView , PostChangPermission):
    permission_classes = [permissions.IsAuthenticated , PostChangPermission]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class EditPost(generics.UpdateAPIView , PostChangPermission):
    permission_classes = [permissions.IsAuthenticated , PostChangPermission]
    serializer_class = PostSerializer
    queryset = Post.objects.all()


class DeletePost(generics.RetrieveDestroyAPIView , PostChangPermission):
    permission_classes = [permissions.IsAuthenticated , PostChangPermission]
    serializer_class = PostSerializer
    queryset = Post.objects.all()


