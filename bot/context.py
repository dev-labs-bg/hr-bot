from textblob import TextBlob
from yaml import load, dump
from re import search

# TODO <Yavor>: Handle case where there is no concepts file.
concepts = load(file('./settings.yml', 'r'))


context_builders = []
def context_builder(fn):
    context_builders.append(fn)
    def wrap(*a, **ka):
        return fn(*a, **ka)
    return wrap


def process_query(q, old_ctx):
    b = TextBlob(q)
    b.correct()

    # for sentence in b.sentences:
    #     ctx = dict()
    #     for fn in context_builders:
    #         ctx[fn.__name__] = fn(q, sentence)
    #     print(ctx)

    ctx = dict()
    for fn in context_builders:
        ctx[fn.__name__] = fn(q, b)
    old_ctx.update(ctx)
    return old_ctx


@context_builder
def is_question(q, o):
    q = q.lower()
    # TODO <Yavor>: Collapse the tag testing and text matching into something more general.
    if q.endswith('?') or q.startswith('is'):
        return True
    # NOTE <Yavor>: Maybe match the pattern [QUESTION WORD] {PRONOUN} {ADVERB} [VERB]
    # TODO <Yavor>: Handle 'when is/do/etc'
    # TODO <Yavor>: Handle questions starting with 'Do'
    question_tags = ['WP', 'WRB']
    match_tag = lambda test, tag: tag == test[1]
    if not o.tags:
        return False
    return any(match_tag(o.tags[0], tag) for tag in question_tags)


# TODO <Yavor>: Add frameworks and tools to the settings file and link them up with the languages.
@context_builder
def is_language_related(q, o):
    languages = concepts['languages']
    # TODO <Yavor>: Figure out a way to remove the q.find repetition from the dict comprehension. :\
    matched = {l:(q.find(w), q.find(w)+len(w)) for w in o.words for l in languages if l.lower() == w.lower()}
    return matched


# TODO <Yavor>: Do additional parsing for things like "no <language> experience"
@context_builder
def sentiment(q, o):
    return o.sentiment


# TODO <Yavor>: An actual parser with nlp.
@context_builder
def is_agreement(q, o):
    return q == 'yes'


# TODO <Yavor>: Extract the time period from the timespan string.
# TODO <Yavor>: Parse numbers in word format, e.g.: "five years".
# TODO <Yavor>: Find the closest mentioned language in the query.
@context_builder
def contains_time_period(q, o):
    tokens = concepts['period_tokens']
    matches = lambda q, t: search(('(\d)*( *)(%s)' % t), q)
    sentence = ' '.join([str.singularize().lower() for str in o.tokens])

    matched = []
    for t in tokens:
        match = matches(sentence, t.lower())
        if match:
            matched.append({match.group(3):int(match.group(1) or 1),
                            'at':match.span()})
    return matched
