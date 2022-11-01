#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Decorators to handle permissions"""

from graphql import GraphQLError
from graphql_jwt.decorators import context
from functools import wraps
from typing import Callable


def representative_required(func: Callable):
	"""
	Decorator which checks whether a user is a group representative. If not raises GraphQLError.
	:param func:
	:type func:
	:return:
	:rtype:
	"""
	@wraps(func)
	@context(func)
	def wrapper_func(context, *args, **kwargs):
		if context.user.is_representative:
			return func(*args, **kwargs)
		raise GraphQLError("Only group representatives have permission to perform this action.")
	return wrapper_func
