#!/bin/bash
set -e

echo "🔨 Limpando imagens antigas..."
docker-compose down --volumes --remove-orphans

echo "🏗️  Construindo imagens..."
docker-compose build

echo "🚀 Subindo containers..."
docker-compose up -d

echo "✅ Ambiente iniciado com sucesso!"
docker-compose ps
