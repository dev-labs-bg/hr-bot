# HR Bot
[TODO description]

---
# Microservices
- Users - microservices/users/
- GitHub users fetcher - microservices/fetchers/github/

# Installation

## Requirements
- Docker installation
- If you are using UNIX like OS, then make sure `microservices/users/symfony/var/` has `777` permissions. It's needed, because the containers write in the host file system. Otherwise - there is a permission issue. We can improve the workaround it later.

## Start the microservices
Always go to project root, before executing next commands.

### Users
[TODO - next steps can be automated]
- Build Docker images and run the containers: `cd microservices/users/ && docker-compose build && docker-compose up -d`
- Login in php-fpm container (you can find its id with `docker ps`): `docker exec -it <container id> sh
`
- Go to symfony folder: `cd var/www/symfony`
- Install composer dependencies: `php composer.phar install`
- Update Symfony database schema: `php bin/console doctrine:schema:update --force`
- Now you can access the project on http://localhost/

### GitHub users fetcher
`cd microservices/fetchers/github/ && docker-compose build && docker-compose up -d`
