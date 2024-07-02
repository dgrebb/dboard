import {
  SECRET_AUDIO_CONTROL_IP_ADDRESS,
  SECRET_WIIM_SOAP_API_PORT,
} from '$env/static/private';
import type { Fetch } from '../types';
import { DOMParser } from 'xmldom';

/**
 * WiiM API interface.
 */
interface NowPlayingAPI {
  album: string;
  artist: string;
  title: string;
  art: string | null;
  totalTime: string;
  relativeTimePosition: string;
  loved: boolean;
}

interface MediaInfo {
  nrTracks: string | null;
  mediaDuration: string | null;
  currentURI: string | null;
  currentURIMetaData: string | null;
  nextURI: string | null;
  nextURIMetaData: string | null;
  trackSource: string | null;
  playMedium: string | null;
  recordMedium: string | null;
  writeStatus: string | null;
  loved: boolean;
}

interface PositionInfo {
  totalTime: string | null;
  relativeTimePosition: string | null;
}

const createSoapEnvelope = (
  action: string,
  service: string,
  instanceId: number = 0
): string => `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <u:${action} xmlns:u="urn:schemas-upnp-org:service:${service}:1">
      <InstanceID>${instanceId}</InstanceID>
    </u:${action}>
  </s:Body>
</s:Envelope>`;

const performSoapAction = async (
  fetch: Fetch,
  url: string,
  action: string,
  service: string,
  instanceId: number = 0
): Promise<string> => {
  const soapEnvelope = createSoapEnvelope(action, service, instanceId);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset="utf-8"',
      SOAPAction: `"urn:schemas-upnp-org:service:${service}:1#${action}"`,
    },
    body: soapEnvelope,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const textResponse = await response.text();
  return textResponse;
};

const parseXmlResponse = (responseXml: string): Document => {
  const parser = new DOMParser();
  return parser.parseFromString(responseXml, 'text/xml');
};

const extractValue = (xmlDoc: Document, tagName: string): string | null => {
  const element = xmlDoc.getElementsByTagName(tagName)[0];
  return element ? element.textContent : null;
};

const parseMediaInfoResponse = (responseXml: string): MediaInfo => {
  const xmlDoc = parseXmlResponse(responseXml);

  const extractBoolean = (tagName: string): boolean => {
    const value = extractValue(xmlDoc, tagName);
    return value === '1' || value?.toLowerCase() === 'true';
  };

  return {
    nrTracks: extractValue(xmlDoc, 'NrTracks'),
    mediaDuration: extractValue(xmlDoc, 'MediaDuration'),
    currentURI: extractValue(xmlDoc, 'CurrentURI'),
    currentURIMetaData: extractValue(xmlDoc, 'CurrentURIMetaData'),
    nextURI: extractValue(xmlDoc, 'NextURI'),
    nextURIMetaData: extractValue(xmlDoc, 'NextURIMetaData'),
    trackSource: extractValue(xmlDoc, 'TrackSource'),
    playMedium: extractValue(xmlDoc, 'PlayMedium'),
    recordMedium: extractValue(xmlDoc, 'RecordMedium'),
    writeStatus: extractValue(xmlDoc, 'WriteStatus'),
    loved: extractBoolean('Favorite'),
  };
};

const parsePositionInfoResponse = (responseXml: string): PositionInfo => {
  const xmlDoc = parseXmlResponse(responseXml);

  return {
    relativeTimePosition: extractValue(xmlDoc, 'RelTime'),
    totalTime: extractValue(xmlDoc, 'TrackDuration'),
  };
};

export const fetchMediaInfo = async (fetch: Fetch): Promise<NowPlayingAPI> => {
  const controlUrl = `http://${SECRET_AUDIO_CONTROL_IP_ADDRESS}:${SECRET_WIIM_SOAP_API_PORT}/upnp/control/rendertransport1`;

  try {
    const mediaInfoXml = await performSoapAction(
      fetch,
      controlUrl,
      'GetMediaInfo',
      'AVTransport'
    );
    const mediaInfo = parseMediaInfoResponse(mediaInfoXml);

    const positionInfoXml = await performSoapAction(
      fetch,
      controlUrl,
      'GetPositionInfo',
      'AVTransport'
    );
    const positionInfo = parsePositionInfoResponse(positionInfoXml);

    // Assuming the metadata is in DIDL-Lite format, we need to parse it
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      mediaInfo.currentURIMetaData || '',
      'text/xml'
    );

    const extractDIDLValue = (tagName: string): string | null => {
      const element = xmlDoc.getElementsByTagName(tagName)[0];
      return element ? element.textContent : null;
    };

    const nowPlayingInfo: NowPlayingAPI = {
      album: extractDIDLValue('upnp:album'),
      artist: extractDIDLValue('upnp:artist'),
      title: extractDIDLValue('dc:title'),
      art: extractDIDLValue('upnp:albumArtURI'),
      loved: mediaInfo.loved,
      totalTime: positionInfo.totalTime,
      relativeTimePosition: positionInfo.relativeTimePosition,
    };

    return nowPlayingInfo;
  } catch (error) {
    console.error('Error fetching media info:', error);
    throw error;
  }
};
