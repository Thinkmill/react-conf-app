import PropTypes from "prop-types";

export const ScheduleTimeRange = PropTypes.shape({});

export const Speaker = PropTypes.shape({
  avatar: PropTypes.string.isRequired,
  github: PropTypes.string,
  name: PropTypes.string.isRequired,
  twitter: PropTypes.string,
  summary: PropTypes.string.isRequired
});

export const ScheduleTalk = PropTypes.shape({
  keynote: PropTypes.bool,
  lightning: PropTypes.bool,
  summary: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  speakers: PropTypes.arrayOf(Speaker),
  time: PropTypes.object.isRequired
});
export const ScheduleBreak = PropTypes.shape({
  break: PropTypes.bool.isRequired,
  time: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
});
