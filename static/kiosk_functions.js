// Kiosk API of Kiosk Pro Plus (11.2.1.14126)

if (typeof(___kp_executeURL) !== "function")
{
	// Common JS-ObjC-Bridge API:
	function ___kp_executeURL(url)
	{
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", url);
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	}
}

// Kiosk Version API:
if (typeof(kp_VersionAPI_requestFullVersion) !== "function")
{
	function kp_VersionAPI_requestFullVersion(callback)
	{
		___kp_executeURL("kioskpro://kp_VersionAPI_requestFullVersion?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_VersionAPI_requestMainVersion) !== "function")
{
	function kp_VersionAPI_requestMainVersion(callback)
	{
		___kp_executeURL("kioskpro://kp_VersionAPI_requestMainVersion?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_VersionAPI_requestBuildNumber) !== "function")
{
	function kp_VersionAPI_requestBuildNumber(callback)
	{
		___kp_executeURL("kioskpro://kp_VersionAPI_requestBuildNumber?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_VersionAPI_requestProductName) !== "function")
{
	function kp_VersionAPI_requestProductName(callback)
	{
		___kp_executeURL("kioskpro://kp_VersionAPI_requestProductName?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_VersionAPI_requestProductNameWithFullVersion) !== "function")
{
	function kp_VersionAPI_requestProductNameWithFullVersion(callback)
	{
		___kp_executeURL("kioskpro://kp_VersionAPI_requestProductNameWithFullVersion?" + encodeURIComponent(callback));
	}
}


// Kiosk Accessibility API:
if (typeof(kp_AccessibilityAPI_isVoiceOverRunning) !== "function")
{
	function kp_AccessibilityAPI_isVoiceOverRunning(callback)
	{
		___kp_executeURL("kioskpro://kp_AccessibilityAPI_isVoiceOverRunning?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_AccessibilityAPI_enableVoiceOver) !== "function")
{
	function kp_AccessibilityAPI_enableVoiceOver(callback)
	{
		___kp_executeURL("kioskpro://kp_AccessibilityAPI_enableVoiceOver?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_AccessibilityAPI_disableVoiceOver) !== "function")
{
	function kp_AccessibilityAPI_disableVoiceOver(callback)
	{
		___kp_executeURL("kioskpro://kp_AccessibilityAPI_disableVoiceOver?" + encodeURIComponent(callback));
	}
}


// Identification API:
if (typeof(kp_requestKioskId) !== "function")
{
	function kp_requestKioskId(callback)
	{
		___kp_executeURL("kioskpro://kp_requestKioskId?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_Identification_setKioskId) !== "function")
{
	function kp_Identification_setKioskId(kioskId,callback)
	{
		___kp_executeURL("kioskpro://kp_Identification_setKioskId?" + encodeURIComponent(kioskId) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_Identification_getGroupIDs) !== "function")
{
	function kp_Identification_getGroupIDs()
	{
		___kp_executeURL("kioskpro://kp_Identification_getGroupIDs");
	}
}


if (typeof(kp_Identification_requestDeviceContextInfo) !== "function")
{
	function kp_Identification_requestDeviceContextInfo(callback)
	{
		___kp_executeURL("kioskpro://kp_Identification_requestDeviceContextInfo?" + encodeURIComponent(callback));
	}
}


// File API:
if (typeof(writeToFile) !== "function")
{
	function writeToFile(fileName,data,callback)
	{
		___kp_executeURL("kioskpro://writeToFile?" + encodeURIComponent(fileName) + "&" + encodeURIComponent(data) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(fileExists) !== "function")
{
	function fileExists(filename,callback)
	{
		___kp_executeURL("kioskpro://fileExists?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(deleteFile) !== "function")
{
	function deleteFile(filename,callback)
	{
		___kp_executeURL("kioskpro://deleteFile?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_FileAPI_renameFile) !== "function")
{
	function kp_FileAPI_renameFile(oldFilename,newFilename,callback)
	{
		___kp_executeURL("kioskpro://kp_FileAPI_renameFile?" + encodeURIComponent(oldFilename) + "&" + encodeURIComponent(newFilename) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_FileAPI_base64FromFile) !== "function")
{
	function kp_FileAPI_base64FromFile(filename,callback)
	{
		___kp_executeURL("kioskpro://kp_FileAPI_base64FromFile?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback));
	}
}


// Photo & Video API:
if (typeof(saveScreenToPng) !== "function")
{
	function saveScreenToPng(filename,x,y,width,height,callback)
	{
		___kp_executeURL("kioskpro://saveScreenToPng?" + encodeURIComponent(filename) + "&" + encodeURIComponent(x) + "&" + encodeURIComponent(y) + "&" + encodeURIComponent(width) + "&" + encodeURIComponent(height) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_setCameraType) !== "function")
{
	function kp_PhotoVideo_setCameraType(shouldUseFrontCamera,callback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_setCameraType?" + encodeURIComponent(shouldUseFrontCamera) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_getCameraType) !== "function")
{
	function kp_PhotoVideo_getCameraType(callback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_getCameraType?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_setFlashMode) !== "function")
{
	function kp_PhotoVideo_setFlashMode(flashMode)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_setFlashMode?" + encodeURIComponent(flashMode));
	}
}


if (typeof(kp_PhotoVideo_getFlashMode) !== "function")
{
	function kp_PhotoVideo_getFlashMode(callback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_getFlashMode?" + encodeURIComponent(callback));
	}
}


if (typeof(takePhotoToFile) !== "function")
{
	function takePhotoToFile(filename,callback)
	{
		___kp_executeURL("kioskpro://takePhotoToFile?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_takePhotoToFileResize) !== "function")
{
	function kp_PhotoVideo_takePhotoToFileResize(filename,callback,photoWidthPxls,photoHeightPxls)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_takePhotoToFileResize?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback) + "&" + encodeURIComponent(photoWidthPxls) + "&" + encodeURIComponent(photoHeightPxls));
	}
}


if (typeof(takePhotoWithCountdownToFile) !== "function")
{
	function takePhotoWithCountdownToFile(filename,callback,counter,message,showingTime)
	{
		___kp_executeURL("kioskpro://takePhotoWithCountdownToFile?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback) + "&" + encodeURIComponent(counter) + "&" + encodeURIComponent(message) + "&" + encodeURIComponent(showingTime));
	}
}


if (typeof(kp_PhotoVideo_takePhotoWithCountdownToFileResize) !== "function")
{
	function kp_PhotoVideo_takePhotoWithCountdownToFileResize(filename,callback,counter,message,showingTime,photoWidthPxls,photoHeightPxls)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_takePhotoWithCountdownToFileResize?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback) + "&" + encodeURIComponent(counter) + "&" + encodeURIComponent(message) + "&" + encodeURIComponent(showingTime) + "&" + encodeURIComponent(photoWidthPxls) + "&" + encodeURIComponent(photoHeightPxls));
	}
}


if (typeof(takeVideoToFile) !== "function")
{
	function takeVideoToFile(filename,callback)
	{
		___kp_executeURL("kioskpro://takeVideoToFile?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_takeVideoWithCountdown) !== "function")
{
	function kp_PhotoVideo_takeVideoWithCountdown(filename,callback,intervalBeforeStart,recordingTime,showRecordingCountdownTimer,successMessage)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_takeVideoWithCountdown?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback) + "&" + encodeURIComponent(intervalBeforeStart) + "&" + encodeURIComponent(recordingTime) + "&" + encodeURIComponent(showRecordingCountdownTimer) + "&" + encodeURIComponent(successMessage));
	}
}


if (typeof(kp_PhotoVideo_takeVideoWithEndingByTouchingScreen) !== "function")
{
	function kp_PhotoVideo_takeVideoWithEndingByTouchingScreen(filename,callback,intervalBeforeStart,maxRecordingTime,messageDuringRecording,showRecordingTimer,successMessage)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_takeVideoWithEndingByTouchingScreen?" + encodeURIComponent(filename) + "&" + encodeURIComponent(callback) + "&" + encodeURIComponent(intervalBeforeStart) + "&" + encodeURIComponent(maxRecordingTime) + "&" + encodeURIComponent(messageDuringRecording) + "&" + encodeURIComponent(showRecordingTimer) + "&" + encodeURIComponent(successMessage));
	}
}


if (typeof(kp_PhotoVideo_base64FromScaledPhoto) !== "function")
{
	function kp_PhotoVideo_base64FromScaledPhoto(filename,photoDesiredWidthPxls,photoHeightPxls,callback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_base64FromScaledPhoto?" + encodeURIComponent(filename) + "&" + encodeURIComponent(photoDesiredWidthPxls) + "&" + encodeURIComponent(photoHeightPxls) + "&" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_startNewCaptureFlow) !== "function")
{
	function kp_PhotoVideo_startNewCaptureFlow(captureFlowTaskJSONString,parsingJSONReportCallback,workingReportCallback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_startNewCaptureFlow?" + encodeURIComponent(captureFlowTaskJSONString) + "&" + encodeURIComponent(parsingJSONReportCallback) + "&" + encodeURIComponent(workingReportCallback));
	}
}


if (typeof(kp_PhotoVideo_cancelCaptureFlow) !== "function")
{
	function kp_PhotoVideo_cancelCaptureFlow(callback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_cancelCaptureFlow?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_PhotoVideo_isCaptureFlowInProgress) !== "function")
{
	function kp_PhotoVideo_isCaptureFlowInProgress(callback)
	{
		___kp_executeURL("kioskpro://kp_PhotoVideo_isCaptureFlowInProgress?" + encodeURIComponent(callback));
	}
}


// Memory & Privacy API:
if (typeof(kp_Browser_clearCookies) !== "function")
{
	function kp_Browser_clearCookies()
	{
		___kp_executeURL("kioskpro://kp_Browser_clearCookies");
	}
}


if (typeof(kp_Browser_clearCache) !== "function")
{
	function kp_Browser_clearCache()
	{
		___kp_executeURL("kioskpro://kp_Browser_clearCache");
	}
}


if (typeof(kp_Browser_clearLocalStorage) !== "function")
{
	function kp_Browser_clearLocalStorage()
	{
		___kp_executeURL("kioskpro://kp_Browser_clearLocalStorage");
	}
}


// Dropbox API:
if (typeof(kp_DBXSyncManager_sync) !== "function")
{
	function kp_DBXSyncManager_sync()
	{
		___kp_executeURL("kioskpro://kp_DBXSyncManager_sync");
	}
}


if (typeof(kp_DBXSyncManager_stopObservingChangesOfType) !== "function")
{
	function kp_DBXSyncManager_stopObservingChangesOfType(typeOfChanges)
	{
		___kp_executeURL("kioskpro://kp_DBXSyncManager_stopObservingChangesOfType?" + encodeURIComponent(typeOfChanges));
	}
}


if (typeof(kp_DBXSyncManager_startObservingChangesOfType) !== "function")
{
	function kp_DBXSyncManager_startObservingChangesOfType(typeOfChanges)
	{
		___kp_executeURL("kioskpro://kp_DBXSyncManager_startObservingChangesOfType?" + encodeURIComponent(typeOfChanges));
	}
}


if (typeof(kp_DBXSyncManager_getTypeOfObservingChanges) !== "function")
{
	function kp_DBXSyncManager_getTypeOfObservingChanges(callback)
	{
		___kp_executeURL("kioskpro://kp_DBXSyncManager_getTypeOfObservingChanges?" + encodeURIComponent(callback));
	}
}


// AirPrinter API:
if (typeof(kp_AirPrinter_requestStateOfSupporting) !== "function")
{
	function kp_AirPrinter_requestStateOfSupporting()
	{
		___kp_executeURL("kioskpro://kp_AirPrinter_requestStateOfSupporting");
	}
}


if (typeof(kp_AirPrinter_print) !== "function")
{
	function kp_AirPrinter_print()
	{
		___kp_executeURL("kioskpro://kp_AirPrinter_print");
	}
}


if (typeof(kp_AirPrinter_printPdf) !== "function")
{
	function kp_AirPrinter_printPdf(filename)
	{
		___kp_executeURL("kioskpro://kp_AirPrinter_printPdf?" + encodeURIComponent(filename));
	}
}


if (typeof(kp_AirPrinter_printHTMLString) !== "function")
{
	function kp_AirPrinter_printHTMLString(htmlString)
	{
		___kp_executeURL("kioskpro://kp_AirPrinter_printHTMLString?" + encodeURIComponent(htmlString));
	}
}


// Common Printer API:
if (typeof(print) !== "function")
{
	function print()
	{
		___kp_executeURL("kioskpro://print");
	}
}


if (typeof(kp_CommonPrintingAPI_requestEnabledPrinterType) !== "function")
{
	function kp_CommonPrintingAPI_requestEnabledPrinterType(callback)
	{
		___kp_executeURL("kioskpro://kp_CommonPrintingAPI_requestEnabledPrinterType?" + encodeURIComponent(callback));
	}
}


// Idle Timer API:
if (typeof(kp_IdleTimer_fire) !== "function")
{
	function kp_IdleTimer_fire()
	{
		___kp_executeURL("kioskpro://kp_IdleTimer_fire");
	}
}


// KioWare API:
if (typeof(kp_KioWare_closeCurrentSession) !== "function")
{
	function kp_KioWare_closeCurrentSession()
	{
		___kp_executeURL("kioskpro://kp_KioWare_closeCurrentSession");
	}
}


if (typeof(kp_KioWare_registerNavigation) !== "function")
{
	function kp_KioWare_registerNavigation(url,pageTitle,callback)
	{
		___kp_executeURL("kioskpro://kp_KioWare_registerNavigation?" + encodeURIComponent(url) + "&" + encodeURIComponent(pageTitle) + "&" + encodeURIComponent(callback));
	}
}


// Zapier API:
if (typeof(kp_Zapier_sendNotificationToZap) !== "function")
{
	function kp_Zapier_sendNotificationToZap(urlOfZap,data,callback)
	{
		___kp_executeURL("kioskpro://kp_Zapier_sendNotificationToZap?" + encodeURIComponent(urlOfZap) + "&" + encodeURIComponent(data) + "&" + encodeURIComponent(callback));
	}
}


// Autonomous Single App Mode API:
if (typeof(kp_AutonomousSingleAppModeAPI_startSession) !== "function")
{
	function kp_AutonomousSingleAppModeAPI_startSession(silently)
	{
		___kp_executeURL("kioskpro://kp_AutonomousSingleAppModeAPI_startSession?" + encodeURIComponent(silently));
	}
}


if (typeof(kp_AutonomousSingleAppModeAPI_endSession) !== "function")
{
	function kp_AutonomousSingleAppModeAPI_endSession(silently)
	{
		___kp_executeURL("kioskpro://kp_AutonomousSingleAppModeAPI_endSession?" + encodeURIComponent(silently));
	}
}


// Geolocation API:
if (typeof(kp_Geolocation_requestLocation) !== "function")
{
	function kp_Geolocation_requestLocation(callback)
	{
		___kp_executeURL("kioskpro://kp_Geolocation_requestLocation?" + encodeURIComponent(callback));
	}
}


// Guided Access API:
if (typeof(kp_GuidedAccess_requestStatus) !== "function")
{
	function kp_GuidedAccess_requestStatus()
	{
		___kp_executeURL("kioskpro://kp_GuidedAccess_requestStatus");
	}
}


// Synthesized Speech API:
if (typeof(kp_Speech_speak) !== "function")
{
	function kp_Speech_speak(speechString,speechUtteranceConfig)
	{
		___kp_executeURL("kioskpro://kp_Speech_speak?" + encodeURIComponent(speechString) + "&" + encodeURIComponent(speechUtteranceConfig));
	}
}


if (typeof(kp_Speech_stop) !== "function")
{
	function kp_Speech_stop()
	{
		___kp_executeURL("kioskpro://kp_Speech_stop");
	}
}


if (typeof(kp_Speech_pause) !== "function")
{
	function kp_Speech_pause()
	{
		___kp_executeURL("kioskpro://kp_Speech_pause");
	}
}


if (typeof(kp_Speech_continue) !== "function")
{
	function kp_Speech_continue()
	{
		___kp_executeURL("kioskpro://kp_Speech_continue");
	}
}


if (typeof(kp_Speech_requestCurrentLanguageCode) !== "function")
{
	function kp_Speech_requestCurrentLanguageCode(callback)
	{
		___kp_executeURL("kioskpro://kp_Speech_requestCurrentLanguageCode?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_Speech_requestListOfLanguageCodes) !== "function")
{
	function kp_Speech_requestListOfLanguageCodes(callback)
	{
		___kp_executeURL("kioskpro://kp_Speech_requestListOfLanguageCodes?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_Speech_requestListOfVoiceIdentifiers) !== "function")
{
	function kp_Speech_requestListOfVoiceIdentifiers(callback)
	{
		___kp_executeURL("kioskpro://kp_Speech_requestListOfVoiceIdentifiers?" + encodeURIComponent(callback));
	}
}


// Navigation Bar Visibility API:
if (typeof(kp_navigationBarVisibility_show) !== "function")
{
	function kp_navigationBarVisibility_show()
	{
		___kp_executeURL("kioskpro://kp_navigationBarVisibility_show");
	}
}


if (typeof(kp_navigationBarVisibility_hide) !== "function")
{
	function kp_navigationBarVisibility_hide()
	{
		___kp_executeURL("kioskpro://kp_navigationBarVisibility_hide");
	}
}


if (typeof(kp_navigationBarVisibility_reset) !== "function")
{
	function kp_navigationBarVisibility_reset()
	{
		___kp_executeURL("kioskpro://kp_navigationBarVisibility_reset");
	}
}


// Accelerometer API:
if (typeof(kp_AccelerometerAPI_startListenToEvents) !== "function")
{
	function kp_AccelerometerAPI_startListenToEvents(callback)
	{
		___kp_executeURL("kioskpro://kp_AccelerometerAPI_startListenToEvents?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_AccelerometerAPI_stopListenToEvents) !== "function")
{
	function kp_AccelerometerAPI_stopListenToEvents(callback)
	{
		___kp_executeURL("kioskpro://kp_AccelerometerAPI_stopListenToEvents?" + encodeURIComponent(callback));
	}
}


if (typeof(kp_AccelerometerAPI_getState) !== "function")
{
	function kp_AccelerometerAPI_getState(callback)
	{
		___kp_executeURL("kioskpro://kp_AccelerometerAPI_getState?" + encodeURIComponent(callback));
	}
}


// InApp-Settings API:
if (typeof(kp_InAppSettings_triggerInAppSettings) !== "function")
{
	function kp_InAppSettings_triggerInAppSettings(requirePasscode,callback)
	{
		___kp_executeURL("kioskpro://kp_InAppSettings_triggerInAppSettings?" + encodeURIComponent(requirePasscode) + "&" + encodeURIComponent(callback));
	}
}



// Set hooks are available:
window.kioskpro_hooks_available = 1;