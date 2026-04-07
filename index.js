import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = "0.0.0.0";
const porta = 3000;

const app = express();

var listaLeitor = [];
var listaLivro = [];

app.use(session({
    secret: 'M1nh4Ch4v3S3cr3t4', 
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get('/', estaAutenticado, (req, res) => {
    
    const ultimoAcesso = req.cookies?.ultimoAcesso || "Primeiro Login";
    
    res.write(`
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Menu do Sistema</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>`);

    res.write(`
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Menu</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadatro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/livro">Livro</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/leitor">Leitor</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Logaut</a>
                        </li>
                    </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"/>
                    <button class="btn btn-outline-success" type="submit">Buscar</button>
                </form>
                </div>
            </div>
            </nav>
        `);
    res.write(`
            <p class="m-3 text-body-secondary">Último acesso: ${ultimoAcesso} </p>
    `);
    res.write(`
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script> 
        </html>`);

    res.end();
});

app.get("/livro", estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Formulario de Cadastro de Livros</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                <div class="container mt-5">
                        <legend>
                            <h3> Cadastro de Livro </h3>
                        </legend>
                        <form method = "POST" action = "/livro" class="row gy-2 gx-3 align-items-center border p-3">
                            <div class="row">
                                <label class="colFormLabel" for="titulo">Título do Livro</label>
                                <input type="text" class="form-control" id="titulo" name="titulo">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="autor">Nome do Autor</label>
                                <input type="text" class="form-control" id="autor" name="autor">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="cod">Código ISBN ou Indentificação do Livro</label>
                                <input type="number" class="form-control" id="cod" name="cod">
                            </div>
                            <div class="row mt-3">
                                <br>
                                <button type="submit" class="btn btn-primary">Cadastrar Livro</button>
                            </div>
                    </form>
                </div>
            </body>
        </html>
        `);

    resposta.end();
});

app.post("/livro", estaAutenticado, (requisicao, resposta) => {
    const titulo = requisicao.body.titulo;
    const autor = requisicao.body.autor;
    const cod = requisicao.body.cod;

    if (!titulo || !autor || !cod) {
        let html = `
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Formulario de Cadastro de Livros</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                <div class="container mt-5">
                        <legend>
                            <h3> Cadastro de Livros </h3>
                        </legend>
                        <form method = "POST" action = "/livro" class="row gy-2 gx-3 align-items-center border p-3">
                            <div class="row">
                                <label class="colFormLabel" for="titulo">Título do Livro</label>
                                <input type="text" class="form-control" id="titulo" name="titulo" value="${titulo}"> `
                                if(!titulo){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe o titulo do livro
                                    </div>
                                    `;
                                }
                                html += `
                            </div>    
                            <div class="row">
                                <label class="colFormLabel" for="autor">Nome do Autor</label>
                                <input type="text" class="form-control" id="autor" name="autor" value="${autor}"> `
                                if(!autor){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe o autor do livro
                                    </div>
                                    `;
                                }
                                html += `
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="cod">Código ISBN ou Indentificação do Livro</label>
                                <input type="number" class="form-control" id="cod" name="cod"  value="${cod}"> `
                                if(!cod){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe o código
                                    </div>
                                    `;
                                }
                                html += `
                            </div>
                            <br>
                            
                            <br>
                            <div class="row">
                                <button type="submit" class="btn btn-primary">Cadastrar Livro</button>
                            </div>
                    </form>
                </div>
            </body>
        </html>
        `;

        resposta.write(html);
        resposta.end();

    }

    else {
        listaLivro.push({
            "titulo": titulo,
            "autor": autor,
            "cod": cod
        });

        resposta.redirect('/listaLivro');
    }
});

