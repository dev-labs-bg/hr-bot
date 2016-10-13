# Github User fetching.
*All days are summarized here.*

One of the tasks in this HR Bot was fetching and processing of users from github for the database of the bot. The task is pretty straightforward and can be described with a couple of short steps.

It all starts with a couple of github API calls, after which the gathered information is filtered down to three things - names, email and known programming languages. The main goal is to create an object which looks a little something like this:
```
{
    "email": "jordan@devlabs.bg",
    "first_name": "Jordan",
    "last_name": "Enev",
    "skills": [{"name": "JS"},{"name": "PHP"}]
}
```

The first three variables are easy to get, but for the known languages, one must go through a couple of more calls to reach the look for array. First, my idea was to look through absolutely every single repo of the user and squeeze out all of the languages into an array. Unfortunately, after 1-2 hours of going through API calls (and around 1000 github calls) I realized, that a call loop within a call loop wasn't the smartest of ideas, and the only thing that could have came out of it was a API access ban. At the end, thankfully, I realized that the only thing I had to do was to look at the **entire** API response when I call for the github user (which had about 20-30 elements), because in-between all of the useless information which is returned by the API (like the github golden stars of a user, and the number of sandwiches the user has eaten in the past month) hides a nice little array:

```
{
    "language": "PHP, "JS", "Ruby"
}
```
....

After all of these calls in calls in calls I reached a final, well structured array with a name, an email and programming languages of a random github user and the only thing left was for the other parts of the bot to handle this array. But, of course, this turned out to be much harder than I thought. Because we worked with Docker containers, which I've never worked with before, creating link between them was supposed to be an easy task, but it had way too many problems and we didn't manage to make it work for the time we had. And so, we are left with a well working fetcher at address '/fetch' which gets a random github user and prepares him for an HR Bot.
