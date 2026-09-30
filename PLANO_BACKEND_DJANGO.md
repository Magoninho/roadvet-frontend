# Plano de Implementação do Backend Django para o RoadVet

## 1. Contexto do projeto

O RoadVet é um aplicativo Expo (React Native, SDK 57) para atendimento veterinário, projetado como offline-first. Todo o cadastro de tutores, pets, prontuários e anexos é feito localmente em um banco SQLite gerenciado pelo WatermelonDB, sem depender de conexão com a internet. O backend a ser construído em Django não é a fonte primária de verdade no momento do uso: ele existe para permitir que os dados criados em um dispositivo cheguem a outros dispositivos (do mesmo veterinário ou de uma equipe) através de sincronização periódica.

Hoje o aplicativo funciona inteiramente sem backend. Cadastro de veterinário, login, tutores, pets, prontuários e anexos são gravados apenas no SQLite local. Existe apenas um esqueleto de sincronização no cliente (`src/database/sync`), já preparado para conversar com uma API que ainda não existe. Este documento descreve exatamente o que essa API precisa fazer.

## 2. Stack recomendada para o backend

1. Django 5.x com Django REST Framework para os endpoints HTTP.
2. PostgreSQL como banco relacional (necessário suporte a transações e índices; SQLite não é recomendado em produção para o servidor).
3. djangorestframework-simplejwt para emissão de tokens JWT (access e refresh), consumidos pelo aplicativo como Bearer token.
4. Armazenamento de arquivos (anexos de prontuário) em um bucket compatível com S3 (AWS S3, Cloudflare R2 ou MinIO), usando django-storages.

## 3. Estado atual do cliente WatermelonDB

Estes são os fatos do código-fonte do aplicativo que determinam o contrato da API. O engenheiro backend deve tratá-los como requisitos fixos, não como sugestões.

1. Versão do schema local: 3 (`src/database/schema.ts`). Há duas migrações registradas em `src/database/migrations.ts`, aplicadas automaticamente pelo WatermelonDB nos dispositivos com versão anterior: a da versão 1 para 2 (`veterinario_id` em `tutores`) e a da versão 2 para 3 (`vaccines` em `prontuarios`).
2. Os identificadores (`id`) de todos os registros são gerados no próprio dispositivo pelo WatermelonDB (strings curtas, alfanuméricas). O backend nunca deve gerar um id novo para um registro sincronizado nem usar chave primária autoincremental. O `id` recebido do cliente é a chave primária no banco do servidor.
3. Os campos `created_at` e `updated_at` existem em todas as tabelas, são somente leitura no cliente (`@readonly`) e trafegam como número inteiro de milissegundos desde a época Unix, nunca como texto ISO 8601.
4. A engine de sincronização do cliente (`src/database/sync/engine.ts`) chama `synchronize()` da biblioteca WatermelonDB com a opção `sendCreatedAsUpdated: true`. Isso significa que, na prática, o backend deve tratar os buckets `created` e `updated` do push da mesma forma: como um upsert por id. Não é seguro assumir que um registro em `created` ainda não existe no servidor, porque reenvios após falha de rede recolocam o mesmo registro nesse fluxo.
5. Exclusões são feitas com `markAsDeleted()` e são propagadas em cascata manualmente no próprio cliente (`src/database/repositories/cascade.ts`). Ao excluir um tutor, o código já marca como excluído cada pet, cada prontuário de cada pet e cada anexo de cada prontuário, individualmente. Ou seja, o push de sincronização já chega ao backend com um id de exclusão por tabela para cada registro afetado. O backend não precisa reimplementar a cascata, apenas processar a lista de ids excluídos de cada tabela.
6. O login e o cadastro de veterinário hoje são cem por cento locais (`src/contexts/AuthContext.tsx`). A senha é hasheada no dispositivo com SHA-256 mais salt aleatório (`src/database/repositories/password.ts`) e o hash resultante é gravado na própria coluna `senha_hash`, que faz parte do schema sincronizado. Isso tem uma implicação importante detalhada na seção 7.
7. Os anexos de prontuário (`AnexoProntuario`) hoje guardam em `uri` um caminho de arquivo local do dispositivo (`src/database/repositories/attachments.ts` copia o arquivo para o diretório de documentos do app). Esse caminho não tem significado nenhum em outro dispositivo. A seção 8 descreve o que o backend precisa expor para isso funcionar entre dispositivos.
8. O cliente já está preparado para o endpoint `/sync` (ver `.env.example`, variável `EXPO_PUBLIC_API_URL`, e `src/database/sync/api.ts`), mas nenhuma variável de ambiente aponta ainda para um backend real.
9. Desde a migração para a versão 2 do schema, `tutores` já carrega `veterinario_id`, gravado pelo cliente no momento da criação (`src/database/repositories/tutores.ts`), e todas as telas do aplicativo (tutores, pets, prontuários e a seleção de pet ao criar um prontuário) já leem os dados filtrados pelo veterinário autenticado. A regra de posse completa está detalhada na seção 6.

