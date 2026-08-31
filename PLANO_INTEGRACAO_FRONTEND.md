# Plano de Integração do Cliente Expo com o Backend Django

Este documento complementa `PLANO_BACKEND_DJANGO.md`. Enquanto aquele descreve o que o backend precisa expor, este descreve o que precisa mudar no próprio aplicativo Expo depois que o backend estiver pronto, já que hoje o app funciona cem por cento local e não chama nenhum endpoint remoto.

## 1. Escopo de dados por veterinário, já implementado no cliente

Diferente das demais seções deste documento, este item já está concluído e serve apenas de registro. O RoadVet é feito para o veterinário autônomo, e cada tutor, pet e prontuário deve pertencer exclusivamente à conta que o cadastrou, sem base compartilhada entre veterinários. Essa regra foi implementada em três frentes:

1. Migração de schema (versão 1 para 2, `src/database/migrations.ts`) adicionando `veterinario_id` à tabela `tutores`, e o campo correspondente em `src/database/models/Tutor.ts`, com relação `belongs_to` para `Veterinario`.
2. `src/database/repositories/tutores.ts` grava o id do veterinário autenticado na criação do tutor, e `observeTutores`/`observeTutoresWhereNome` passaram a exigir esse id e filtrar por ele. `TutorForm.tsx`, a aba Tutores e o autocomplete de tutor em `PetForm.tsx` foram ajustados para obter o veterinário logado via `useAuth()` e repassá-lo.
3. Um teste manual com duas contas revelou que a aba Pets, a tela de seleção de pet ao criar um prontuário e a aba Prontuários ainda usavam `observeAllPets()` e `observeAllProntuarios()`, funções que liam todos os registros do banco local sem filtro nenhum. Essas duas funções foram removidas de `src/database/repositories/pets.ts` e `prontuarios.ts` e substituídas por `observePetsByVeterinario` (join até `tutores.veterinario_id`) e pela já existente `observeProntuariosByVeterinario`, ambas escopadas pelo veterinário autenticado.

O contrato descrito na seção 6 de `PLANO_BACKEND_DJANGO.md` (posse por veterinário, filtro obrigatório em toda leitura) depende do backend replicar essa mesma regra do lado do servidor: o cliente já envia `veterinario_id` em `tutores`, mas cabe à API rejeitar ou ignorar qualquer tentativa de leitura ou escrita fora da posse do usuário autenticado.

## 2. Apontar o cliente para o backend

Definir `EXPO_PUBLIC_API_URL` (hoje documentada apenas em `.env.example`) com a URL real do backend, uma por perfil de build (desenvolvimento, homologação, produção). `src/database/sync/api.ts` lança um erro se essa variável não existir, então a sincronização continua quebrada até isso ser configurado.

## 3. Substituir a autenticação local por chamadas reais

`src/contexts/AuthContext.tsx` hoje nunca fala com um servidor. As funções `login()` e `register()` precisam passar a chamar, respectivamente, `POST /api/auth/login` e `POST /api/auth/register` do backend (contrato descrito na seção 7 de `PLANO_BACKEND_DJANGO.md`), e gravar os tokens recebidos com `setAuthToken()`, em `src/services/auth/tokenStore.ts`, função que já existe mas que hoje nada chama.

## 4. Tratar o cadastro feito offline

Um veterinário pode se cadastrar sem conexão, e o id usado no registro de `Veterinario` já é gerado localmente pelo WatermelonDB antes de qualquer chamada ao backend. É preciso decidir explicitamente um dos dois comportamentos:

1. Cadastro exige conectividade: `register()` só conclui com sucesso depois que o backend confirmar a criação da conta.
2. Cadastro funciona offline: o registro local é criado normalmente e a criação da conta no backend é adiada para a próxima sincronização bem-sucedida, com `login()` caindo de volta para a verificação local por `senha_hash` enquanto o backend estiver inacessível.

Esta é uma decisão de produto, não apenas um detalhe de implementação.

## 5. Adicionar suporte a refresh token

`tokenStore.ts` hoje armazena um único token. O SimpleJWT do backend emite um par (access e refresh), então o armazenamento e `apiRequest()` em `src/services/api/client.ts` precisam guardar os dois, renovar o access token automaticamente diante de um HTTP 401, e forçar logout quando o próprio refresh token for rejeitado.

## 6. Disparar o upload de anexos

`AnexoProntuario.uri` hoje guarda um caminho de arquivo local. Depois que o registro de metadados for sincronizado, o cliente precisa de uma rotina separada que envie o arquivo para `POST /api/anexos/{id}/upload` assim que houver conectividade, independente do ciclo principal de `synchronize()` em `src/database/sync/engine.ts`.

## 7. Revisar as condições de disparo da sincronização

`useSyncEngine`, chamado em `src/app/_layout.tsx`, já está configurado para rodar sempre que houver um veterinário logado, sem necessidade de alteração nesse ponto. Hoje os erros são silenciados (`.catch(() => {})`) além do que `useSyncStatus` e `SyncDot` já expõem. Vale revisar se uma falha de autenticação real (token expirado) precisa ficar visualmente distinta de uma falha comum por falta de conexão.

## 8. Testar o ciclo completo em dois dispositivos

Criar dados em um dispositivo A, sincronizar, confirmar que aparecem no dispositivo B após login e sincronização, depois excluir em A e confirmar que a exclusão (tombstone) remove o registro em B. Repetir com duas contas de veterinário diferentes para confirmar que nenhum dado atravessa de uma conta para a outra, tanto localmente (seção 1) quanto pela sincronização.

## 9. Configuração de CORS para build web

Caso o build web do Expo esteja no escopo, confirmar que o CORS do Django está configurado para aceitar a origem do aplicativo.
