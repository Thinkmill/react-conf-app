import PropTypes from "prop-types";

export const ScheduleTimeRange = PropTypes.shape({
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired
});

export const Speaker = PropTypes.shape({
  avatar: PropTypes.string.isRequired,
  github: PropTypes.string,
  name: PropTypes.string.isRequired,
  twitter: PropTypes.string,
  summary: PropTypes.string.isRequired
});

export const ScheduleTalk = PropTypes.shape({
  id: PropTypes.string.isRequired,
  keynote: PropTypes.bool.isRequired,
  lightning: PropTypes.bool.isRequired,
  summary: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  speakers: PropTypes.arrayOf(Speaker),
  time: ScheduleTimeRange.isRequired
});
export const ScheduleBreak = PropTypes.shape({
  break: PropTypes.bool.isRequired,
  time: ScheduleTimeRange.isRequired,
  title: PropTypes.string.isRequired
});
