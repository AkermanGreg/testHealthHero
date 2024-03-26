# fizzbuzz
# Built with Seahorse v0.2.0
#
# On-chain, persistent FizzBuzz!

from seahorse.prelude import *

# This is your program's public key and it will update
# automatically when you build the project.
declare_id('G64aSk2TLjzCNXdhLN8ANECas1uZW8azGsQ6uqGf96cy')

class FizzBuzz(Account):
    fizz: bool
    buzz: bool
    n: u64
    last_check_in: i64  # Represents the time of the last check-in as Unix timestamp

@instruction
def init(owner: Signer, fizzbuzz: Empty[FizzBuzz]):
    fizzbuzz.init(payer=owner, seeds=['fizzbuzz', owner])

@instruction
def check_in(fizzbuzz: FizzBuzz, timestamp: i64):
    fizzbuzz.last_check_in = timestamp



