import clsx from 'clsx';
import { setClassNames } from './lib/classNames-comp';

export const doClasses = {
  /*   init(props) {
    const initialClassNames =
      props.className || (props.attr || {}).className || [];
    const arrayClassNames =
      typeof initialClassNames === 'string'
        ? initialClassNames.split(' ')
        : initialClassNames;
    return typeof arrayClassNames === 'string'
      ? [arrayClassNames]
      : arrayClassNames;
  }, */
  update(props, state) {
    const theClassNames = setClassNames(props, state);
    return theClassNames;
  },

  prerender(...classNames) {
    return clsx(classNames);
  },
};
