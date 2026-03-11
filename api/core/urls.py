from django.urls import include, path
from django.contrib import admin
from users.views import ProfileView, RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]
