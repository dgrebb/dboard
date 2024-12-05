#!/bin/sh

# Tell X Window System which display to use.
export DISPLAY=:0

# Set Firefox to use Wayland
MOZ_ENABLE_WAYLAND=1 firefox-esr --kiosk https://dboard.server
