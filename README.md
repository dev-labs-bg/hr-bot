# HR Bot
HR Bot that finds the right persons for a Recruiter's job. It has automated network of users. On a Recruiter job opportunity, the bot starts conversation with the users those matched the job requirements.

---

# Installation

### Requirements:
- Docker installation
- If you are using UNIX like OS, then make sure `microservices/users/symfony/var/` has `777` permissions. It's needed, because the containers write in the host file system. Otherwise - there is a permission issue. We can improve the workaround it later.

### How to start the microservices?
Always go to project root, before executing next commands.

#### Users microservice:

0. Build Docker images and run the containers: `cd microservices/users/ && docker-compose build && docker-compose up -d`
0. Login in php-fpm container (you can find its id with `docker ps`): `docker exec -it <container id> sh
`
0. Go to symfony folder: `cd var/www/symfony`
0. Install composer dependencies: `php composer.phar install`
0. Update Symfony database schema: `php bin/console doctrine:schema:update --force`
0. Now you can access the project on http://localhost/

#### GitHub Users Fetcher microservice:

0. `cd microservices/fetchers/github/ && docker-compose build && docker-compose up -d`
0. Now you can access the project on http://localhost:8081/

# Microservices details:
- **Users**:
    - Path `microservices/users/`
    - REST API Endpoints:
        - [GET] `localhost/users` - Get all users. You can filter users by `skills` comma separated get parameter. It will return users, those have minimum one of selected `skills`.
        - [POST] `localhost/users` - Create an user. You have to pass *string* `email`,*string* `first_name`,*string* `last_name`,*array* `skills`. Example data:
        ```{
         	"email": "jordan@devlabs.bg",
         	"first_name": "Jordan",
         	"last_name": "Enev",
         	"skills": [{"name": "JS"},{"name": "PHP"}]
         }```
- **GitHub Users Fetcher**
    - Path `microservices/fetchers/github/`
    - API Endpoints:
        - [GET] http://localhost:8081/fetch - On each get request it will fetch 10 GitHub users and will return them as response.

# Demo
- ...