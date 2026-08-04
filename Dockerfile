FROM php:8.2-cli-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

RUN docker-php-ext-install pdo pdo_mysql mbstring bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application source
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node dependencies and build assets (Inertia/Vite)
RUN npm install
RUN npm run build

# Ensure storage directories exist with write permissions
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data storage/logs \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 8080

# Startup script
CMD mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data storage/logs \
    && chmod -R 777 storage bootstrap/cache \
    && php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
