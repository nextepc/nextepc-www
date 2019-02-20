---
title: openSUSE
order: 23
page: docs
---

openSUSE actually comes in 2 flavors:
```yaml
- stable and in some parts based on SLES (Leap)
- rolling (Tumbleweed)
```

## MME, SGW, PGW, HSS, and PCRF

openSUSE users can now run:
```bash
sudo zypper addrepo -f obs://home:mnhauke:nextepc home:mnhauke:nextepc
sudo zypper install nextepc
sudo zypper install mongodb-server mongodb-shell
```

## Web User Interface

Node.js is available in the main repositories under the following packages:

- openSUSE Leap 42.2: nodejs4
- openSUSE Leap 42.3: nodejs4, nodejs6
- openSUSE Tumbleweed: nodejs4, nodejs6, nodejs8
- SUSE Linux Enterprise Server (SLES) 121: nodejs4, nodejs6

For example, to install Node.js 8.x on openSUSE Tumbleweed, run the following as root:
```bash
sudo zypper install nodejs8
```

Install the dependencies to run WebUI

```bash
acetcom@nextepc:~$ git clone https://github.com/acetcom/nextepc
acetcom@nextepc:~$ cd nextepc/webui
acetcom@nextepc:~/nextepc/webui$ npm install
```

Running WebUI

```bash
acetcom@nextepc:~/nextepc/webui$ npm run dev
```

Now the web server is running on _http://localhost:3000_.
