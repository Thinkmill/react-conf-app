// @flow

export type ScheduleTimeRange = {
  start: Date,
  end: Date,
};

export type SpeakerType = {
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
  speaker: SpeakerType | Array<SpeakerType>,
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
