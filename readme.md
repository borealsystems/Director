# BorealDirector

---

The Canonical Repository is https://phabricator.boreal.systems/source/Director/

Come chat: irc://irc.freenode.net/#BorealSystems

## Intent
The intention of this project is to create an open facility scale orchestration and automation suite for broadcast and other live events with a practically limitless amount of actions that can be activated by numerous common network based control protocols and hardware panels. This project is not to be considered production ready, please utilize it cautiously whilst development continues.

## State
### Functionality
- [x] Device Descriptors
- - [ ] Broadcast Device Definition Language (Maybe)
- [x] Actions
- - [ ] Mutatable Actions
- [ ] Feedbacks
- [ ] Web Management
- [ ] User Auth
- [ ] User segmentation and access control (Playout, Edit Bay, Master Control, etc)
- [ ] External auth providers
- [ ] Time Based Automation
- [ ] State Based Automation

### Software Control
- [ ] HTTP
- [ ] TCP
- [ ] UDP
- [ ] OSC
- [ ] Artnet
- [ ] sACN
- [ ] MIDI
- [ ] RossTalk
- [ ] Ember+
- [ ] RFP (Director Link)

### Hardware Control
- [ ] Elgato Streamdeck (via Director Link)
- [ ] Blackmagic Design Router Panels
- [ ] Ross Ultrix RCP
- [ ] Aja Kuma Router Panels
- [ ] Lawo vsmGEAR
- [ ] L-S-B Panels (Mostly the same as vsmGEAR)

## Ancilary Projects

### Director Link Protocol
The DLP is designed to facilitate the interconnection of different instances of both Director and 3rd part open control software in such a way that any action or device may have its configuration and functionality become available over the network, allowing remote integration of devices and control solutions that do not operate on an ethernet based PHY. Thus allowing devices such as Elgato's Streamdeck to operate in a remote location from the Director Core, and enabling devices such as the USB midi interfaces to be controlled from the Core.

## License
Boreal Director and all ancilary projects are licensed under the MIT License.

Copyright © 2019 Boreal Systems

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
