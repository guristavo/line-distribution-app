import React from 'react';
import PropTypes from 'prop-types';

import constants from '../../../utils/constants';
import ICONS from '../../../utils/icons';

const Icon = ({ type, size, color, inline, title }) => {
  const margin = inline ? '0 3px' : 0;

  if (!title) title = type;

  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle',
      margin,
      transform: 'translateY(-1px)',
    },
    path: {
      fill: constants.DEFAULT_COLORS[color],
    },
  };

  return (
    <svg
      title={title}
      style={styles.svg}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 100 100"
    >
      <path
        style={styles.path}
        d={ICONS[type]}
        className={`icon-${type}`}
        data-testid="icon-path"
      >
        <title>{title}</title>
      </path>
    </svg>
  );
};

Icon.propTypes = {
  type: PropTypes.oneOf(Object.keys(ICONS)),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.oneOf(Object.keys(constants.DEFAULT_COLORS)),
  inline: PropTypes.bool,
  title: PropTypes.string,
};

Icon.defaultProps = {
  type: 'default',
  size: 12,
  color: 'default',
  inline: false,
  title: null,
};

export default Icon;
