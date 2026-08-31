
from django.contrib import admin
from django.urls import path 

from .views import PostList , PostDetail , CreatePost , AdminPostDetail , EditPost , DeletePost
app_name='api'
urlpatterns = [
    path('post/' , PostList.as_view() ,name='listcreate'),
    path('post/<int:pk>' , PostDetail.as_view() ,name='detaildestroy'),
     # Post Admin URLs
    path('post/admin/create/', CreatePost.as_view(), name='createpost'),
    path('post/admin/edit/postdetail/<int:pk>/', AdminPostDetail.as_view(), name='admindetailpost'),
    path('post/admin/edit/<int:pk>/', EditPost.as_view(), name='editpost'),
    path('post/admin/delete/<int:pk>/', DeletePost.as_view(), name='deletepost'),
]
