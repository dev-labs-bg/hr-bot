In next lines we'll present our sprint idea, what challenges we took, what we achieved, and also our daily notes (took during the sprint week)

# Team
- Yavor (a.k.a Yavka) - yavor@devlabs.bg
- Radoslav (a.k.a. Rado) - radoslav@devlabs.bg
- Jordan (a.k.a. Dancho) - jordan@devlabs.bg

# Idea
HR Bot that finds the right persons for a Recruiter's job. 
> It has automated network of users. On a Recruiter job opportunity, the bot starts conversation with the users those matched the job requirements.

# Day one (through Yavka's daily notes,these are the same for all of us):
We made a rough draft of the project scope. The idea was to automate gathering information about developers from LinkedIn, GitHub, and StackOverflow profiles. We'd also make a landing page where employers can search for people with various skills. Once we have a search query, a bot would start a conversation with the developer via email.

After writing all the steps down, it became clear we can split everything into its own module. Jordan proposed we structure things as separate micro-services that talk to each-other via a REST API. We decided Rado can tackle the REST API and GitHub profile parser, as he had never worked with a REST service. Jordan tasked himself with figuring out how to structure the micro-services and build the containers. I was left with researching how to build the bot -- the idea being that Jordan and Rado could finish their tasks quickly and join me.

You can see the initial project sketch below:
![Day 1](https://raw.githubusercontent.com/dev-labs-bg/hr-bot/master/documentation/sprint/img/day1.jpg)

**In result of first meeting we delegate the task in the following order**:

- Yavka  - Everything about the bot and AI
- Rado   - GitHub User Fetcher 
- Jordan - Docker Microservices and User REST API 

# Day two, three, fourth, fifth - daily notes
- [Yavka](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/yavka-summary-EN.md)
- [Jordan](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/jordan-summary-EN.md)
- [Rado](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/rado-summary-EN.md)


# What did we achieve?
- We have 2 bots. The first one is [Custom](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/yavka-summary-EN.md), and another one is developed on [Meya](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/jordan-summary-EN.md).
- We have 2 Microservices (Docker) - [for user management](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/jordan-summary-EN.md) and one [for GitHub Users Fetching](https://github.com/dev-labs-bg/hr-bot/blob/master/documentation/sprint/rado-summary-EN.md).

# Demo
- [BG](https://www.youtube.com/watch?v=2KjhpK7ilKU&list=PLy-56ctrBPh-f8FM-MhA-vXfwr2odnmkj&index=2)

# What's next
- Creating a "smart" HR Bot. Definitely that is the biggest challenge we have. For a start - we can test what are the Meya's limits and capabilities.
- Connecting the Microservices and automatization of the whole HR process.
- Creating more User Fetchers (for instance StackOverflow, LinkedIn).
- The initial idea is that the bot starts a conversation with the users. We can reverse it and create a bot - that responds to users those search for a new job.


