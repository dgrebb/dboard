#!/bin/sh

MOZ_ENABLE_WAYLAND=1 firefox-esr --kiosk https://dboard.server

# or with chromium
# chromium-browser --start-maximized --kiosk --touch-events=enabled --enable-features=OverlayScrollbar,OverlayScrollbarFlashAfterAnyScr>
