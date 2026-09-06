
from django.contrib import admin
from django.urls import path, include
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls

from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    # Oauth
    path('auth/', include('drf_social_oauth2.urls', namespace='drf')),
    # project local apps 
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

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
