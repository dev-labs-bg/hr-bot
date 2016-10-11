responses = []
def response(fn):
    responses.append(fn)
    def wrap(*a, **ka):
        return fn(*a, **ka)
    return wrap


@response
def ask_confirm_language_experience(ctx):
    if not ctx.get('is_language_related', False):
        # NOTE <Yavor>: These state changes are tedious to maintain by hand, but we need to do this
        # because the states are nested. A much better approach would be to have a language that expresses
        # the hierarchy of responses, so you can opt out of whole branches of dialogue without having to
        # enumerate them all.
        #
        # Naturally, implementing such a language (and parser for it) is left as an exercise for the reader. :)
        return (False, '', dict(ask_confirm_language_experience=False, ask_about_experience=False, dunno=True))
    languages = ', '.join([l for l in ctx['is_language_related']])
    return (True, "So, you have experience with %s?" % languages, dict(ask_confirm_language_experience=True))


@response
def ask_about_experience(ctx):
    return (True, "What programming experience do you have?", dict(ask_about_experience=True))


@response
def dunno(ctx):
    return (False, "I'm sorry, I don't understand you.", dict(dunno=False))


@response
def confirm_language_experience(ctx):
    if ctx.get('is_agreement'):
        return (False, 'Awesome!', dict(confirm_language_experience=True))
    return (False, "Alright, let's try that again.", dict(ask_about_experience=False, ask_confirm_language_experience=False, confirm_language_experience=False))


# def generate_response(ctx):
#     response = "I don't know what to say."
#     for fn in responses:
#         response = fn(ctx)
#         if response:
#             break
#     return response