app.get('/listaLivro', estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Livros cadastrados</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                <div class="container mt-5">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Título</th>
                                <th scope="col">Autor</th>
                                <th scope="col">Código</th>
                            </tr>
                        </thead>
                        <tbody>
        `);

    for (let i = 0; i < listaLivro.length; i++) {
        const produto = listaLivro[i];

        resposta.write(`
            <tr>
                <td> ${i + 1} </td>
                <td> ${produto.titulo} </td>
                <td> ${produto.autor} </td>
                <td> ${produto.cod} </td>
            </tr>
            `);
    }
    resposta.write(`
                        </tbody>
                    </table>
                        <a href="/livro" class="btn btn-primary"> Continuar Cadastrando </a>
                        <a href="/" class="btn btn-primary"> Voltar para o Menu </a>
                    </div>
            </body>
        </html>
        `);

    resposta.end();
});

app.get("/leitor", estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Formulario de Cadastro de Leitores</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                <div class="container mt-5">
                        <legend>
                            <h3> Cadastro de Leitor </h3>
                        </legend>
                        <form method = "POST" action = "/leitor" class="row gy-2 gx-3 align-items-center border p-3">
                            <div class="row">
                                <label class="colFormLabel" for="nome">Nome do Leitor</label>
                                <input type="text" class="form-control" id="nome" name="nome">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="cpf">CPF ou Indentificação</label>
                                <input type="number" class="form-control" id="cpf" name="cpf">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="cel">Telefone</label>
                                <input type="tel" class="form-control" id="cel" name="cel" placeholder="(18) 99999-9999">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="emprestimo">Data Empréstimo</label>
                                <input type="date" class="form-control" id="emprestimo" name="emprestimo">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="devolucao">Data Devolução</label>
                                <input type="date" class="form-control" id="devolucao" name="devolucao">
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="livro">Nome do Livro</label>
                                <select class="form-control" name="livro" id="livro">
                                    <option value="" selected>Selecione um livro</option>
                                `);
                                for(let i = 0; i < listaLivro.length; i++)
                                    resposta.write(`<option value="${listaLivro[i].titulo}">${listaLivro[i].titulo}</option>`);
                                
                             resposta.write(`
                                </select>
                            </div>
                            <div class="row mt-3">
                                <br>
                                <button type="submit" class="btn btn-primary">Cadastrar Leitor</button>
                            </div>
                    </form>
                </div>
            </body>
        </html>
        `);

    resposta.end();
});

app.post("/leitor", estaAutenticado, (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const cpf = requisicao.body.cpf;
    const cel = requisicao.body.cel;
    const emprestimo = requisicao.body.emprestimo;
    const devolucao = requisicao.body.devolucao;
    const livro = requisicao.body.livro;


    if (!nome || !cpf || !cel || !emprestimo || !devolucao || !livro) {
        let html = `
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Formulario de Cadastro de Livros</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                <div class="container mt-5">
                        <legend>
                            <h3> Cadastro de Livros </h3>
                        </legend>
                        <form method = "POST" action = "/leitor" class="row gy-2 gx-3 align-items-center border p-3">
                            <div class="row">
                                <label class="colFormLabel" for="nome">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome" value="${nome}"> `
                                if(!nome){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe o nome do leitor 
                                    </div>
                                    `;
                                }
                                html += `
                            </div>    
                            <div class="row">
                                <label class="colFormLabel" for="cpf">CPF ou Indentificação</label>
                                <input type="number" class="form-control" id="cpf" name="cpf"  value="${cpf}"> `
                                if(!cpf){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe o CPF do leitor
                                    </div>
                                    `;
                                }
                                html += `
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="cel">Telefone</label>
                                <input type="tel" class="form-control" id="cel" name="cel" placeholder="(18) 99999-9999" value="${cel}"> `
                                if(!cel){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe o telefone do leitor 
                                    </div>
                                    `;
                                }
                                html += `
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="emprestimo">Data Empréstimo</label>
                                <input type="date" class="form-control" id="emprestimo" name="emprestimo" value="${emprestimo}"> `
                                if(!emprestimo){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe a data do empréstimo 
                                    </div>
                                    `;
                                }
                                html += `
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="devolucao">Data Devolução</label>
                                <input type="date" class="form-control" id="devolucao" name="devolucao" value="${devolucao}"> `
                                if(!nome){
                                    html += `
                                    <br>
                                    <div class="alert alert-danger mt-2" role="alert">
                                        Por favor informe a data de devolução 
                                    </div>
                                    `;
                                }
                                html += `
                            </div>
                            <div class="row">
                                <label class="colFormLabel" for="livro">Nome do Livro</label>
                                <select class="form-control" name="livro" id="livro">
                                `;
                                if (!livro) {
                                    html += `<option value="" selected>Selecione um livro</option>`;
                                } 
                                else {
                                    html += `<option value="">Selecione um livro</option>`;
                                }

                                for (let i = 0; i < listaLivro.length; i++) {

                                    if (livro == listaLivro[i].cod) {
                                        html += `<option value="${listaLivro[i].cod}" selected>${listaLivro[i].titulo}</option>`;
                                    } else {
                                        html += `<option value="${listaLivro[i].cod}">${listaLivro[i].titulo}</option>`;
                                    }

                                }

                                html+=`</select>`;

                            if (!livro) {
                                html += `
                                <div class="alert alert-danger mt-2" role="alert">
                                    Por favor selecione um livro
                                </div>
                                `;
                            }
                                
                            html+=`
                            </div>
                            <div class="row mt-3">
                                <br>
                                <button type="submit" class="btn btn-primary">Cadastrar Leitor</button>
                            </div>
                    </form>
                </div>
            </body>
        </html>
        `;

        resposta.write(html);
        resposta.end();

    }

    else {
        listaLeitor.push({
            "nome": nome,
            "cpf": cpf,
            "cel": cel,
            "emprestimo": emprestimo,
            "devolucao": devolucao,
            "livro": livro
        });

        resposta.redirect('/listaLeitor');
    }
});

