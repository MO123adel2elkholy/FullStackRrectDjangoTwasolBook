from django.shortcuts import render
from rest_framework.generics import (  RetrieveAPIView , ListAPIView)
from .serializers import PostSerializer , readPostSerializer
from blog.models import  Post , Category
from rest_framework.permissions import IsAuthenticated 
from .pemissions import PostChangPermission
from rest_framework import filters
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import permissions

# from django_filters.conf import settings



class PostList(ListAPIView):
    queryset = Post.postobjects.prefetch_related('author').prefetch_related('category')
    serializer_class = readPostSerializer
    permission_classes =[IsAuthenticated]
    filter_backends = [filters.SearchFilter]
        # '^' Starts-with search.
        # '=' Exact matches.
    search_fields = ['^slug']
    




class PostDetail(RetrieveAPIView , PostChangPermission):
    queryset = Post.postobjects.prefetch_related('author').prefetch_related('category')
    serializer_class = readPostSerializer
    permission_classes =[ PostChangPermission]

    # def get_object(self):
    #     pass 

    

# Post Admin

class CreatePost(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


# class CreatePost(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, format=None):
#         print(request.data)
#         serializer = PostSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminPostDetail(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class EditPost(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all()


class DeletePost(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all()


