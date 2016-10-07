#! /usr/bin/env python

from pprint import pprint
from context import process_query
from response import responses
from transitions import Machine

from goapy import Planner, Action_List

# NOTE <Yavor>: This is a hacked together proof of concept to show that you can
# use a dependency graph and a goal state, and let the bot resolve the action plan
# to reach the goal.
#
# If you want to use this method, you'll need to refactor the recursive resolve function.
#
# One way to simplify it would be for the GOAP resolver accept a function (callback)
# as the condition, instead of variables. Then, you can skip the code that resets the world
# start state and just execute bot reactions, which would simplify both this function,
# and the reaction function returns.
def recursive_goap(_world):
    _path = _world.calculate()
    ctx = getattr(_world, 'ctx', dict())
    if _path:
        _path = _path[0]
        _world.set_start_state(**_path['state'])
        # print "-- <Current goal: %s>" % _path['name']
        success, response, ctx = [fn for fn in responses if fn.__name__ == _path['name']][0](ctx)
        if not success:
            _path['state'].update(ctx)
            _world.set_start_state(**_path['state'])
            if (response):
                print "HR KIRI: %s" % response
            recursive_goap(_world)
            return
        print "HR Kiri: %s" % response
        var = raw_input("> ")
        _world.ctx = process_query(var, ctx)
        # print "-- <Context: %s>" %_world.ctx
        recursive_goap(_world)


if __name__ == '__main__':
    ctx = dict()

    actions = [fn.__name__ for fn in responses]
    _world = Planner(*actions)
    _world.set_start_state(dunno=False, ask_about_experience=False, ask_confirm_language_experience=False, confirm_language_experience=False)
    _world.set_goal_state(confirm_language_experience=True)

    # NOTE <Yavor>: These state changes are tedious to maintain by hand, but we need to do this
    # because some states are nested. A better approach would be to provide the condition as a function (callback)
    # instead of maintaining a list of flags to set check. The GOAP library used here doesn't have that feature,
    # so you will need to modify it/make your own dependency graph resolver if you want to simplify this.
    _actions = Action_List()
    _actions.add_condition('ask_about_experience',            dunno=False, ask_about_experience=False)
    _actions.add_reaction('ask_about_experience',             dunno=False, ask_about_experience=True)
    _actions.add_condition('ask_confirm_language_experience', dunno=False, ask_confirm_language_experience=False, ask_about_experience=True)
    _actions.add_reaction('ask_confirm_language_experience',  dunno=False, ask_confirm_language_experience=True)
    _actions.add_condition('confirm_language_experience',     dunno=False, confirm_language_experience=False,     ask_confirm_language_experience=True)
    _actions.add_reaction('confirm_language_experience',      dunno=False, confirm_language_experience=True)
    _actions.add_condition('dunno',                           dunno=True)
    _actions.add_reaction('dunno',                            dunno=False)
    _world.set_action_list(_actions)

    recursive_goap(_world)
