from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSignup, UserLogin
from user.models import UserProfile as User
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from common.email import send_email
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
# Create your views here.

# Register or Signup new user
class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSignup(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')
            if password != confirm_password:
                return Response({'message': 'password and confirm password do not match'},
                    status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=email).exists():
                return Response({'message': 'email id already registered'},
                    status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create(
                name=name,
                email=email
            )
            user.set_password(password)
            user.save()

            return Response(
                {'message': 'form submitted successfully'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Authenticate and login New user
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLogin(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            email = data.get("email")
            password = data.get("password")
            
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(email=user_obj.email, password=password)
            except User.DoesNotExist:
                user = None
            
            if user is None:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if user.scheduled_deletion_on:
                return Response(
                    {"error": "This account is scheduled for deletion and is no longer accessible."},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'user logged in successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# generates password reset link email & sends it to user
class reset_password(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        reset_email = request.data.get("email")
        user = User.objects.filter(email=reset_email).first()
        if not user:
            return Response({"message": "user not found!"}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        default_email = settings.EMAIL_HOST_USER
        mail_sub = "Password Reset Link"
        reset_link = f"http://localhost:5173/setnewpassword/?uid={uid}&token={token}"

        message = f"Hello,\n\nYou requested a password reset for your account. Click on the link below to set a new password:\n\n{reset_link}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nCareerIQ Support Team"

        html_message = f"""
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">CareerIQ</h1>
            </div>
            <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Reset Your Password</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello,</p>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">We received a request to reset your password for your CareerIQ account. Click the button below to choose a new password.</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href="{reset_link}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">Reset Password</a>
                </div>
                <p style="color: #718096; font-size: 14px; line-height: 1.6; margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser:<br><a href="{reset_link}" style="color: #4f46e5; word-break: break-all;">{reset_link}</a></p>
                <p style="color: #718096; font-size: 14px; line-height: 1.6; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                <p style="color: #a0aec0; font-size: 14px; margin: 0;">Best regards,<br><strong style="color: #4a5568;">CareerIQ Support Team</strong></p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2024 CareerIQ. All rights reserved.</p>
            </div>
        </div>
        """

        try:
            send_email(request, default_email, reset_email, message, mail_sub, html_message=html_message)
        except Exception as e:
            print(f"Reset email failed: {str(e)}")

        return Response({"message": "Reset link generated and sent to your email."})


# sets the new password 
class set_new_password(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_pass = request.data.get('newpassword')

        if not uid or not token or not new_pass:
            return Response({"message": "uid, token and new_password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(id=user_id)
        except:
            return Response({"message": "invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        if PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_pass)
            user.save()

            default_email = settings.EMAIL_HOST_USER
            mail_sub = "Your Password Has Been Changed"
            
            confirm_message = f"Hello {user.name},\n\nThis is a confirmation that the password for your account has been successfully changed.\n\nIf you did not perform this action, please contact our support team immediately.\n\nBest regards,\nCareerIQ Support Team"

            html_confirm_message = f"""
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">CareerIQ</h1>
                </div>
                <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Password Changed Successfully</h2>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello {user.name},</p>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">This email is to confirm that the password for your CareerIQ account has been successfully changed.</p>
                    <div style="background-color: #ebf8fa; border-left: 4px solid #00b5d8; padding: 15px; margin: 25px 0; border-radius: 4px;">
                        <p style="color: #2c5282; font-size: 14px; margin: 0;">If you did not perform this action, please contact our support team immediately to secure your account.</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #a0aec0; font-size: 14px; margin: 0;">Best regards,<br><strong style="color: #4a5568;">CareerIQ Support Team</strong></p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2024 CareerIQ. All rights reserved.</p>
                </div>
            </div>
            """

            try:
                send_email(request, default_email, user.email,
                           confirm_message, mail_sub, html_message=html_confirm_message)
            except Exception as e:
                print(f"Confirmation email failed: {str(e)}")

            return Response({"message": "password reset successfully."})
        else:
            return Response({"message": "Invalid or expired token.."}, status=status.HTTP_400_BAD_REQUEST)
        

class Contactus(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        message_text = request.data.get('message')

        if not name or not email or not message_text:
            return Response({"message": "name, email and message are required"}, status=status.HTTP_400_BAD_REQUEST)

        admin_email = settings.EMAIL_HOST_USER
        mail_sub = f"New Contact Request from {name}"
        
        message = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message_text}"

        html_message = f"""
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">CareerIQ Support</h1>
            </div>
            <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">New Contact Form Submission</h2>
                <p style="color: #4a5568; font-size: 16px; margin-bottom: 10px;"><strong>Name:</strong> {name}</p>
                <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;"><strong>Email:</strong> {email}</p>
                <p style="color: #4a5568; font-size: 16px; margin-bottom: 10px;"><strong>Message:</strong></p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                    {message_text}
                </div>
            </div>
        </div>
        """

        try:
            send_email(request, admin_email, admin_email, message, mail_sub, html_message=html_message)
            
            user_sub = "We received your message"
            user_msg = f"Hello {name},\n\nThank you for reaching out to CareerIQ! We have received your message and will get back to you shortly.\n\nBest regards,\nCareerIQ Team"
            user_html = f"""
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">CareerIQ</h1>
                </div>
                <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Message Received</h2>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello {name},</p>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for writing to us! This is an automated response to let you know that we have received your message and someone from our team will get back to you as soon as possible.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #a0aec0; font-size: 14px; margin: 0;">Best regards,<br><strong style="color: #4a5568;">CareerIQ Support Team</strong></p>
                </div>
            </div>
            """
            send_email(request, admin_email, email, user_msg, user_sub, html_message=user_html)
            
        except Exception as e:
            print(f"Contact email failed: {str(e)}")

        return Response({"message": "Your message has been sent successfully!"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "name": request.user.name,
            "email": request.user.email,
            "plan": "Pro"
        })
