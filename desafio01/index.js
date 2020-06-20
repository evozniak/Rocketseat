const express = require('express');
const { json } = require('express');
const app = express();
app.use(express.json());

let projetos = [ { id: "1", titulo: "Detalhe de implementação", tarefas: ["Nova tarefa"] }];
let qtdRequisicoes = 0;

app.listen('3001', () => {
    console.log('Servidor ouvindo na porta 3001');
});

function middlewareContador(req, res, next)
{
    qtdRequisicoes++;
    console.log(`Requisição Nº: ${ qtdRequisicoes}, Método HTTP: ${ req.method }.`);
    return next();
}

app.post('/projects', middlewareContador, (req, res) => {
    const { id } = req.body;
    const { title } = req.body;
    const { tasks } = req.body;

    const projeto = {
        id: id,
        titulo: title,
        tarefas: tasks
    }

    projetos.push(projeto);
    return res.json(projeto);
});

app.get('/projects', middlewareContador, (req, res) => {
    return res.json(projetos);
});

app.put('/projects/:id', middlewareContador, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { tasks } = req.body;

    const projeto = {
        id: id,
        titulo: title,
        tarefas: tasks
    }

    projetos[id] = projeto;

    return res.json(projeto);
});

app.delete('/projects/:id', middlewareContador, (req, res,) => {
    const { id } = req.params;

    projetos.splice(id,1);

    return res.send();
});

app.post('/projects/:id/tasks', middlewareContador, (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    const projeto = projetos[id];

    projeto.tarefas.push(task);

    return res.json(projeto);
});