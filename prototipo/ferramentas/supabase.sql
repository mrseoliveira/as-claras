-- Às Claras: tabela de eventos para o Supabase.
-- Correr uma vez no SQL Editor do projeto (região UE, ex.: Frankfurt).
-- Com a chave pública só se pode INSERIR. Ler, alterar e apagar só no painel do Supabase
-- ou com a chave de serviço, que nunca vai para o código do jogo.

create table if not exists public.eventos (
  id          bigint generated always as identity primary key,
  recebido_em timestamptz not null default now(),
  sessao      uuid        not null,                 -- aleatória, nova em cada visita
  codigo      text        check (char_length(codigo) <= 40),   -- código anónimo escolhido pela pessoa (opcional)
  versao      text        check (char_length(versao) <= 60),
  cenario     text        check (char_length(cenario) <= 20),
  partida     int,                                  -- n.º da partida nesta sessão
  ordem       int         not null,                 -- ordem do evento dentro da sessão
  tipo        text        not null check (char_length(tipo) <= 30),
  momento     timestamptz not null,                 -- hora do navegador
  dados       jsonb       not null default '{}'::jsonb check (pg_column_size(dados) < 16000)
);

create index if not exists eventos_sessao_ordem on public.eventos (sessao, ordem);
create index if not exists eventos_tipo on public.eventos (tipo);

alter table public.eventos enable row level security;

-- Só inserir, para quem usa a chave pública.
drop policy if exists "inserir anonimo" on public.eventos;
create policy "inserir anonimo" on public.eventos
  for insert to anon
  with check (true);

-- Sem políticas de select, update ou delete: com a chave pública ninguém lê nem apaga.
revoke select, update, delete on public.eventos from anon, authenticated;

-- Para analisar (no SQL Editor): uma linha por escolha, com a latência.
create or replace view public.escolhas as
select sessao, codigo, cenario, partida, ordem, momento,
       dados->>'no'       as no,
       dados->>'texto'    as texto,
       dados->>'postura'  as postura,
       (dados->>'eu')::int    as raiva_eu,
       (dados->>'outro')::int as raiva_outro,
       (dados->>'ms')::int    as ms
from public.eventos
where tipo = 'opcao';
revoke all on public.escolhas from anon, authenticated;
