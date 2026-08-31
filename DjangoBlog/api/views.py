from django.shortcuts import render
from rest_framework.generics import (  RetrieveAPIView , ListAPIView)
from .serializers import PostSerializer
from blog.models import  Post , Category
from rest_framework.permissions import IsAuthenticated 
from .pemissions import PostChangPermission
from rest_framework import filters
# from django_filters.conf import settings



class PostList(ListAPIView):
    queryset = Post.postobjects.prefetch_related('author').prefetch_related('category')
    serializer_class = PostSerializer
    # permission_classes =[IsAuthenticated]
    filter_backends = [filters.SearchFilter]
        # '^' Starts-with search.
        # '=' Exact matches.
    search_fields = ['^slug']
    




class PostDetail(RetrieveAPIView , PostChangPermission):
    queryset = Post.postobjects.prefetch_related('author').prefetch_related('category')
    serializer_class = PostSerializer
    permission_classes =[ PostChangPermission]

    # def get_object(self):
    #     pass 

    