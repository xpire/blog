# I love scomo

## TODO how to get the decrypted file

Found that each paragraph was different

```python
with open('secret_message.txt', 'r') as f:
    data = f.readlines()

import string

chars = string.ascii_lowercase + string.ascii_uppercase

print(data)

result = []
for i in data:
    if len(i) == 1:
        result.append('0')
    elif i[-2] == ' ':
        result.append('1')
    else:
        result.append('0')

print("".join(result))
```

Using this script, get the second last character, and see if there is a space there or not

```
010001000101010101000011010101000100011001111011011010010101111101010010001100110110110001001100011010010101111101101100001100000011000000110000001100000100111100110000011011110110111100110000011101100011001101011111001101010110001100110000011011010011000001111101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

decrypt this output in binary for the flag

> Conversion: DUCTF{i_R3lLi_l0000O0oo0v3_5c0m0}
