#!/usr/bin/env osascript

tell application "Music"
	set theTrack to current track
	if favorited of theTrack then
		set favorited of theTrack to false
	else
		set favorited of theTrack to true
	end if
end tell
