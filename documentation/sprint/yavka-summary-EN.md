### Disclaimer:

![bot](https://raw.githubusercontent.com/dev-labs-bg/hr-bot/master/documentation/sprint/img/bot.JPG)

All information in this file is the result of 3-4 day's worth of research. The descriptions of the theory I'm basing this prototype on are incomplete (and, possibly, completely inaccurate). I've added reference links to all materials I've used whilst making this. Feel free to help yourself.

Another resource you may use is a free online book[9] on AI I found on the last day of the sprint. The explanations there are much more accurate than what I can muster :).

### Day one:

We made a rough draft of the project scope. The idea was to automate gathering information about developers from LinkedIn, GitHub, and StackOverflow profiles. We'd also make a landing page where employers can search for people with various skills. Once we have a search query, a bot would start a conversation with the developer via email.

After writing all the steps down, it became clear we can split everything into its own module. Jordan proposed we structure things as separate micro-services that talk to each-other via a REST API. We decided Rado can tackle the REST API and GitHub profile parser, as he had never worked with a REST service. Jordan tasked himself with figuring out how to structure the micro-services and build the containers. I was left with researching how to build the bot -- the idea being that Jordan and Rado could finish their tasks quickly and join me.

You can see the initial project sketch below:

![Day 1](https://raw.githubusercontent.com/dev-labs-bg/hr-bot/master/documentation/sprint/img/day1.jpg)

### Day two:

I started the day researching available bot frameworks and services, among them pandorabots.com (chatbots.io), Microsoft Bot network, ChatScript, ABot, (and many others whose name's I've forgotten). Most of what I could find was either a paid service, or only worked with specific communication channels (Facebook chat, Skype, ect.).

ChatScript was the first framework that caught my eye. From what I could found, bots based on ChatScript won the Loebner prize for 2010, 2011, and 2012; so I assumed it to be mature. 

I spent the rest of the day trying to get something out of the meager scraps of ChatScript's documentation[1][2], but didn't have much luck. I managed to cobble a bot together that asks a few questions copy/pasting from the example files.

By the end of the day, I'd decided that ChatScript wasn't worth the effort. I had no idea what I was doing. 

### Day three:

I decided I wouldn't look for a different framework. If I were to lean on some framework, I'd end up ignorant of the inner workings of the chatbot. Since the sprints were meant to pose a technical challenge, that would be counterproductive. I decided I have 3 days to build my own bot, or fail the sprint.

Some Googling later, I came upon two articles[3][4] detailing different strategies for building chatbots. I spent the rest of the day in disbelief. The standard for writing chatbots leans on pattern matching and psychological trickery more than any algorithm. Yet, not all was lost. I adopted the idea of analysing the input and generating a sentence context from it. The AI could generate replies using whatever information it could infer from the input sentence[3]. Here's an example of what I had in mind:

![Parser](https://raw.githubusercontent.com/dev-labs-bg/hr-bot/master/documentation/sprint/img/parser.JPG)

(Don't worry, there's an explanation for the context below. You don't need to read the handwritten json.)

I wanted to separate the input sentence analysis from the reply generation, because I could get many different input sentences that all mean the same thing. It would be much easier to write rules if I could base them on the sentence meaning, rather than matching a text pattern.

For example, these sentences all mean the same thing:

- "I have 9001 years of js experience."
- "I have 9001 years of JS exp.!"
- "I’ve 9001 years of JS experience."
- "I’ve programmed in JS for 9001 years."
- "I first started programming JS 9001 years ago."

If I wanted to match these with a regular expression (or some other form of pattern matching), I would have to either:

1. Construct many rules to match all possible permutations of the sentence.
2. Choose a very loose pattern to match against.

Let's explore the second option. I can see a common pattern in the sentences; they all contain the words "js" and "9001 year". I could create a pattern that matches "js" (or other languages) and `"<digit> <years>"`.

If I were to do that, I would exclude other cases that mean the same thing. For example: “My JS experience is over nine-thousand years!”; doesn't match the pattern, yew the meaning is equivalent. There are also cases where sentences match, but the meaning has changed:

- “I haven’t written any JS in 20 years.”
- “12 days of JS experience is enough for me to qualify as a pro front-end developer, right?”

If we construct restrictive rules, we end up dealing with a combinatorial explosion of rules, yet, if we form broad, inclusive rules, we may get false positives. In order for the bot to be believable, the parsing rules must be just right, which means we need a more powerful means of defining them.

Some Googling later, I found this library[5] for natural language processing, along with its wrapper[6], which I use for processing the input. Here's how it works:

The input sentence “I have 9001 years of js experience!” gets broken down into lemmas:

I<PRP>  have<VBP>  9001<CD>  years<NNS> of<IN>  js<NN>  experience<NN>

The abbreviations after each word (PRP, VBP, etc.) are an encoding for the lexical meaning of each word. Here's what they mean:

- PRP - PeRsonal Pronoun
- VBP - VerB Present form
- CD - CarDinal number
- IN - prepositIoN
- NNS - NouN (poSsesive) 
- NN - NouN

While this doesn't look immediately useful, it allows for more general rule definitions.

After a few hours tinkering with the library, I made an analyser that reads the sentence “I have 9001 years of js experience” and returns this information:

```
{
    'is_agreement': False,
    'sentiment': Sentiment(polarity=0.0, subjectivity=0.0),
    'is_question': False,
    'contains_time_period': [{'at': (7, 16), u'year': 9001}],
    'is_language_related': {'JS': (21, 23)}
}
```

Given this infromation, the bot tries to match the context to some rules, and decides what its response should be. The implementation of the rule checking was just a hardcoded sequence of if-else checks on the context.

### Day four:

After I had my proof-of-concept parser, I decided to do a bit more research on alternative parsing methods. I found two articles about ontological relational databases for AI. I didn't have time for an in-depth study, so I can only describe the idea briefly:

The bot has access to a concepts database, which enables it to make logical leaps like:

"PHP is a programming language. PHP is object-oriented. I've been tasked with searching for people with OOP experience. This programmer has PHP experience, therefore he/she may be a potential candidate."

This seems similar to the type of inference expert systems[10] do. We would, in effect, be building an HR expert system.

But, let's get back to what I was actually able to implement.

Given my limited knowledge of the subject matter, I wanted to avoid making a general conversation bot. I settled on sticking to a scripted scenario, as that severely limits the input space. I started with a very simple script: 

1. The bot asks for experience
2. It tries to parse the response, and asks for confirmation
    - If the user confirms, go to 3
    - If the user denies, go to 1.
    - If the bot has asked the user for confirmation more than 2 times already; give a hint about the expected input format.
3. The bot lets you know how awesome it thinks you are!

This type of railroading is convenient, because there is a finite set of states a conversation could be in. Debugging is also trivial, as there is a clear idea about what the bot should do at any given time.

While every step of the conversation could be encoded as a set of if-else checks, the code quickly turns into spaghetti. A more flexible way for defining a conversation flow is needed for defining complex interactions. We enter the domain of finite state machines. Here's what the graph for our example conversation looks like:

![Finite state machines](https://raw.githubusercontent.com/dev-labs-bg/hr-bot/master/documentation/sprint/img/state_machine.jpg)

You can see the problem with this approach even early on.

Whenever we attempt to describe logic with a finite state machine, the result is always more verbose than what we can manage with a high-level language. Depending on how strictly we adhere to graph theory, we may need to add states that do nothing, or unconditional transitions, which makes the graph more complex than it should be. All in the name of reusing states.

These problems could be solved by allowing the programmer to define simplified or nested versions of the graph, or even parse a high-level language that generates the graph for the programmer. You can see an example of a simplification and nesting in the centre and right side of the whiteboard.

Whichever solution I were to choose, two thing become apparent:
1. This isn't something I can implement in a day (though, there are people that certainly could).
2. Even though reuse states appears easier, the logical complexity doesn't change.

I spent the rest of the day searching for a FSM library that could do what I needed, but couldn't find one. In the end, I implemented a proof of concept FSM.

### Day five:

I decided the maintenance for a large number of states didn't scare me as much as the number of transitions in a complex graph. Defining the state graph should be much simpler if the bot could figure out a path through the graph on its own.

Some Googling later I learned about Goal Oriented Action Planning[8] (or GOAP, for short), which does exactly what I want. The article I've referenced gives a much better explanation than I could muster with my 2 hours of research, but here's gist of it:

1. The programmer defines the capabilities of the bot. These are actions like "ask the programmer for their experience", "confirm the experience you parsed", and "give a hint". In other words, the states of the FSM.
2. The programmer defines dependencies between the different states/actions. For example, "In order to confirm the experience, you need to first ask about it.", or "If you've confirmed the experience, don't ask about it again."
3. The programmer defines a desired end state, or goal.
4. Because the bot could possibly find many paths to the end state, the programmer defines weights for each action. This acts as the bot's "preference" for certain chains of actions, for example the bot may not be required to ask how much experience one has with a certain programming language, but it is highly desirable.
5. One A* search of the weighted graph later and the bot has formed a "plan" for action that would get it to the desired state.

Again, I searched for a library that implements GOAP, but couldn't find one that would allow for dynamic weights and conditions. Because I had about 4-5 hours left, I hacked together the ugliest possible recursive function which forces a recalculation of the path based on the bot context. Here's a transcript of a sample conversation:

```
HR Kiri: What programming experience do you have?
> I have 4 years of php and just as much JS under my belt. I also rock at python.
HR Kiri: So, you have experience with Python, PHP, JS?
> no
HR KIRI: Alright, let's try that again.
HR Kiri: What programming experience do you have?
> Well, I can do bash?
HR Kiri: So, you have experience with Bash?
> yes
HR KIRI: Awesome!
```

```
HR Kiri: What programming experience do you have?
> I have no experience whatsoever.
HR KIRI: I'm sorry, I don't understand you.
HR Kiri: What programming experience do you have?
```

Here's what that looks like with the debug logging on:
```
-- <Current goal: ask_about_experience>
HR Kiri: What programming experience do you have?
> I have 3 years of php experience and a month of js under my belt.
-- <Context: {'is_agreement': False, 'sentiment': Sentiment(polarity=0.0, subjectivity=0.0), 'is_question': False, 'contains_time_period': [{'at': (37, 43), u'month': 1}, {'at': (7, 13), u'year': 3}], 'ask_about_experience': True, 'is_language_related': {'PHP': (18, 21), 'JS': (48, 50)}}>
-- <Current goal: ask_confirm_language_experience>
HR Kiri: So, you have experience with PHP, JS?
> no
-- <Context: {'is_agreement': False, 'sentiment': Sentiment(polarity=0.0, subjectivity=0.0), 'ask_confirm_language_experience': True, 'contains_time_period': [], 'is_question': False, 'is_language_related': {}}>
-- <Current goal: confirm_language_experience>
HR KIRI: Alright, let's try that again.
-- <Current goal: ask_about_experience>
HR Kiri: What programming experience do you have?
> Some php.
-- <Context: {'is_agreement': False, 'sentiment': Sentiment(polarity=0.0, subjectivity=0.0), 'is_question': False, 'contains_time_period': [], 'ask_about_experience': True, 'is_language_related': {'PHP': (5, 8)}}>
-- <Current goal: ask_confirm_language_experience>
HR Kiri: So, you have experience with PHP?
> yes
-- <Context: {'is_agreement': True, 'sentiment': Sentiment(polarity=0.0, subjectivity=0.0), 'ask_confirm_language_experience': True, 'contains_time_period': [], 'is_question': False, 'is_language_related': {}}>
-- <Current goal: confirm_language_experience>
HR KIRI: Awesome!
```

### Conclusion:
I'm disappointed I couldn't create something more substantial in the time limit, but I had fun learning about AI algorithms, and wouldn't trade the experience for any off-the-shelf framework or service.

---
[1] https://htmlpreview.github.io/?https://raw.githubusercontent.com/bwilcox-1234/ChatScript/master/HTMLDOCUMENTATION/ChatScript-Basic-User-Manual.html

[2] https://htmlpreview.github.io/?https://raw.githubusercontent.com/bwilcox-1234/ChatScript/master/HTMLDOCUMENTATION/ChatScript-Memorization.html

[3] http://www.gamasutra.com/view/feature/134675/beyond_fa%C3%A7ade_pattern_matching_.php

[4] http://thesai.org/Downloads/Volume6No7/Paper_12-Survey_on_Chatbot_Design_Techniques_in_Speech_Conversation_Systems.pdf

[5] http://www.nltk.org/

[6] https://textblob.readthedocs.io/en/dev/

[7] https://en.wikipedia.org/wiki/Expert_system

[8] https://gamedevelopment.tutsplus.com/tutorials/goal-oriented-action-planning-for-a-smarter-ai--cms-20793

[9] http://artint.info/html/ArtInt.html

[10] http://www.ecommerce-digest.com/expert-systems.html
