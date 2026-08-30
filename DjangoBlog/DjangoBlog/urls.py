
from django.contrib import admin
from django.urls import path, include
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    # API Token Management
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('blog.urls' , namespace='blog')),
    path('api/', include('api.urls' , namespace='api')),
    path('api/user/' , include('users.urls' , namespace='users') ),  
     # API schema and Documentation
    path('api/docs/', include_docs_urls(title='TwasooBookApi')),
    path('api/schema', get_schema_view(
            title="TwasooBookApiv",
            description="API for the TwasooBook",
            version="1.0.0"
        ), name='openapi-schema'),

]
