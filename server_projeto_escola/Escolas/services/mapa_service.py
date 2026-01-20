from Escolas.models import Escola
from math import radians, cos, sin, asin, sqrt

def dist(lat1, long1, lat2, long2):
    """
        Calcula a distância entre duas coordenadas geográficas.

        Args:
            lat1 (float): Latitude da primeira coordenada.
            long1 (float): Longitude da primeira coordenada.
            lat2 (float): Latitude da segunda coordenada.
            long2 (float): Longitude da segunda coordenada.

        Returns:
            float: Distância entre as duas coordenadas em quilômetros.
    """
    lat1, long1, lat2, long2 = map(radians, [lat1, long1, lat2, long2])

    dlon = long2 - long1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    
    km = 6371* c
    return km

def mais_proxima(lat: float, lng: float, escolas: list) -> Escola:
    """
        Retorna a escola mais próxima de uma coordenada dada.

        Args:
            lat (float): Latitude da coordenada.
            lng (float): Longitude da coordenada.
            escolas (list): Lista de escolas.

        Returns:
            Escola: Escola mais próxima da coordenada.
    """
    escola_mais_proxima = escolas[0]
    distancia_mais_proxima = dist(lat, lng, escola_mais_proxima.latitude, escola_mais_proxima.longitude)
    for escola in escolas:
        distancia = dist(lat, lng, escola.latitude, escola.longitude)
        if distancia < distancia_mais_proxima:
            escola_mais_proxima = escola
            distancia_mais_proxima = distancia
    return escola_mais_proxima, round(distancia_mais_proxima, 2)
    