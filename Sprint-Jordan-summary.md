# Ден втори
Избор на инструментариум. С Радо преценихме всеки един Microservice да го разпишем на различна технология. Все пак това е едно от предимствата. Решихме User REST API да е на PHP и Symfony, а GitHub Fetcher да е на NodeJS. Отбелязвам, че към момента Радо няма опит с Node.
Започнах със сетването на NodeJS microservice и се ръководих по следния tutorial - https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
В края на деня - имахме работещ NodeJS контейнер, който го конфигурирах през виртуална машина. Бях решил да ескпериментирам и работната ми среда да е Ubuntu. Радо беше на Windows и всичко от конфигурацията сработи безпроблемно.

# Ден трети
Започнах да човъркам и сетвам Symfony Docker Microservice Environment. Нагласата ми беше - че "няма чак толкова какво да се конфигурира". Не беше точно така и прецених да използвам готова конфигурация. След стандартния Research се спрях на следната - https://github.com/eko/docker-symfony/pull/46. Както виждате "готова" не означава - работеща. Сблъсках се с няколко проблема като - липсващи php extensions, проблеми с права, няма Composer.
FYI Проблемите с правата са свързани с това, че Guest Container и Host machine имат обща споделена папка, в която се намира Symfony. Съответно всички процеси се изпълняват на Guest и когато се генерират логове, то те се записват от Guest на Host machine. Пробвах по-различни начини да разреша проблема, но в крайна сметка "заших" 777 на logs/ директорията.

# Ден четвърти
Имплементирах `GET/POST localhost/users`. Съответно при GET връщам всички потребители с техните skills, като поддържаме и филтрация по skills. При POST добавяме потребители и skills към тях. Тук се предизвиках и реших всичко да имплементирам със Symfony Form Types. Разбира се - можех и да го напляскам директно в контролена, но ... няма смисъл, нали? Отначало е малко трудно, но както Цецо сподели - когато схванеш идеята, после не е толкова голям филм.

# Ден пети
Имаме REST User Microservice за управления на потребители, имаме GitHub User Fetcher. Съответно на база разговорите с Явката през седмицата и BOT казусите (т.е. количеството натрупан опит по AI) - реших да пробвам в рамките на ден да "скалъпя" нещо работещо.
Попаднах на няколко интересни services (Community Driven), които разпознват в дадено изречение отделните думи какво означават http://recast.ai/.
Примерно в следващото изречение разпознава, че "I" == Pronoun, "San Francisco" == Location: 
> "I need to know the weather in San Francisco"

Съответно като направя Request към тяхното API с конкретния текст, получавам следната информация:
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

Дадох си равносметка, че щом мога да разбирам какво е намерението (intent), допълнителна информация за споменатите обекти, каква част на изречението е думата - то нещото, което ми трябва е language/framework - в който да мога да описвам правила, patterns и да създавам сценарии (flow, блок схеми, граф и т.н.).
След направен Research, попаднах на https://meya.ai/. Имайте предвид, че не отрких друг подобен завършен продукт.
**Накратко Meya включа**:

- Flows  - последователност от стъпки, които ботът да направи. 
- Intent - Намерение, което да активира даден Flow.
- Имаш опцията да прескачаш от Flow на Flow.
- Всяка стъпка в даден Flow отговаря на даден компонент. Този компонент може да е разписан от теб или да използваш някой от готовите. Разбирайте го като функция, която определя какво да се случи на база потребителския вход (текст).
- Якото е, че всеки един Flow ти го разбива на блок схема и лесно може да проследиш какво си разписал като логика.
- Въпросните компоненти се разписват на Python, а Flows се описват в .yaml.
- Има интеграция с други Intent services.
- Има интеграция със Slack, Messanger и др. Важното е, че има Web hooks API и по този начин може да осъществим EMAIL комуникация.

Успях да направя примерен БОТ, който като го попиташ за работа - започва да те разпитва какви програмни езици знаеш и какъв ти е опита с тях.
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

# Заключение
- При разписването на Docker environments - абстракцията, която получаваш за конфигурация е определено developers friendly. Обаче всичко останало, което е от другата страна на DevOps, а именно server administration - е малко по-трудно. Положителното е, че веднъж като конфигурираш един Docker environment - после единствено го поддържаш. Разбира се - първо проверете дали някой вече не го е направил.
- С Meya и в комбинация с някой Intent service (дори и без) могат да се постигнат много прилични резултати.
- В обобщение имаме
	- 2 примерни бота - единия разписан от Yavka's BOT Framework и втори разписан на Meya.
	- Microservice (Fetcher), който парсва GitHub потребители, с техните програмни езици.
	- Microservice (Users), който съхранява потребители от различни Fetchers.