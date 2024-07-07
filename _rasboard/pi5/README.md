# Raspberry Pi 5 dboard Configuration

## Kiosk on Boot

## `/home/dgrebb/.config/wayfire.ini`

- touch this file and create the path if needed
- `chmod +x` its permissions
- add the below

```bash
[autostart]
dboard = $HOME/dboard.sh
```

### Firefox

The trick is to use `firefox-esr`:

```shell
sudo apt install firefox-esr
```

And in the startup `dboard.sh` file:

```shell
#!/bin/sh

#chromium-browser --start-maximized --kiosk --touch-events=enabled --enable-features=OverlayScrollbar,OverlayScrollbarFlashAfterAnyScr>
MOZ_ENABLE_WAYLAND=1 firefox-esr --kiosk https://dboard.server
```

# Raspberry Pi Locale Settings

## Setting `en_US`

- Edit /etc/locale.gen and make sure that both en_US.UTF-8 and sk_SK.UTF-8 are uncommented.
- Run "sudo locale-gen"
- Edit /etc/default/locale to say:
    
```bash
LANG=sk_SK.UTF-8
LC_MESSAGES=en_US.UTF-8
```
