'''
IO Answers & Questions
Used by fsModule
'''

from conf.value import OK, NO
import bcolors as b
import inspect
from sys import path
from os.path import abspath, dirname
currentdir = dirname(abspath(inspect.getfile(inspect.currentframe())))
parentdir = dirname(currentdir)
path.insert(0, parentdir)


QUESTION = "[y|n]: "
KEYS = ["y", "n", ""]


def ask_continue(question):
  '''
  continue or stop
  '''
  print_ok("\n" + question)
  answer = input(QUESTION)
  while not (answer in KEYS):
    answer = input(QUESTION)

  if answer == "n":
    return print_warn("EXIT")
  else:
    return print_pass("CONTINUE")


def print_err(err):
  '''
  BOLD RED PRINT WITH FIGURE
  '''
  print("\n" + b.ERR + err + b.END + "\n")
  return NO


def print_warn(warn):
  '''
  BOLD RED PRINT WITH FIGURE
  '''
  print("\n" + b.WARN + warn + b.END + "\n")
  return NO


def print_head(head):
  '''
  Pring Head
  '''
  print("\n" + b.HEADER + head + b.END + "\n")
  return OK


def print_blue(text):
  '''
  Pring blue
  '''
  print("\n" + b.BLUE + text + b.END + "\n")
  return OK


def print_pass(desc):
  '''
  Print Description
  '''
  print("\n" + b.PASS + desc + ': ' + b.END + u'\u231b' + "\n")
  return OK


def print_err_msg(data):
  '''
  PrinT Error Message
  '''
  print("\n" + b.ERRMSG + data + b.END + "\n")
  return OK


def print_ok_msg(data):
  '''
  PrinT Error Message
  '''
  print("\n" + b.OKMSG + data + b.END + "\n")
  return OK


def print_ok(data):
  '''
  PrinT OK Message
  '''
  print("\n" + b.OK + data + b.END + "\n")
  return OK


def blue(string): return f"\n{b.BLUE}{string}{b.END}\n"