app.get('/listaLeitor', estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
        <!doctype html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <title>Leitores cadastrados</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                <div class="container mt-5">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nome</th>
                                <th scope="col">CPF</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Data empréstimo</th>
                                <th scope="col">Data devolução</th>
                                <th scope="col">Nome do livro</th>
                            </tr>
                        </thead>
                        <tbody>
        `);

    for (let i = 0; i < listaLeitor.length; i++) {
        const produto = listaLeitor[i];

        resposta.write(`
            <tr>
                <td> ${i + 1} </td>
                <td> ${produto.nome} </td>
                <td> ${produto.cpf} </td>
                <td> ${produto.cel} </td>
                <td> ${produto.emprestimo} </td>
                <td> ${produto.devolucao} </td>
                <td> ${produto.livro} </td>
            </tr>
            `);
    }
    resposta.write(`
                        </tbody>
                    </table>
                        <a href="/leitor" class="btn btn-primary"> Continuar Cadastrando </a>
                        <a href="/" class="btn btn-primary"> Voltar para o Menu </a>
                    </div>
            </body>
        </html>
        `);

    resposta.end();
});

app.get("/login", (requisicao, resposta) => {
    
    resposta.write(`
            <!DOCTYPE html>
            <html lang="en" data-bs-theme="auto">

            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="">
                <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
                <meta name="generator" content="Astro v5.13.2">
                <title>Login</title>
                <link rel="canonical" href="https://getbootstrap.com/docs/5.3/examples/sign-in/">
                <script src="/docs/5.3/assets/js/color-modes.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                <link rel="apple-touch-icon" href="/docs/5.3/assets/img/favicons/apple-touch-icon.png" sizes="180x180">
                <link rel="icon" href="/docs/5.3/assets/img/favicons/favicon-32x32.png" sizes="32x32" type="image/png">
                <link rel="icon" href="/docs/5.3/assets/img/favicons/favicon-16x16.png" sizes="16x16" type="image/png">
                <link rel="manifest" href="/docs/5.3/assets/img/favicons/manifest.json">
                <link rel="mask-icon" href="/docs/5.3/assets/img/favicons/safari-pinned-tab.svg" color="#712cf9">
                <link rel="icon" href="/docs/5.3/assets/img/favicons/favicon.ico">
                <meta name="theme-color" content="#712cf9">
                <link href="sign-in.css" rel="stylesheet">
                <style>
                    .bd-placeholder-img {
                        font-size: 1.125rem;
                        text-anchor: middle;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        user-select: none
                    }

                    @media (min-width: 768px) {
                        .bd-placeholder-img-lg {
                            font-size: 3.5rem
                        }
                    }

                    .b-example-divider {
                        width: 100%;
                        height: 3rem;
                        background-color: #0000001a;
                        border: solid rgba(0, 0, 0, .15);
                        border-width: 1px 0;
                        box-shadow: inset 0 .5em 1.5em #0000001a, inset 0 .125em .5em #00000026
                    }

                    .b-example-vr {
                        flex-shrink: 0;
                        width: 1.5rem;
                        height: 100vh
                    }

                    .bi {
                        vertical-align: -.125em;
                        fill: currentColor
                    }

                    .nav-scroller {
                        position: relative;
                        z-index: 2;
                        height: 2.75rem;
                        overflow-y: hidden
                    }

                    .nav-scroller .nav {
                        display: flex;
                        flex-wrap: nowrap;
                        padding-bottom: 1rem;
                        margin-top: -1px;
                        overflow-x: auto;
                        text-align: center;
                        white-space: nowrap;
                        -webkit-overflow-scrolling: touch
                    }

                    .btn-bd-primary {
                        --bd-violet-bg: #712cf9;
                        --bd-violet-rgb: 112.520718, 44.062154, 249.437846;
                        --bs-btn-font-weight: 600;
                        --bs-btn-color: var(--bs-white);
                        --bs-btn-bg: var(--bd-violet-bg);
                        --bs-btn-border-color: var(--bd-violet-bg);
                        --bs-btn-hover-color: var(--bs-white);
                        --bs-btn-hover-bg: #6528e0;
                        --bs-btn-hover-border-color: #6528e0;
                        --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
                        --bs-btn-active-color: var(--bs-btn-hover-color);
                        --bs-btn-active-bg: #5a23c8;
                        --bs-btn-active-border-color: #5a23c8
                    }

                    .bd-mode-toggle {
                        z-index: 1500
                    }

                    .bd-mode-toggle .bi {
                        width: 1em;
                        height: 1em
                    }

                    .bd-mode-toggle .dropdown-menu .active .bi {
                        display: block !important
                    }
                </style>
            </head>

            <body class="d-flex align-items-center py-4 bg-body-tertiary"> 
                <div class="container mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
                    <symbol id="check2" viewBox="0 0 16 16">
                        <path
                            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z">
                        </path>
                    </symbol>
                    <symbol id="circle-half" viewBox="0 0 16 16">
                         <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path>
                    </symbol>
                    <symbol id="moon-stars-fill" viewBox="0 0 16 16">
                        <path
                            d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z">
                        </path>
                        <path
                            d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z">
                        </path>
                    </symbol>
                    <symbol id="sun-fill" viewBox="0 0 16 16">
                        <path
                            d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z">
                        </path>
                    </symbol>
                </svg>
                
                <main class="form-signin w-100 m-auto">
                    <form action="/login" method="POST">
                        <h1 class="h3 mb-3 fw-normal">Faça o login</h1>
                        <div class="form-floating"> 
                            <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com"> 
                            <label for="email">Email</label> 
                        </div>
                        <br>
                        <div class="form-floating"> 
                            <input type="password" class="form-control" id="senha" name="senha" placeholder="Password"> 
                            <label for="senha">Senha</label> 
                        </div>
                        <br>
                        <button class="btn btn-primary w-100 py-2" type="submit">Login</button>
                    </form>
                </main>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
                    crossorigin="anonymous"></script>
                </div>
            </body>

            </html>
        `);

    resposta.end();
});

app.post("/login", (requisicao, resposta) => {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if(email == 'admin@teste.com.br' && senha == 'admin'){
        requisicao.session.logado = true;
        const dataUltimoAcesso = new Date();
        resposta.cookie("ultimoAcesso", dataUltimoAcesso.toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true})
        resposta.redirect('/');
    }

    else{
        resposta.write(`
            <!DOCTYPE html>
            <html lang="en" data-bs-theme="auto">

            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="">
                <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
                <meta name="generator" content="Astro v5.13.2">
                <title>Login</title>
                <link rel="canonical" href="https://getbootstrap.com/docs/5.3/examples/sign-in/">
                <script src="/docs/5.3/assets/js/color-modes.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                <link rel="apple-touch-icon" href="/docs/5.3/assets/img/favicons/apple-touch-icon.png" sizes="180x180">
                <link rel="icon" href="/docs/5.3/assets/img/favicons/favicon-32x32.png" sizes="32x32" type="image/png">
                <link rel="icon" href="/docs/5.3/assets/img/favicons/favicon-16x16.png" sizes="16x16" type="image/png">
                <link rel="manifest" href="/docs/5.3/assets/img/favicons/manifest.json">
                <link rel="mask-icon" href="/docs/5.3/assets/img/favicons/safari-pinned-tab.svg" color="#712cf9">
                <link rel="icon" href="/docs/5.3/assets/img/favicons/favicon.ico">
                <meta name="theme-color" content="#712cf9">
                <link href="sign-in.css" rel="stylesheet">
                <style>
                    .bd-placeholder-img {
                        font-size: 1.125rem;
                        text-anchor: middle;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        user-select: none
                    }

                    @media (min-width: 768px) {
                        .bd-placeholder-img-lg {
                            font-size: 3.5rem
                        }
                    }

                    .b-example-divider {
                        width: 100%;
                        height: 3rem;
                        background-color: #0000001a;
                        border: solid rgba(0, 0, 0, .15);
                        border-width: 1px 0;
                        box-shadow: inset 0 .5em 1.5em #0000001a, inset 0 .125em .5em #00000026
                    }

                    .b-example-vr {
                        flex-shrink: 0;
                        width: 1.5rem;
                        height: 100vh
                    }

                    .bi {
                        vertical-align: -.125em;
                        fill: currentColor
                    }

                    .nav-scroller {
                        position: relative;
                        z-index: 2;
                        height: 2.75rem;
                        overflow-y: hidden
                    }

                    .nav-scroller .nav {
                        display: flex;
                        flex-wrap: nowrap;
                        padding-bottom: 1rem;
                        margin-top: -1px;
                        overflow-x: auto;
                        text-align: center;
                        white-space: nowrap;
                        -webkit-overflow-scrolling: touch
                    }

                    .btn-bd-primary {
                        --bd-violet-bg: #712cf9;
                        --bd-violet-rgb: 112.520718, 44.062154, 249.437846;
                        --bs-btn-font-weight: 600;
                        --bs-btn-color: var(--bs-white);
                        --bs-btn-bg: var(--bd-violet-bg);
                        --bs-btn-border-color: var(--bd-violet-bg);
                        --bs-btn-hover-color: var(--bs-white);
                        --bs-btn-hover-bg: #6528e0;
                        --bs-btn-hover-border-color: #6528e0;
                        --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
                        --bs-btn-active-color: var(--bs-btn-hover-color);
                        --bs-btn-active-bg: #5a23c8;
                        --bs-btn-active-border-color: #5a23c8
                    }

                    .bd-mode-toggle {
                        z-index: 1500
                    }

                    .bd-mode-toggle .bi {
                        width: 1em;
                        height: 1em
                    }

                    .bd-mode-toggle .dropdown-menu .active .bi {
                        display: block !important
                    }
                </style>
            </head>

            <body class="d-flex align-items-center py-4 bg-body-tertiary"> 
                <div class="container mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
                    <symbol id="check2" viewBox="0 0 16 16">
                        <path
                            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z">
                        </path>
                    </symbol>
                    <symbol id="circle-half" viewBox="0 0 16 16">
                         <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"></path>
                    </symbol>
                    <symbol id="moon-stars-fill" viewBox="0 0 16 16">
                        <path
                            d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z">
                        </path>
                        <path
                            d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z">
                        </path>
                    </symbol>
                    <symbol id="sun-fill" viewBox="0 0 16 16">
                        <path
                            d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z">
                        </path>
                    </symbol>
                </svg>
                
                <main class="form-signin w-100 m-auto">
                    <form action="/login" method="POST">
                        <h1 class="h3 mb-3 fw-normal">Faça o login</h1>
                        <div class="form-floating"> 
                            <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com"> 
                            <label for="email">Email</label> 
                        </div>
                        <br>
                        <div class="form-floating"> 
                            <input type="password" class="form-control" id="senha" name="senha" placeholder="Password"> 
                            <label for="senha">Senha</label> 
                        </div>
                        <br>
                        <span>
                            <p class="text-danger">Email ou senha inválidos! </p>
                        </span>
                        <button class="btn btn-primary w-100 py-2" type="submit">Login</button>
                    </form>
                </main>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
                    crossorigin="anonymous"></script>
                </div>
            </body>

            </html>
        `);

    resposta.end();
    }

});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});

function estaAutenticado(requisicao, resposta, proximo){
    if(requisicao.session?.logado){
        proximo();
    }
    else{
        resposta.redirect('/login');
    }
}

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});