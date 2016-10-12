# HR Bot
HR Bot that finds the right persons for a Recruiter's job. It has automated network of users. On a Recruiter job opportunity, the bot starts conversation with the users those matched the job requirements.

---

# Sprint summary
- [BG](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-summary.md)

# Installation

### Requirements:
- Docker installation
- If you are using UNIX like OS, then make sure `microservices/users/symfony/var/` has `777` permissions. It's needed, because the containers write in the host file system. Otherwise - there is a permission issue. We can improve the workaround it later.

### How to start the bot:
You need to have `python 2.7` and `virtualenv` and `virtualenvwrapper` installed. You can follow these installation guides if you don't already have them:
- [Python install guide](https://wiki.python.org/moin/BeginnersGuide/Download)
- [Virtualenv install guide](https://virtualenv.pypa.io/en/stable/installation/)
- [Virtualenvwrapper install guide](http://virtualenvwrapper.readthedocs.io/en/latest/install.html)

1. Navigate to the bot directory by running `cd bot`
1. Create a virtual environment for the project by running `mkvirtualenv hrkiri-bot` (you need to do this only once).
2. Update the bot requirements with `pip install -r requirements.txt`
3. Update the NLTK dictionaries with `python -m textblob.download_corpora`
3. Run the bot with `./test.py`

In case you want to exit the virtual environment, run `deactivate`. The command to enter it again is `workon hrkiri-bot`.

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
        - [GET] `api.localhost/users` - Get all users. You can filter users by `skills` comma separated get parameter. It will return users, those have minimum one of selected `skills`.
        - [POST] `api.localhost/users` - Create an user. You have to pass *string* `email`, *string* `first_name`, *string* `last_name`, *array* `skills`. Example data:
        
        ```
        {
         	"email": "jordan@devlabs.bg",
         	"first_name": "Jordan",
         	"last_name": "Enev",
         	"skills": [{"name": "JS"},{"name": "PHP"}]
        }
        ```
- **GitHub Users Fetcher**
    - Path `microservices/fetchers/github/`
    - API Endpoints:
        - [GET] `localhost:8081/fetch` - On each get request it will fetch 10 GitHub users and will return them as response.

# Demo
- ...