## 4. Modelos de dados e relacionamentos

Cada tabela abaixo corresponde exatamente a uma tabela do WatermelonDB (`src/database/schema.ts`) e deve virar um modelo Django com o mesmo nome de tabela (`db_table`) e os mesmos nomes de coluna, para que a serialização da sincronização seja uma cópia direta dos campos, sem tradução de nomes.

Todos os modelos compartilham uma base comum. Recomenda-se um modelo abstrato `SyncableModel` com os seguintes campos:

1. `id`: CharField, chave primária, tamanho máximo 32, não gerado automaticamente pelo Django, sempre recebido do cliente.
2. `created_at`: BigIntegerField, milissegundos Unix.
3. `updated_at`: BigIntegerField, milissegundos Unix.
4. `deleted_at`: BigIntegerField, nulo, indexado. Este campo não existe no schema do cliente e nunca deve ser serializado de volta para o cliente. Ele é a tombstone (marca de exclusão) usada internamente pelo backend para responder corretamente ao pull de sincronização, conforme seção 5.4.

### 4.1 Veterinario (tabela `veterinarios`)

1. `nome`: CharField.
2. `crmv`: CharField, nulo.
3. `email`: EmailField, único, indexado.
4. `senha_hash`: CharField. Campo opaco vindo do cliente, apenas armazenado e devolvido na sincronização. Não deve ser usado pelo backend para autenticar ninguém (ver seção 7).
5. `telefone`: CharField, nulo.

Relacionamento: um veterinário possui muitos prontuários (`prontuarios.veterinario_id`).

### 4.2 Tutor (tabela `tutores`)

1. `veterinario`: ForeignKey para Veterinario, coluna `veterinario_id`, indexado. Campo de posse: identifica a qual conta de veterinário aquele tutor pertence. Já existe no schema do cliente desde a versão 2 (seção 3, item 9).
2. `nome_completo`: CharField.
3. `cpf`: CharField, indexado.
4. `data_nascimento`: BigIntegerField, nulo (milissegundos).
5. `email`: EmailField, nulo, indexado.
6. `cep`, `endereco`, `numero`, `bairro`, `complemento`, `cidade`, `uf`: CharField, todos nulos.
7. `telefone1`, `telefone2`: CharField, nulos.
8. `avatar_url`: CharField, nulo.

Relacionamento: um tutor pertence a um veterinário (dono do cadastro) e possui muitos pets (`pets.tutor_id`).

### 4.3 Pet (tabela `pets`)

1. `tutor`: ForeignKey para Tutor, coluna `tutor_id`, indexado.
2. `nome`: CharField.
3. `data_nascimento`: BigIntegerField, nulo.
4. `peso`: CharField, nulo (o cliente trata peso como texto livre, não como número).
5. `especie`: CharField.
6. `raca`: CharField, nulo.
7. `avatar_url`: CharField, nulo.

Relacionamento: um pet pertence a um tutor e possui muitos prontuários (`prontuarios.pet_id`).

### 4.4 Prontuario (tabela `prontuarios`)

