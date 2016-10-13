Hey, first checkout **Sprint summary section** please. There you can find details about current state of the project, what we achieved and what's next. Without that background knowledge, next lines would be misleading.

In the current README file there is generic information about the project and instructions how you can run already implemented features.

# HR Bot
HR Bot that finds the right persons for a Recruiter's job. It has automated network of users. On a Recruiter job opportunity, the bot starts conversation with the users those matched the job requirements.

---

# Sprint summary
Here you can find details about current state of the project, what we achieved and what's next.
- [EN](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/summary-EN.md)
- [BG](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/summary.md)

# Sprint demo
- [BG](https://www.youtube.com/watch?v=2KjhpK7ilKU&list=PLy-56ctrBPh-f8FM-MhA-vXfwr2odnmkj&index=2)

# Installation

### How to start the bot:

#### Requirements:
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

### How to start the microservices:
Always go to project root, before executing next commands.

#### Requirements:
- Docker installation
- If you are using UNIX like OS, then make sure `microservices/users/symfony/var/` has `777` permissions. It's needed, because the containers write in the host file system. Otherwise - there is a permission issue. We can improve the workaround it later.

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
        
# Contributions

We accept all kind of contributions that you guys make and we'll love you for them! <3

If you find any problems, have any suggestions or want to discuss something you can either open an issue [here](https://github.com/dev-labs-bg/hr-bot/issues) or make a pull request with code changes instead.

If you want to contribute, but you're not sure where to start you can always take a look at the issues [here](https://github.com/dev-labs-bg/hr-bot/issues) we have open and pick up with some of them.

Try to follow our conventions for naming issues, branches and existing code structure.
