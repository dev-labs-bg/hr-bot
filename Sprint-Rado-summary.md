# Github User fetching.
*Всичките дни са обобщени тук.*

Една от задачите в този HR Bot sprint беше fetch-ване и обработка на user-и от github с цел създаване на датабаза от тези user-и. Задачата е доста straightforward и може да се опише в няколко кратки стъпки. 
Започва се с няколко call-а към API-то на github, след което получената информация се отсява до няколко неща - имена, email и познати езици на един user. Първите две са нищо работа, но за езиците на даден потребител трябва да се мине през още няколко call-а за да се стигне до така исканият масив. Първоначално, идеята ми беше да прегледам абсолютно всички repo-та на даден потребител, и да изтискам езиците на които са писани тези repo-та. За жалост, след 1-2 часа преглед на API повикванията (и около ~1000 call-a към github) осъзнах, че цикъл от повиквания в който има още един цикъл от повиквания не е най-добрия, нито най-бързият начин за извличане на информация, и единственото което можеше да излезе от него е бан от API услугата на github. На края, се оказа, че единственото нещо което е трябвало да направя е да прегледам -целият- response когато първоначално питам github за даден потребител (който имаше около 20-30 елемента), защото из помежду безмислената информация която връща API-то (от сорта на това колко златни звезди има един потребител в github, и кое е последното нещо което е закусвал) седи един малкък скрит масив от сорта на "languages: {JS, PHP, Ruby}". .... 
След всичките тези call-ове в call-ове в call-oве се стига до един приятен, структуриран обект с име, email и езици който само чака да се изпрати към другите части на bot-а. Ноо, се оказа, че и това е по-сложно от колкото си мислих. Тъй като работихме с Docker контейнери, създаването на връзки между тях се оказа доста сложна работа (особено за човек който никога не е пипал docker или каквото и да е подобно) и така и тази връзка се не получи.