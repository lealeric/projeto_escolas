from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Escola
from .serializers import EscolaSerializer
from .services.mapa_service import mais_proxima

class EscolaViewSet(viewsets.ModelViewSet):
    queryset = Escola.objects.all()
    serializer_class = EscolaSerializer

    def create(self, request, *args, **kwargs):
        nome_escola = request.data.get('nome')
        codigo_inep = int(request.data.get('codigo_inep'))
        tipo_escola = request.data.get('tipo_escola')
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        numero_alunos = int(request.data.get('numero_alunos'))
        
        if not nome_escola or not codigo_inep or not tipo_escola or not latitude or not longitude:
            return Response({"message": "Todos os campos devem ser preenchidos."}, status=status.HTTP_400_BAD_REQUEST)

        if latitude < -90 or latitude > 90:
            return Response({"message": "Latitude deve estar entre -90 e 90."}, status=status.HTTP_400_BAD_REQUEST)

        if longitude < -180 or longitude > 180:
            return Response({"message": "Longitude deve estar entre -180 e 180."}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            Escola.objects.create(
                nome=nome_escola,
                codigo_inep=codigo_inep,
                tipo_escola=tipo_escola,
                latitude=latitude,
                longitude=longitude,
                num_alunos=numero_alunos
            )
            return Response({"message": "Escola adicionada com sucesso."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        print(request.data)
        print(instance)
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def mais_proxima(self, request, pk=None):
        escolas = Escola.objects.all()
        lat = request.query_params.get('latitude')
        lng = request.query_params.get('longitude')
        if not lat or not lng:
            return Response({"message": "Latitude e longitude devem ser informadas."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            lat = float(lat)
            lng = float(lng)
            escola_mais_proxima, distancia = mais_proxima(lat, lng, escolas)
            serializer = self.get_serializer(escola_mais_proxima)
            headers = self.get_success_headers(serializer.data)            
            return Response({
                "escola": serializer.data,
                "distancia": distancia
            }, status=status.HTTP_200_OK, headers=headers)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)