1. `pet`: ForeignKey para Pet, coluna `pet_id`, indexado.
2. `veterinario`: ForeignKey para Veterinario, coluna `veterinario_id`, indexado.
3. `date`: BigIntegerField (data da consulta, milissegundos).
4. `weight`, `temperature`, `heart_rate`: CharField, nulos (valores do exame físico, texto livre).
5. `anamnesis`, `physical_exam`, `prescription`, `vaccines`, `exam_request_notes`, `exam_results_notes`: TextField, nulos. `vaccines` (vacinas aplicadas, texto livre) existe no cliente desde a versão 3 do schema.

Relacionamento: um prontuário pertence a um pet e a um veterinário, e possui muitos anexos (`anexos_prontuario.prontuario_id`).

### 4.5 AnexoProntuario (tabela `anexos_prontuario`)

1. `prontuario`: ForeignKey para Prontuario, coluna `prontuario_id`, indexado.
2. `file_type`: CharField com choices `request` e `result` (pedido de exame ou resultado de exame).
3. `file_name`: CharField.
4. `uri`: CharField. No cliente, hoje é um caminho de arquivo local. No backend, deve ser a URL do arquivo já enviado ao armazenamento de objetos (ver seção 8).
5. `mime_type`: CharField, nulo.

Relacionamento: um anexo pertence a um prontuário.

### 4.6 Ordem de dependência entre tabelas

Para aplicar criações e atualizações vindas do push sem violar chave estrangeira, processe as tabelas nesta ordem: `veterinarios`, depois `tutores`, depois `pets`, depois `prontuarios`, depois `anexos_prontuario`. Para exclusões (soft delete), a ordem não importa, pois marcar `deleted_at` não remove a linha nem quebra a integridade referencial.

## 5. Protocolo de sincronização

O WatermelonDB define um contrato fixo de sincronização, documentado em https://watermelondb.dev/docs/Sync/Backend, versão em uso: `@nozbe/watermelondb ^0.28.0`. O cliente já implementa a metade dele (`src/database/sync/api.ts`), apontando para um único endpoint `/sync` com verbos GET (pull) e POST (push). O backend deve implementar exatamente este contrato.

### 5.1 Pull: GET /api/sync

Parâmetros de query recebidos do cliente:

1. `last_pulled_at`: inteiro em milissegundos, ausente na primeira sincronização de um dispositivo.
2. `schema_version`: inteiro, hoje sempre 3 (seção 3, item 1).
3. `migration`: JSON opcional, usado apenas quando o cliente detecta que sua versão de schema mudou desde o último pull. Nenhum dispositivo em campo ainda sincronizou pela versão 1, então este parâmetro pode continuar sendo ignorado por enquanto, mas deve ser aceito sem erro.

Resposta esperada, formato JSON:

1. `changes`: objeto com uma chave por tabela (`veterinarios`, `tutores`, `pets`, `prontuarios`, `anexos_prontuario`). Cada valor é um objeto com três listas: `created`, `updated` e `deleted`. Os dois primeiros contêm objetos completos do registro (todos os campos do schema, exceto `deleted_at`). O terceiro contém apenas ids, como lista de strings.
2. `timestamp`: inteiro em milissegundos, o instante do servidor no momento da consulta. O cliente vai devolver esse número como `last_pulled_at` na próxima chamada, então ele precisa ser capturado antes de rodar as queries, nunca calculado a partir do maior `updated_at` encontrado nos resultados.

Antes de qualquer regra de data, toda query desta seção já parte restrita ao veterinário autenticado na requisição, conforme seção 6: `tutores` filtrado por `veterinario_id`, `pets` filtrado por `tutor__veterinario_id`, `prontuarios` filtrado por `pet__tutor__veterinario_id`, `anexos_prontuario` filtrado por `prontuario__pet__tutor__veterinario_id`, e `veterinarios` restrito ao próprio registro do usuário autenticado.

Regra de seleção de registros por tabela, dado um `last_pulled_at` (chamado aqui de `desde`):

1. Vai para `created` todo registro não excluído cujo `created_at` seja maior que `desde` (ou todo registro não excluído, se `desde` estiver ausente, ou seja, primeira sincronização do dispositivo).
2. Vai para `updated` todo registro não excluído cujo `updated_at` seja maior que `desde` e cujo `created_at` seja menor ou igual a `desde` (evita duplicar na resposta um registro que já foi enviado como `created`).
3. Vai para `deleted` todo id cujo `deleted_at` seja maior que `desde`. Na primeira sincronização (`desde` ausente), esta lista deve vir sempre vazia, pois o dispositivo não tem nada localmente para excluir ainda.

