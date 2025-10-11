-- Script de inicialização para o banco de dados Users
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar schema para users
CREATE SCHEMA IF NOT EXISTS users;

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS users.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL, -- Referência ao usuário no serviço de auth
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    location VARCHAR(255),
    website VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_profiles_auth_user_id ON users.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_profiles_display_name ON users.profiles(display_name);

-- Tabela para endereços de usuários
CREATE TABLE IF NOT EXISTS users.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users.profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'home', -- home, work, other
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para endereços
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON users.addresses(user_id);

-- Tabela para arquivos de upload do usuário
CREATE TABLE IF NOT EXISTS users.user_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users.profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_type VARCHAR(50) NOT NULL -- avatar, document, etc.
);

-- Criar índices para arquivos
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON users.user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_type ON users.user_files(file_type);

-- Inserir dados de exemplo (opcional para desenvolvimento)
INSERT INTO users.profiles (auth_user_id, first_name, last_name, display_name, bio) 
VALUES 
    ('00000000-0000-0000-0000-000000000001'::uuid, 'Admin', 'User', 'admin', 'Administrador do sistema'),
    ('00000000-0000-0000-0000-000000000002'::uuid, 'Test', 'User', 'testuser', 'Usuário de teste')
ON CONFLICT (auth_user_id) DO NOTHING;
