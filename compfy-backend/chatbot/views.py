#chatbot/views.py
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .llm_client import get_chat_response

class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]   # 👈 add this line

    def post(self, request):
        user_msg = request.data.get("message", "")
        if not user_msg:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        bot_reply = get_chat_response(user_msg)
        return Response({"response": bot_reply}, status=status.HTTP_200_OK)
