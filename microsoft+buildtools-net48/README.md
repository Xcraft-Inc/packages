https://download.visualstudio.microsoft.com/download/pr/1192d0de-5c6d-4274-b64d-c387185e4f45/605089bf72da4da4d27eb0cfcec569ed61f5cf5671aa6d3dece1487abfd62cab/vs_BuildTools.exe

```sh
./vs_BuildTools.exe \
  --layout microsoft+buildtools-net48 \
  --lang En-us \
  --locale En-us \
  --add Microsoft.VisualStudio.Component.NuGet.BuildTools \
  --add Microsoft.Net.Component.4.8.TargetingPack \
  --add Microsoft.Net.Component.4.8.SDK
```
