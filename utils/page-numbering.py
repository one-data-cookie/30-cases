import random
import string

for i in range(1, 31):
    letters = ''.join(random.choice(string.ascii_lowercase) for _ in range(3))
    print(f"{i:02d}{letters}")
