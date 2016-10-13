#  Day two
We researched for a toolset. Both with Rado decided to implement each one of our Microservices in different programming languages/frameworks, because of we want to challenge Microservices concept which states that we can use every programming stack, only if there are common protocol of communication between the Microservices.
So we chose PHP + Symfony for our User REST API Microservice and NodeJS for GitHub User Fetcher Microservice. Note that Rado hadn't experience with NodeJS before that project.
All right. We chose our programming tools and I began implementing NodeJS Docker container (following that [tutorial](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)). My host OS is Windows, but I worked on Ubuntu virtual machine (just for the challenge). Rado developed on Windows and Docker configuration worked properly on the both OS'.
At the end of day one we had selected toolset and working NodeJS Docker container. Keep going!

# Day three
I began with setting up Symfony Docker Microservice Environment. My attitude was - "Okay ... I'll find Docker images for PHP + NGINX + MySQL and everything will be configured".
Well it wasn't smoothly, as I expected. After a research - I chose [the following predefined configuration](https://github.com/eko/docker-symfony/pull/46). As you see in the pull request "predefined" doesn't mean "working". I faced a few problems in the beginning - missing php extensions, permissions issues, missing Composer configuration. All right - if you are developer with server administration background, then these problems are nothing special. But if you don't have such background - it's a little bit misleading, because of in all Virtualization/Containerization tools the process is described exclusively simple and thanks to the high abstraction - you have to run only "up" command. Well ... it's not exactly like that ;)
FYI The permissions problems were resulted due to shared folder (between Ubuntu host machine and a Docker container). The Docker container tried to write application logs to the host. I tried different ways to fix it, but unfortunately fallbacked to `chmod -R 777 logs/`.
 
# Day fourth
User REST API Microservice was done. Currently we have two endpoints (described in README.md):
- `GET api.localhost/users` - Get all users. Also you can pass `skills` get parameter filter users by skills.
- `POST api.localhost/users` - Create an user with skills.
I heard that Symfony forms are a lil bit tricky and that was enough for me to take the challenge. So the Microservice gets the maximum of Symfony forms architecture. 

# Day fifth
Here is the Microservice summary for the previous days - we have REST User Microservice for user management and GitHub User Fetcher. During the week - the colleague that worked on the bot, regularly shared his experience and cases. Thanks to that I skipped the bigger part of needed research and decide to build "something workable" for one day.
I found out a few Community Driven services, those recognize what are the role of the words in a sentence. Example service - http://recast.ai/.
For example in the following sentence, it recognizes that "I" == Pronoun, "San Francisco" == Location: 
> "I need to know the weather in San Francisco"

Also when I request their API (with the above text), it returns:
```
{
  "uuid": "a590be9f-1e68-463e-b83f-0369e1b0f9fa",
  "source": "I need to know the weather in San Francisco",
  "intents": [
    {
      "confidence": 0.99,
      "slug": "weather"
    }
  ],
  "act": "assert",
  "type": "enty:termeq",
  "sentiment": "vnegative",
  "entities": {
    "pronoun": [
      {
        "confidence": 0.56,
        "gender": "unknown",
        "raw": "I",
        "number": "singular",
        "person": 1
      }
    ],
    "location": [
      {
        "formatted": "San Francisco, CA, USA",
        "lat": 37.7749295,
        "raw": "San Francisco",
        "type": "locality",
        "confidence": 0.99,
        "lng": -122.4194155,
        "place": "ChIJIQBpAG2ahYAR_6128GcTUEo"
      }
    ]
  },
  "language": "en",
  "version": "2.0.0",
  "timestamp": "2016-10-11T14:01:27.390540",
  "status": 200
}
```


In summary once I can understand what is the intent, have additional data for mentioned objects, what part of the sentence they are - then I have a need of a language/framework, that can use above data and make decisions and flows according it.
After a research I found out https://meya.ai/. Keep in mind that I didn't find other similar product.

**About Meya**:

- Flows  - Sequence of steps, those the bot executes.
- Intent - Intents trigger Flows.
- You have the option to pass over between Flows.
- Each Flow's step is connected with a Component. Component is a function (core or custom) that determines what will be the next loaded step.
- Each Flow is represented in Visual block scheme. So easily we can review our Flow logic.
- The components are written in Python, and the Flows in .yaml.
- Has integration with other Intent services.
- Has integration with Slack, Messanger and others. Also has Web hook API, so if our target integration is missing, then we can use the Web hook API.

I made an example HR Bot, that responds on a "job" intent (currently implemented with regex):
```
Me: Hello
HR Bot: Hello
Me: I'm searching for a new job opportunity.
HR Bot: What's your name?
Me: Jordan
HR Bot: Nice to meet you Jordan!
HR Bot: Now I'll ask you a few questions and will try to find the perfect job for you! Get ready?
HR Bot: What programming skills do you have? (Please write them comma separated. For example - php, js, python)
Me: php, js, python
HR Bot: What's your experience with python (in years)?
Me: 1
HR Bot: What's your experience with js (in years)?
Me: 2
HR Bot: What's your experience with php (in years)?
Me: 3
HR Bot: I'll reach you later, when I have the right job for you! Good bye :)
```
![flow](https://gitlab.com/dev-labs-bg/hr-bot/raw/master/meya-flow.png)

# Conclusion
- The abstraction while writing Docker configuration is developers friendly. But everything on otherside of DevOps, namely server administration - it's a lil bit difficult and tricky for developers with less server administration experience.
- Combination of Meya and an Intent service (even without) can result in a powerful bot.
- In summary we have:
    - 2 bots - Custom made by Yavka and another developed on Meya.
    - Microservice (Fetcher), that parse GitHub users with their programming skills.
    - Microservice (Users), that manage the users of the future platform.