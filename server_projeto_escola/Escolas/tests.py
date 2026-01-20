import pytest
from .models import Escola
from .services.mapa_service import mais_proxima
from decimal import Decimal

@pytest.fixture
def escolas():
    return [
        Escola(latitude=-12.793889, longitude=-47.882778),
        Escola(latitude=-12.793889, longitude=-47.882778),
        Escola(latitude=-12.793889, longitude=-47.882778),
    ]

def test_mais_proxima(escolas):
    lat = -12.793889
    lng = -47.882778
    escola_mais_proxima, distancia = mais_proxima(lat, lng, escolas)
    assert escola_mais_proxima == escolas[0]
    assert distancia == 0

@pytest.mark.django_db
def test_create_escola():
    escola = Escola.objects.create(
        nome='Escola Teste',
        codigo_inep=12345678,
        tipo_escola='Fundamental',
        latitude=-12.793889,
        longitude=-47.882778,
        num_alunos=100
    )
    assert escola.nome == 'Escola Teste'
    assert escola.codigo_inep == 12345678
    assert escola.tipo_escola == 'Fundamental'
    assert escola.latitude == -12.793889
    assert escola.longitude == -47.882778
    assert escola.num_alunos == 100

@pytest.mark.django_db
def test_update_escola():
    escola = Escola.objects.create(
        nome='Escola Teste',
        codigo_inep=12345678,
        tipo_escola='Fundamental',
        latitude=-12.793889,
        longitude=-47.882778,
        num_alunos=100
    )
    escola.nome = 'Escola Teste Atualizada'
    escola.save()
    assert escola.nome == 'Escola Teste Atualizada'

@pytest.mark.django_db
def test_delete_escola():
    escola = Escola.objects.create(
        nome='Escola Teste',
        codigo_inep=12345678,
        tipo_escola='Fundamental',
        latitude=-12.793889,
        longitude=-47.882778,
        num_alunos=100
    )
    escola.delete()
    assert Escola.objects.count() == 0

@pytest.mark.django_db
def test_list_escolas():
    escola = Escola.objects.create(
        nome='Escola Teste',
        codigo_inep=12345678,
        tipo_escola='Fundamental',
        latitude=-12.793889,
        longitude=-47.882778,
        num_alunos=100
    )
    assert Escola.objects.count() == 1
    assert Escola.objects.first() == escola
    assert Escola.objects.first().nome == 'Escola Teste'
    assert Escola.objects.first().codigo_inep == str(12345678)
    assert Escola.objects.first().tipo_escola == 'Fundamental'
    assert Escola.objects.first().latitude == Decimal('-12.79388900')
    assert Escola.objects.first().longitude == Decimal('-47.88277800')
    assert Escola.objects.first().num_alunos == 100

@pytest.mark.django_db
def test_get_escola():
    escola = Escola.objects.create(
        nome='Escola Teste',
        codigo_inep=12345678,
        tipo_escola='Fundamental',
        latitude=-12.793889,
        longitude=-47.882778,
        num_alunos=100
    )
    assert Escola.objects.get(pk=escola.pk) == escola
    assert Escola.objects.get(pk=escola.pk).nome == 'Escola Teste'
    assert Escola.objects.get(pk=escola.pk).codigo_inep == str(12345678)
    assert Escola.objects.get(pk=escola.pk).tipo_escola == 'Fundamental'
    assert Escola.objects.get(pk=escola.pk).latitude == Decimal('-12.79388900')
    assert Escola.objects.get(pk=escola.pk).longitude == Decimal('-47.88277800')
    assert Escola.objects.get(pk=escola.pk).num_alunos == 100
