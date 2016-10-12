In next lines we'll present our sprint idea, what challenges we took, what we achieved, and also our daily notes (took during the sprint week)

# Team
- Yavor (a.k.a Yavka) - yavor@devlabs.bg
- Radoslav (a.k.a. Rado) - radoslav@devlabs.bg
- Jordan (a.k.a. Dancho) - jordan@devlabs.bg

# Idea
HR Bot that finds the right persons for a Recruiter's job. 
> It has automated network of users. On a Recruiter job opportunity, the bot starts conversation with the users those matched the job requirements.

# Day one (through Yavka's daily notes,these are the same for all of us):
Срещнахме се с Данчо и вербувахме Радо за каузата да оставим HR-ите без работа™. Качихме се в тихата стая и направихме груба разбивка на нещата, които искаме да се случат.
Най-общо, идеята бе да съберем информация за програмисти от профилите им в LinkedIn, GitHub и StackOverflow в наша база от данни. Имаме landing page, на който работодатели могат да търсят хора с определени умения. Когато получим запитване, търсим какви хора имаме в базата, след което им пращаме имейл от HR бота, който започва да ги разпитва. Ако им хареса предложението (и програмистът отговаря на описанието на работодателя), пращаме информация на работодателя кои хора сме намерили.
След като написахме стъпките на дъската видяхме, че нещата естествено се разбиват на отделни модули. Данчо предложи да пробваме да ги направим на отделни microservices, и пое задачата да види как ще стане това. Радо каза, че не правил REST API до момента, така че пое задачата да направи GitHub, LinkedIn и StackOverflow parser-и, като решихме първо да се започне с GitHub, защото имат API (за разлика от LinkedIn, за който трябва някакъв scraper). За мен остана имплементацията на бота, с идеята Данчо и Радо да се включат след като свършат своите задачи, и да прескочат фазата на проучване.
Разбивката на microservice-ите и реда, в който се случват нещата може да видите на схемата на дъската:
![Day 1](https://gitlab.com/dev-labs-bg/hr-bot/raw/a01cd34310a64a1861fe374552a6fde6a4a2299d/bot/img/day1.jpg)

**In result of first meeting we delegate the task in the following order**:

- Yavka  - Everything about the bot and AI
- Rado   - GitHub User Fetcher 
- Jordan - Docker Microservices and User REST API 

# Day two, three, fourth, fifth - daily notes
- [Yavka](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Yavka-summary.md)
- [Jordan](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Jordan-summary.md)
- [Rado](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Rado-summary.md)


# What did we achieve?
- We have 2 bots. The first one is [Custom](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Yavka-summary.md), and another one is developed on [Meya](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Jordan-summary.md).
- We have 2 Microservices (Docker) - [for user management](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Jordan-summary.md) and one [for GitHub Users Fetching](https://gitlab.com/dev-labs-bg/hr-bot/blob/master/Sprint-Rado-summary.md).

# Demo
- [Video - BG](https://www.youtube.com/watch?v=2KjhpK7ilKU&list=PLy-56ctrBPh-f8FM-MhA-vXfwr2odnmkj&index=2)

# What's next
- Creating a "smart" HR Bot. Definitely that is the biggest challenge we have. For a start - we can test what are the Meya's limits and capabilities.
- Connecting the Microservices and automatization of the whole HR process.
- Creating more User Fetchers (for instance StackOverflow, LinkedIn).
- The initial idea is that the bot starts a conversation with the users. We can reverse it and create a bot - that responds to users those search for a new job.


