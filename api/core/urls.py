from django.urls import include, path
from django.contrib import admin
from users.views import ProfileView, RegisterView
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/social/google/', GoogleLoginView.as_view()),
]