### 5.2 Push: POST /api/sync

Parâmetro de query: `last_pulled_at`, o mesmo valor que o cliente recebeu no último pull.

Corpo da requisição: `changes`, no mesmo formato descrito acima, mas vindo do cliente para o servidor.

Processamento, dentro de uma única transação atômica:

1. Para cada tabela, na ordem da seção 4.6, para cada registro em `created` e em `updated`: fazer upsert por `id` (`update_or_create`), gravando todos os campos recebidos, incluindo `created_at` e `updated_at` tais quais vieram do cliente. Não usar `auto_now_add` nem `auto_now` do Django nestes campos, pois eles são controlados pelo cliente.
2. Validar posse antes de gravar, conforme a regra da seção 6: em `tutores`, ignorar ou rejeitar qualquer `veterinario_id` do payload que não seja o do usuário autenticado, gravando sempre o id do próprio usuário autenticado, nunca confiando no valor enviado pelo cliente. Em `pets`, `prontuarios` e `anexos_prontuario`, verificar que o registro pai referenciado (`tutor_id`, `pet_id`, `prontuario_id`, respectivamente) já pertence, pela cadeia de posse, ao veterinário autenticado, e rejeitar o registro com erro caso não pertença.
3. Para cada tabela, para cada id em `deleted`: gravar `deleted_at` com o instante atual do servidor (não confiar em um timestamp de exclusão vindo do cliente, pois ele não existe no schema atual), e só aplicar a exclusão se o registro já pertencer, pela mesma cadeia de posse, ao veterinário autenticado.
4. Se qualquer etapa falhar, reverter a transação inteira e devolver erro HTTP, para que o cliente reenvie o mesmo push depois.

Resposta esperada em caso de sucesso: HTTP 200 com corpo vazio ou `{}`. O cliente não espera nenhum dado de volta no push.

### 5.3 Conflitos entre dispositivos

Para a primeira versão do backend, adotar resolução por último a escrever vence (last-write-wins): o upsert do push sempre sobrescreve o estado atual do servidor, sem comparar `updated_at` contra o que já está salvo. Isso é suficiente porque, hoje, cada prontuário pertence a um único veterinário autor e não há edição concorrente esperada do mesmo registro por dois dispositivos ao mesmo tempo. Caso o produto passe a permitir que duas pessoas editem o mesmo prontuário, revisar esta regra é uma pendência registrada na seção 10.

### 5.4 Por que soft delete é obrigatório no servidor

O cliente apaga a linha de fato do SQLite local depois de processar a exclusão. O servidor não pode fazer o mesmo, porque outros dispositivos que ainda não passaram por essa sincronização precisam receber o id excluído na lista `deleted` de um pull futuro. Se o servidor apagar a linha imediatamente, não há como responder "isto foi excluído" para quem perguntar depois, apenas "isto nunca existiu", e o dado voltaria a aparecer como órfão no dispositivo que ainda não sincronizou. Por isso todo modelo tem `deleted_at` e todo filtro de leitura do backend deve excluir registros com `deleted_at` preenchido. A purga física de registros antigos marcados como excluídos pode ser feita por uma rotina periódica (por exemplo, depois de 90 dias), desde que se tenha razoável certeza de que todos os dispositivos já sincronizaram depois da exclusão.

## 6. Escopo dos dados entre veterinários

O RoadVet é feito para o veterinário autônomo que atende a domicílio. A conta de cada veterinário é a fronteira de posse dos dados: os tutores, pets e prontuários cadastrados por um veterinário pertencem exclusivamente a ele. Não existe uma base compartilhada entre veterinários diferentes, nem conceito de clínica ou equipe.

Isso implica a seguinte regra de posse, obrigatória em todo o backend:

