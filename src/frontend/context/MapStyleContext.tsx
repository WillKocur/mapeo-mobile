import * as React from "react";
import ky from "ky";
import MapboxGL from "@react-native-mapbox-gl/maps";
import createPersistedState from "../hooks/usePersistedState";
import api, { MapServerState, Subscription } from "../api";
import { useExperiments } from "../hooks/useExperiments";
import { normalizeStyleURL } from "../lib/mapbox";
import config from "../../config.json";

/** Key used to store most recent map id in Async Storage */
const MAP_STYLE_KEY = "@MAPSTYLE";

/** URL used for map style when no custom map and user is online */
export const onlineStyleURL = MapboxGL.StyleURL.Outdoors + "?" + Date.now();

/** URL used for map style when user is not online
 * generated by [mapeo-offline-map](https://github.com/digidem/mapeo-offline-map) */
export const fallbackStyleURL = "asset://offline-style.json";

export type OnlineState = "unknown" | "online" | "offline";

export type MapTypes =
  | "loading"
  | "mapServer"
  | "custom"
  | "online"
  | "fallback";

export type MapStyleContextType = {
  styleId: string;
  setStyleId: React.Dispatch<React.SetStateAction<string>>;
  mapServerReady: boolean;
  onlineMapState: OnlineState;
};

const defaultMapStyleContext: MapStyleContextType = {
  styleId: "",
  setStyleId: () => {},
  mapServerReady: false,
  onlineMapState: "unknown",
};

export const MapStyleContext: React.Context<MapStyleContextType> = React.createContext<
  MapStyleContextType
>(defaultMapStyleContext);

const usePersistedState = createPersistedState(MAP_STYLE_KEY);

export const MapStyleProvider: React.FC = ({ children }) => {
  const [mapServerReady, setMapServerReady] = React.useState(false);
  const [styleId, status, setStyleId] = usePersistedState<string>("");
  const [{ backgroundMaps }] = useExperiments();

  const [onlineMapState, setOnlineState] = React.useState<OnlineState>(
    "unknown"
  );

  // TODO: Eventually use the net info module to determine if internet access is available
  // Currently not truly a reflection of internet access
  React.useEffect(() => {
    let didCancel = false;

    ky.get(normalizeStyleURL(onlineStyleURL, config.mapboxAccessToken))
      .json()
      .then(() => didCancel || setOnlineState("online"))
      .catch(() => didCancel || setOnlineState("offline"));

    return () => {
      didCancel = true;
    };
  }, []);

  React.useEffect(() => {
    let subscription: Subscription | undefined;

    if (backgroundMaps) {
      subscription = api.maps.addServerStateListener(({ value }) => {
        setMapServerReady(value === "started");
      });
    }

    return () => subscription?.remove();
  }, [backgroundMaps]);

  const contextValue = React.useMemo(
    () => ({ styleId, setStyleId, mapServerReady, onlineMapState }),
    [styleId, setStyleId, mapServerReady, onlineMapState]
  );

  return (
    <MapStyleContext.Provider value={contextValue}>
      {status === "loading" ? null : children}
    </MapStyleContext.Provider>
  );
};
