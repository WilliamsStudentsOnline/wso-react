import {
  doAddCourse,
  doRemoveCourse,
  doHideCourse,
  doUnhideCourse,
  doSearchCourse,
  doLoadCourses,
  doResetLoad,
  doToggleConflict,
  doToggleDist,
  doToggleDiv,
  doToggleLevel,
  doToggleOthers,
  doToggleSem,
  doUpdateEnd,
  doUpdateStart
} from '../../actions/course';

describe('course action', () => {
  it('adds course', () => {
    const course = {title: 'course'};

    const expectedAction = {
      type: 'COURSE_ADD',
      course
    };
    const action = doAddCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it('removes course', () => {
    const course = {title: 'course'};

    const expectedAction = {
      type: 'COURSE_REMOVE',
      course
    };
    const action = doRemoveCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it('hides course', () => {
    const course = {title: 'course'};

    const expectedAction = {
      type: 'COURSE_HIDE',
      course
    };
    const action = doHideCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it('unhides course', () => {
    const course = {title: 'course'};

    const expectedAction = {
      type: 'COURSE_UNHIDE',
      course
    };
    const action = doUnhideCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it('searches course', () => {
    const param = 'param';
    const expectedAction = {
      type: 'SEARCH_COURSE',
      param
    };
    const action = doSearchCourse(param);

    expect(action).toEqual(expectedAction);
  });

  it('loads courses', () => {
    const newLoadGroup = 2;

    const expectedAction = {
      type: 'LOAD_COURSES',
      newLoadGroup
    };
    const action = doLoadCourses(newLoadGroup);

    expect(action).toEqual(expectedAction);
  });

  it('resets loading', () => {
    const expectedAction = {
      type: 'RESET_LOAD'
    };
    const action = doResetLoad();

    expect(action).toEqual(expectedAction);
  });

  it('toggles semester', () => {
    const index = 1;

    const expectedAction = {
      type: 'TOGGLE_SEM',
      index
    };
    const action = doToggleSem(index);

    expect(action).toEqual(expectedAction);
  });

  it('toggles distributions', () => {
    const index = 1;

    const expectedAction = {
      type: 'TOGGLE_DIST',
      index
    };
    const action = doToggleDist(index);

    expect(action).toEqual(expectedAction);
  });

  it('toggles divisions', () => {
    const index = 1;

    const expectedAction = {
      type: 'TOGGLE_DIV',
      index
    };
    const action = doToggleDiv(index);

    expect(action).toEqual(expectedAction);
  });

  it('toggles others', () => {
    const index = 1;

    const expectedAction = {
      type: 'TOGGLE_OTHERS',
      index
    };
    const action = doToggleOthers(index);

    expect(action).toEqual(expectedAction);
  });

  it('toggles conflict', () => {
    const expectedAction = {
      type: 'TOGGLE_CONFLICT'
    };
    const action = doToggleConflict();

    expect(action).toEqual(expectedAction);
  });

  it('toggles level', () => {
    const index = 1;

    const expectedAction = {
      type: 'TOGGLE_LEVEL',
      index
    };
    const action = doToggleLevel(index);

    expect(action).toEqual(expectedAction);
  });

  it('updates start time', () => {
    const time = '14:10';

    const expectedAction = {
      type: 'UPDATE_START',
      time
    };
    const action = doUpdateStart(time);

    expect(action).toEqual(expectedAction);
  });

  it('updates end time', () => {
    const time = '15:35';

    const expectedAction = {
      type: 'UPDATE_END',
      time
    };
    const action = doUpdateEnd(time);

    expect(action).toEqual(expectedAction);
  });
});
