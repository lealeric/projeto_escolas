from django.db import models


class Escola(models.Model):
    id_escola = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100, unique=True)
    codigo_inep = models.CharField(max_length=10, unique=True)
    tipo_escola = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    num_alunos = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return self.nome

    class Meta:
        db_table = "escolas"
    
