# 1. Visão Geral

## Problema

Empresas possuem documentos que mudam constantemente. Um sistema RAG (Retrieval-Augmented Generation) tradicional, sem orientação a eventos, pode responder com base em um índice vetorial desatualizado. Quando um usuário edita um documento, o índice de embeddings pode levar minutos ou horas para refletir a alteração — ou nunca ser atualizado, dependendo da arquitetura. Isso resulta em respostas da IA baseadas em informações obsoletas ou, pior, em "alucinações" quando o modelo inventa dados que não existem no contexto atual.

## Solução

Este projeto implementa um sistema que utiliza eventos `document.updated` para manter um índice vetorial sempre em sincronia com as alterações dos documentos. Toda vez que um documento é criado ou editado, a API persiste os dados e publica um evento em uma fila de mensagens. Um serviço indexador consome esses eventos de forma assíncrona, gera embeddings do conteúdo e atualiza o banco vetorial. Assim, o Query Service sempre recupera os trechos mais relevantes e atualizados para responder às perguntas dos usuários.

## Objetivo Técnico

Praticar arquitetura orientada a eventos (EDA) com RabbitMQ, TypeScript, Redis Vector Search ou Postgres+pgvector, e preparar o terreno para CI/CD em serviços de IA. O MVP visa demonstrar um fluxo completo: criação de documento → evento → indexação → busca semântica → resposta contextualizada.
