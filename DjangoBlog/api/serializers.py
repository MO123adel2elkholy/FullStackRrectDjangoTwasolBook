from rest_framework import serializers
from blog.models import Post
from django.conf import settings


class PostSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField() 
    author = serializers.StringRelatedField() 
    class Meta:
        model = Post
        fields = ('category', 'id', 'title', 'image', 'slug', 'author',
                  'excerpt', 'content', 'status' , 'published')