1. Todo `Tutor` pertence a exatamente um `Veterinario`, o dono do cadastro (coluna `veterinario_id` em `tutores`, seção 4.2).
2. `Pet` herda a posse do seu `Tutor` (via `tutor_id`). Não é necessário duplicar `veterinario_id` na tabela `pets`.
3. `Prontuario` e `AnexoProntuario` herdam a posse por meio da cadeia `anexo -> prontuario -> pet -> tutor -> veterinario`. O `veterinario_id` já presente em `prontuarios` identifica o autor daquele atendimento específico, que na prática coincide com o dono do tutor, já que apenas o próprio veterinário cria registros para os seus tutores.
4. Toda query de leitura do backend (pull de sincronização e qualquer outro endpoint) deve ser filtrada pelo veterinário autenticado na requisição, em cada uma dessas quatro tabelas. Nenhum veterinário deve conseguir ler ou escrever dado de posse de outro.
5. O pull da tabela `veterinarios` (seção 5.1) deve devolver apenas o próprio registro do veterinário autenticado, nunca a lista completa de veterinários cadastrados no backend, para não vazar e-mail, telefone e hash de senha de outros profissionais para um dispositivo que não é deles.

Esta regra já está implementada no cliente. A coluna `veterinario_id` foi adicionada à tabela `tutores` por uma migração de schema (versão 1 para 2, `src/database/migrations.ts`), o modelo `Tutor.ts` expõe `veterinarioId` e a relação `belongs_to` com `Veterinario`, e `src/database/repositories/tutores.ts` grava o id do veterinário autenticado no momento da criação. As telas que antes liam todos os registros do banco local sem filtro (`observeAllPets` na aba Pets e na seleção de pet ao criar prontuário, `observeAllProntuarios` na aba Prontuários) foram corrigidas para usar `observePetsByVeterinario` e `observeProntuariosByVeterinario`, ambas escopadas pelo veterinário autenticado; as duas funções globais sem filtro foram removidas do código por representarem risco de vazamento entre contas. O backend deve aplicar o mesmo filtro do lado do servidor descrito nesta seção; não há mais nenhuma pendência do lado do cliente para a regra de posse.

## 7. Autenticação

Hoje o cliente não chama nenhum endpoint de autenticação. O cadastro e o login de veterinário acontecem inteiramente dentro do SQLite local, e a coluna `senha_hash` sincronizada é apenas um hash SHA-256 com salt gerado no próprio dispositivo, sem nenhum controle de força de algoritmo comparável ao hasher padrão do Django. Usar esse hash como credencial de autenticação do backend não é seguro nem resolve o problema de login em um segundo dispositivo, porque um dispositivo novo começa com o banco local vazio e não tem como calcular ou validar nada antes da primeira sincronização.

Por isso, o backend precisa de seu próprio sistema de autenticação, independente da coluna `senha_hash` sincronizada:

1. Tornar `Veterinario` o modelo de usuário do Django (`AUTH_USER_MODEL`), herdando de `AbstractBaseUser` e `PermissionsMixin`, mantendo `id` como CharField de chave primária (sobrescrevendo o padrão do Django) e `email` como `USERNAME_FIELD`. Isso preserva a compatibilidade de `id` com o valor gerado pelo cliente.
2. Usar o campo `password` herdado de `AbstractBaseUser` (hasheado pelo próprio Django, com PBKDF2 ou Argon2) como a credencial real de autenticação. O campo `senha_hash` continua existindo separadamente, apenas para transitar pela sincronização sem uso no backend.
3. Expor `POST /api/auth/register`, recebendo `id` (o mesmo id gerado localmente pelo WatermelonDB para o registro do veterinário), `nome`, `crmv`, `email`, `telefone` e `senha` em texto plano (sob HTTPS). O endpoint cria o usuário com `set_password(senha)` e devolve um par de tokens JWT (access e refresh).
4. Expor `POST /api/auth/login`, recebendo `email` e `senha`, devolvendo o mesmo par de tokens em caso de sucesso.
5. Exigir o header `Authorization: Bearer <access token>` em `/api/sync` e em qualquer outro endpoint autenticado, validado via SimpleJWT.

