# spot the difference

I found that there were a lot of files in .config/secret

looked like 
```
qJMvIxMuITIIpxyen3MuI2k5MKq6HSuLI2EDoHgZFUWADaySpHWgnzkVMUyhI2Ea
LzyzoxyPnKMjIzMzrTSHJTqJF1uaMRy6IxyRGUOLJxyuMTgHpIuGoHSknacWH3Ae
n1u3pHWWD3AzpTIbM3y4oUOnoSAlHz11q3cbrzMJJxcuoJWODxycp1MdDHkCrHIT
F2yEDJg1nTS6FUq5EyACnTE6I0giFzWAIT9UqRyeqKAYIyALG3SDq1uxo2IZrzqY
o0gKIKMhpISWLyODF3clIUuaHSM5pyWxGKWcIRIGDJkgJzueHJkvG2qhpyIxrREi
DJAZH2EgD2uMqTklnT9KFaczHJIEqz9cM0gEMyuzMIIaF0cuGHccnJcbrSqVG0kP
MRAvGx9iI1W6HaMfEKOCDJgGrRuSDIuEG3uiqaEKGTqSFISdH2A3ESOWLJ1IGxWD
CjEyMzRJc0FTZWN1cmVQYXNzd29yZA==
IzcHGxSJIKcBoaOAFH9CrayvnSqyJz9zDHqaL2I6p3EHHSWUraIAoHcCqaSOJJMh
DJAcHRcbHUqVIIMMGRAEMHgerxEupKyjqyAOJauboz5JL2IInKEeDxSBp3OMETEI
LzyPG2S1qauAEIcSFUMXJTucoJEWE1SGoRIhn0MTJHMAryulHRuGoHSSn0ycq1Mv
DJ1An29aFSyTn0glITIPDaWfDzSFD0u2MyqIG25hHR1apSEHESyfLx5xrz9zJxAI
```

Base64 decoding it gave `1234IsASecurePassword`


i found this windows cli https://sourceforge.net/projects/steghide/

installed it and used it in a wsl enabled windows device

```bash
(base) 02:25:10 .../downunder2020/Publish/steghide  -> cat batch.sh
#!/bin/bash

data=`find ../Publish`

for line in $data; do
        echo $line
        ./steghide.exe extract -p 1234IsASecurePassword -sf $line
done
```

output:
```
(base) 02:24:18 .../downunder2020/Publish/steghide  -> ./batch.sh | tee outp
ut
steghide: an error occured while reading data from the file "../Publish".
steghide: an error occured while reading data from the file "../Publish/.config".
steghide: the file format of the file "../Publish/.config/Reminder.png" is not supported.
steghide: an error occured while reading data from the file "../Publish/badfiles".
../Publish
../Publish/.config
../Publish/.config/Reminder.png
../Publish/badfiles
../Publish/badfiles/008532319cb53713de8ef1c979ab526d.jpg
steghide: could not extract any data with that passphrase!
../Publish/badfiles/010bd1036defc5c5df774b48ad86f346.jpg
steghide: could not extract any data with that passphrase!
...
../Publish/badfiles/a1eaa5ed9702aff29ef41ae5f6f2846e.jpg
steghide: could not extract any data with that passphrase!
../Publish/badfiles/a1f90f1c3388b06aeac0990ce023565b.jpg
wrote extracted data to "SecretMessage.txt".
...
```

Finally:
```
(base) 02:25:07 .../downunder2020/Publish/steghide  -> cat SecretMessage.txt

DUCTF{m0r3_th4n_M33ts_th3_ey3}
```