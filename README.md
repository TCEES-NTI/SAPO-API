# S.A.P.O

## Instalação

Configurações:

keys.js: contém chaves e informações referentes as conexões com o banco e chave para criptografia das sessões dos usuários.
settings.json: contém uma flag para difinir se o banco será ou não populado novamente com os dados padrões do sistema.

### Local

1- `git clone https://github.com/TCEES-NTI/SAPO-API.git`

2- `cd <NOME-DO-DIRETORIO-DA-API>`

3- `npm install`

4- `npm start` - Para testes locais.

### Zeit NOW

[Zeit NOW](https://zeit.co/now) é um serviço de hospedagem gratuito de serviços NodeJS de maneira simplificada. Fazer deploy nessa solução é simplíssimo só existe o 
problema do plano gratuito ter o código aberto apenas adicionando /_src ao final da URL.

1- `npm i -g now`

2- `git clone https://github.com/TCEES-NTI/SAPO-API.git`

3- `cd <NOME-DO-DIRETORIO-DA-API>`

4- `npm install`

5- `now` - Será pedido um email e a ativação da conta por este email, posteriormente a isso será lhe dado o endereço da nova API.

### AWS Lambda

É possível fazer o deploy da solução na Amazon utilizando também funções lambda (Serviço ofertado pela AWS). Fazer o deploy da API utilizando essa solução tem como 
vantagens a alta escalabilidade e o baixo custo para manutenção da mesma.

Observações:
1- É necessário ter uma conta na AWS ativa. (É seguro.. eu garanto!)

2- A função responsável pela nossa API deve ter:

2.1- No mínimo 256mb de RAM para funcionar sem travar.

2.2- Ao menos 512mb de RAM para funcionar razoavelmente bem.

2.3- 20 segundos de timeout para garantia dos endpoints mais complexos.

3- O guia de instalação apresentado é referente a uma maquina rodando Ubuntu, caso esteja utilizando outro SO por favor procure os comandos no respectivo sistema.

4- Considera-se que o usuário tem instalado NodeJS na maquina de instalação.

Fazendo deploy da API usando AWS Lambda functions:
1- `export AWS_ACCESS_KEY_ID=<KEY_ID>`

2- `export AWS_SECRET_ACCESS_KEY=<KEY>`

3- `cd <NOME-DO-DIRETORIO-DA-API>`

4- `npm install`

5- `npm start` - Para testes locais.

6- `npm run create-deploy` - Após o termino dessa etapa irá aparecer no console o endereço da sua API recém deployada.

7- Navegar no [painel da AWS](https://console.aws.amazon.com).

8- Entrar no painel gerencial das funções Lambda e escolher a função recém implementada.

9- Selecionar a aba Configuration e em seguida clicar em "Advanced Settings"

10- Alterar os valores de memória e timeout conforme suas necessidades (Atenção ao item 2 das observações.)

## Uso

## API

## Contribuições

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