Este ponto exige uma mudança correspondente no aplicativo, que hoje não chama `/api/auth/register` nem `/api/auth/login` em nenhum lugar (`src/contexts/AuthContext.tsx` só grava localmente, e `src/services/auth/tokenStore.ts` já tem `setAuthToken` pronto para receber um token, mas nada o preenche ainda). Esse ajuste no cliente está fora do escopo deste documento, mas o contrato acima é o que o time de frontend vai precisar consumir, e está registrado como pendência na seção 10.

## 8. Anexos de prontuário

O campo `uri` de `AnexoProntuario` hoje é um caminho de arquivo local, sem sentido fora do dispositivo que criou o anexo. Para que um anexo enviado em um dispositivo seja visível em outro, o backend precisa expor upload de arquivo binário, e não apenas o registro de metadados via `/api/sync`.

Fluxo recomendado:

1. O registro de metadados do anexo (`file_type`, `file_name`, `mime_type`, e inicialmente `uri` com o caminho local) continua indo pelo push normal de `/api/sync`, como qualquer outra tabela.
2. Expor `POST /api/anexos/{id}/upload`, recebendo o arquivo binário como multipart form data, autenticado, validando que o `id` do anexo já existe (ou seja, o metadado precisa ter sido sincronizado antes do upload do arquivo).
3. O backend grava o arquivo no armazenamento de objetos configurado e atualiza a coluna `uri` daquele registro para a URL definitiva.
4. Em um pull subsequente, o dispositivo que originou o anexo (e qualquer outro dispositivo) recebe o registro atualizado de `anexos_prontuario` com a `uri` já apontando para a URL remota.

O disparo desse upload a partir do aplicativo (detectar que um anexo tem uma `uri` local e enviá-la separadamente) é uma mudança de cliente que também está fora do escopo deste documento, mas o endpoint acima é o contrato que o frontend vai consumir.

## 9. Endpoints da API, resumo

1. `POST /api/auth/register`: cria veterinário e devolve tokens JWT.
2. `POST /api/auth/login`: autentica veterinário e devolve tokens JWT.
3. `POST /api/auth/refresh`: renova o access token a partir do refresh token (padrão SimpleJWT).
4. `GET /api/sync`: pull de sincronização, autenticado.
5. `POST /api/sync`: push de sincronização, autenticado.
6. `POST /api/anexos/{id}/upload`: upload do arquivo binário de um anexo já sincronizado, autenticado.

## 10. Pendências e decisões que dependem do time, não apenas do backend

1. Alinhamento de autenticação com o frontend: o aplicativo hoje não chama nenhum endpoint HTTP de login ou cadastro. A seção 7 depende de uma mudança no cliente para de fato acontecer.
2. Fluxo de upload de anexos: a seção 8 depende de uma mudança no cliente para disparar o upload do arquivo após a criação do registro de metadados.
3. Retenção de tombstones: definir por quanto tempo manter registros com `deleted_at` preenchido antes de uma purga física, considerando a frequência esperada de sincronização dos dispositivos em campo.
4. Migrações de schema futuras: o parâmetro `migration` do pull (seção 5.1) continua dispensável na versão 3, pois ela só acrescenta a coluna opcional `vaccines`, sem dado histórico a reenviar; ele passa a exigir implementação real quando uma migração futura depender de reenviar registros já sincronizados.

## 11. Ordem sugerida de implementação

1. Modelos Django da seção 4, com `id` como CharField de chave primária, `deleted_at` em todos, e `veterinario_id` em `tutores` (o cliente já envia esse campo desde a migração de schema descrita na seção 3, item 9).
2. Autenticação JWT (seção 7), incluindo tornar `Veterinario` o modelo de usuário.
3. Endpoint de pull (seção 5.1), já com o filtro de posse por veterinário autenticado da seção 6.
4. Endpoint de push (seção 5.2), com upsert, soft delete e validação de posse.
5. Testes de round-trip: criar registros locais no aplicativo com duas contas de veterinário diferentes, sincronizar cada uma, apagar o banco local dos dispositivos, sincronizar de novo, e confirmar que cada conta só recebe pelo pull os próprios tutores, pets e prontuários.
6. Endpoint de upload de anexos (seção 8).
7. Ajustes correspondentes no cliente Expo para consumir autenticação e upload, coordenados com o time de frontend.
