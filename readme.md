# BorealDirector

The Canonical Repository is https://phabricator.boreal.systems/source/Director/

Come chat: irc://irc.freenode.net/#BorealSystems

# THIS IS NOT PRODUCTION READY
While the core features are mostly stable, the device driver interfaces and the overall system architecture is NOT READY TO BE USED. Check in again at version 1.0.0.

## Intent
The intention of this project is to create an open facility scale orchestration and automation suite for broadcast and other live events with a practically limitless amount of actions that can be activated by numerous common network based control protocols and hardware panels. This project is not to be considered production ready, please utilize it cautiously whilst development continues.

## Features
### Core
- [x] Devices
- [x] Stacks
- [x] Panels
- [x] Controllers
- [ ] Feedbacks
- [x] Web Management
- [ ] User Auth
- [ ] User segmentation and access control (Playout, Edit Bay, Master Control, etc)
- [ ] External auth providers
- [ ] Time Based Automation
- [ ] State Based Automation
- [ ] Router Matrix/Flows

### Software Control
- [ ] HTTP
- [ ] GraphQL
- [ ] TCP
- [ ] UDP
- [ ] OSC
- [ ] Artnet
- [ ] sACN
- [ ] MIDI
- [ ] RossTalk
- [ ] Ember+

### Hardware Control
- [x] Elgato Streamdeck (via DirectorLink)
- [ ] Blackmagic Design Router Panels
- [ ] Ross Ultrix RCP
- [ ] Aja Kuma Router Panels

## License
Boreal Director is licensed under the GPLv3 License.
Copyright (C) 2020 Boreal Systems - Oliver Herrmann, https://boreal.systems

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
