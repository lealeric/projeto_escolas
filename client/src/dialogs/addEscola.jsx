import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AddEscola = ({ open, onClose, latitude, longitude, onSuccess, escola }) => {
    const [nome, setNome] = React.useState('');
    const [tipo_escola, setTipo_escola] = React.useState('');
    const [numero_alunos, setNumero_alunos] = React.useState('');
    const [codigo_inep, setCodigo_inep] = React.useState('');

    React.useEffect(() => {
        if (escola) {
            setNome(escola.nome || '');
            setTipo_escola(escola.tipo_escola || '');
            setNumero_alunos(escola.num_alunos || '');
            setCodigo_inep(escola.codigo_inep || '');
        } else {
            setNome('');
            setTipo_escola('');
            setNumero_alunos('');
            setCodigo_inep('');
        }
    }, [escola, open]);

    const handleAddSchool = async () => {
        const payload = {
            nome,
            tipo_escola,
            num_alunos: numero_alunos,
            codigo_inep,
            latitude: latitude || escola?.latitude,
            longitude: longitude || escola?.longitude,
        };

        try {
            console.log(payload);
            const url = escola
                ? `http://localhost:8000/api/escolas/${escola.id_escola}/`
                : 'http://localhost:8000/api/escolas/';
            const method = escola ? 'PUT' : 'POST';

            console.log(url);
            console.log(method);
            console.log(payload);
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(escola ? 'Falha ao editar escola' : 'Falha ao adicionar escola');
            }
            console.log(escola ? 'Escola editada com sucesso' : 'Escola adicionada com sucesso');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar escola:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{escola ? "Editar uma escola Existente" : "Adicionar uma nova escola"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {escola ? "Edite os dados da escola." : "Informe os dados da escola que deseja adicionar."}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Código INEP"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={codigo_inep}
                    onChange={(e) => setCodigo_inep(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Tipo"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={tipo_escola}
                    onChange={(e) => setTipo_escola(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Latitude"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={latitude || (escola ? escola.latitude : '')}
                    disabled
                />
                <TextField
                    margin="dense"
                    label="Longitude"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={longitude || (escola ? escola.longitude : '')}
                    disabled
                />
                <TextField
                    margin="dense"
                    label="Número de Alunos"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={numero_alunos}
                    onChange={(e) => setNumero_alunos(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleAddSchool}>{escola ? "Salvar" : "Adicionar"}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEscola;