mkdir dist/macos
mkdir dist/linux
mkdir dist/windows
mv dist/link-macos dist/macos/
mv dist/link-linux dist/linux/
mv dist/link-win.exe dist/windows/
mv dist/xdg-open dist/linux/
cp dist/HID.node dist/linux/
cp dist/HID.node dist/macos/
cp dist/HID.node dist/windows/
zip -r dist/macos.zip dist/macos
zip -r dist/linux.zip dist/linux
zip -r dist/windows.zip dist/windows