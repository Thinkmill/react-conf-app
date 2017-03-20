// @flow

export type ScheduleTimeRange = {
  start: Date,
  end: Date,
};

export type Speaker = {
  avatar: string,
  github?: string,
  name: string,
  twitter?: string,
  summary: string,
};

export type ScheduleTalk = {
  id: string,
  keynote: boolean,
  lightning: boolean,
  summary: string,
  title: string,
  speakers: Array<Speaker>,
  time: ScheduleTimeRange,
};

export type ScheduleBreak = {
  break: true,
  time: ScheduleTimeRange,
  title: string,
};

export type Schedule = {
  [string]: ScheduleTalk | ScheduleBreak,
};
