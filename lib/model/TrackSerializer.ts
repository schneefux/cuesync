import TrackInfo from "./TrackInfo";

export default interface TrackSerializer<S> {
  deserialize(source: S): TrackInfo
  serialize(trackInfo: TrackInfo): S
}