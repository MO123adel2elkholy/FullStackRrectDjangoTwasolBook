
from django.contrib import admin
from django.urls import path 

from .views import (PostList , PostDetail , CreatePost , AdminPostDetail , EditPost , DeletePost ,CategoryList)
app_name='api'
urlpatterns = [
    # Category Api 
    path('category/' , CategoryList.as_view() ,name='category-list'),
    path('post/' , PostList.as_view() ,name='listcreate'),
    path('post/<int:pk>' , PostDetail.as_view() ,name='detaildestroy'),
     # Post Admin URLs
    path('post/admin/edit/postdetail/<int:pk>/', AdminPostDetail.as_view(), name='admin-post-detail'),
    path('post/admin/create/', CreatePost.as_view(), name='createpost'),
    path('post/admin/edit/<int:pk>/', EditPost.as_view(), name='editpost'),
    path('post/admin/delete/<int:pk>/', DeletePost.as_view(), name='deletepost'),
]
