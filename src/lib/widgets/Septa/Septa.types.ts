/**
 * Type representing SEPTA next-to-arrive data.
 */
export interface SeptaNextToArriveData {
  orig_train: string;
  orig_line: string;
  orig_departure_time: string;
  orig_arrival_time: string;
  orig_delay: string;
  isdirect: string;
}
