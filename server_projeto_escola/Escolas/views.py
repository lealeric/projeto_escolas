from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Escola
from .serializers import EscolaSerializer

class EscolaViewSet(viewsets.ModelViewSet):
    queryset = Escola.objects.all()
    serializer_class = EscolaSerializer

    def create(self, request, *args, **kwargs):
        nome_escola = request.data.get('nome')
        codigo_inep = request.data.get('codigo_inep')
        tipo_escola = request.data.get('tipo_escola')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if not nome_escola or not codigo_inep or not tipo_escola or not latitude or not longitude:
            return Response({"message": "Todos os campos devem ser preenchidos."}, status=status.HTTP_400_BAD_REQUEST)

        if latitude < -90 or latitude > 90:
            return Response({"message": "Latitude deve estar entre -90 e 90."}, status=status.HTTP_400_BAD_REQUEST)

        if longitude < -180 or longitude > 180:
            return Response({"message": "Longitude deve estar entre -180 e 180."}, status=status.HTTP_400_BAD_REQUEST)
    
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)