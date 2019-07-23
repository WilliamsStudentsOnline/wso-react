import deepFreeze from 'deep-freeze';
import courseReducer from '../../reducers/course';
import {
  SEMESTERS,
  DISTRIBUTIONS,
  DIVISIONS,
  OTHERS,
  LEVELS,
} from '../../constants/constants';

jest.mock('axios');

describe('Course reducer', () => {
  const course = {
    academic_year: 2020,
    semester: 'Fall',
    course_id: '020209',
    department: 'AFR',
    number: 105,
    components: ['Lecture'],
    cross_listings: ['AFR 105', 'ARTH 104'],
    section: '01',
    peoplesoft_number: '1089',
    consent: 'N',
    grading_basis: 'OPT',
    grading_basis_desc: 'Pass/Fail Available, Fifth Course Available',
    class_type: 'Lecture',
    title_long: 'Materials, Meanings, and Messages in the Arts of Africa',
    title_short: 'African Art Survey',
    instructors: [
      { name: 'Michelle M. Apotsos', url: '' },
      // Use the below for prod/dev testing, above for local
      // {name: 'Michelle M. Apotsos', url: 'https://wso.williams.edu/factrak/professors/5558'}
    ],
    meetings: [
      {
        days: 'MW',
        start: '11:00',
        start12: '11:00AM',
        end: '12:15',
        end12: '12:15PM',
        facil: ' ',
      },
    ],
    attributes: {
      div_1: false,
      div_2: true,
      div_3: false,
      dpe: true,
      qfr: false,
      wac: false,
    },
    class_format: 'Lecture',
    class_req_eval:
      'Three 2-page response papers, class journal on wcma objects lab, midterm exam and final exam',
    extra_info: '',
    prereqs: 'none',
    department_notes: '',
    description_search:
      'This course introduces students to the wealth, power, and diversity of expressive forms that have characterized the arts of Africa and its Diaspora from prehistory to the present. Pulling extensively from the collections at the Williams College Museum of Art and other campus resources, students will not only experience firsthand the wide array of objects that have been produced within this vast geography, but will also come to recognize how multiple senses including sight, sound, smell, and touch play a key role in understanding how these objects work within their respective contexts. As tools of political control, social protest, divine manifestation, and spiritual intervention, these objects and their associated performances also challenge what we might typically consider art in the Western tradition and as such students will be pushed to think beyond such terms in their examinations of these rich creative traditions.',
    enrl_pref: 'Art History and African Studies majors',
  };

  const otherCourse = {
    academic_year: 2020,
    semester: 'Fall',
    course_id: '020209',
    department: 'AMST',
    number: 126,
    components: ['Lecture'],
    cross_listings: 'AMST 126',
    section: '01',
    peoplesoft_number: '1092',
    consent: 'N',
    grading_basis: 'OPT',
    grading_basis_desc: 'Pass/Fail Available, Fifth Course Available',
    class_type: 'Lecture',
    title_long: 'something',
    title_short: 'Independent Study: WSO Development',
    instructors: [{ name: 'Garett Tok', url: '' }],
    meetings: [
      {
        days: 'MW',
        start: '11:00',
        start12: '11:00AM',
        end: '12:15',
        end12: '12:15PM',
        facil: ' ',
      },
    ],
    attributes: {
      div_1: false,
      div_2: true,
      div_3: false,
      dpe: true,
      qfr: false,
      wac: false,
    },
    class_format: 'Lecture',
    class_req_eval: 'None',
    extra_info: '',
    prereqs: 'none',
    department_notes: '',
    description_search: 'This course introduces students to develop WSO.',
    enrl_pref: 'Computer Science majors',
  };

  it('resets loads', () => {
    const action = {
      type: 'RESET_LOAD',
    };

    const previousState = { loadGroup: 5, error: null };
    const expectedNewState = { loadGroup: 1, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('loads courses', () => {
    const index = 3;

    const action = {
      type: 'LOAD_COURSES',
      newLoadGroup: index,
    };

    const previousState = { loadGroup: 1, error: null };
    const expectedNewState = { loadGroup: 3, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('add courses', () => {
    const action = {
      type: 'COURSE_ADD',
      course,
    };

    const previousState = { added: [], error: null };
    const expectedNewState = { added: [course], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('removes courses', () => {
    const action = {
      type: 'COURSE_REMOVE',
      course,
    };

    const previousState = { added: [course], error: null };
    const expectedNewState = { added: [], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('hide courses', () => {
    const action = {
      type: 'COURSE_HIDE',
      course,
    };

    const previousState = { hidden: [], error: null };
    const expectedNewState = { hidden: [course], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('unhides courses', () => {
    const action = {
      type: 'COURSE_UNHIDE',
      course,
    };

    const previousState = { hidden: [course], error: null };
    const expectedNewState = { hidden: [], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('searches courses', () => {
    const param = 'AFR105';
    const filters = {
      semesters: [false, false, false],
      distributions: [false, false, false],
      divisions: [false, false, false],
      others: [false, false],
      levels: [false, false, false, false, false],
      conflict: [false],
      start: '',
      end: '',
      classTypes: [false, false, false, false, false, false],
    };
    const counts = {
      semesters: [0, 0, 0],
      distributions: [0, 0, 0],
      divisions: [0, 0, 0],
      others: [0, 0],
      levels: [0, 0, 0, 0, 0],
      conflict: [0],
      classTypes: [0, 0, 0, 0, 0, 0],
    };

    const loadAction = {
      type: 'LOAD_CATALOG',
      catalog: [course, otherCourse],
    };
    const action = {
      type: 'SEARCH_COURSE',
      param,
    };

    const previousState = {
      filters,
      searched: null,
      query: '',
      error: null,
      loadGroup: 1,
      counts,
      queried: [],
    };
    const expectedNewState = {
      filters,
      searched: [Object.assign({}, course, { score: 10001 })],
      query: param,
      error: null,
      loadGroup: 1,
      counts: {
        semesters: [1, 0, 0],
        distributions: [1, 0, 0],
        divisions: [0, 1, 0],
        others: [0, 0],
        levels: [0, 1, 0, 0, 0],
        conflict: [1],
        classTypes: [1, 0, 0, 0, 0, 0],
      },
      queried: [Object.assign({}, course, { score: 10001 })],
    };

    deepFreeze(previousState);

    const loadedState = courseReducer(previousState, loadAction);
    const changedState = courseReducer(loadedState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it('toggles conflict', () => {
    const action = {
      type: 'TOGGLE_CONFLICT',
    };

    const previousState = { filters: { conflict: [true] }, error: null };
    const expectedNewState = { filters: { conflict: [false] }, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('toggles semester', () => {
    const index = 1;

    const action = {
      type: 'TOGGLE_SEM',
      index,
    };

    const previousState = {
      filters: { semesters: [false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { semesters: [false, SEMESTERS[1], false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('toggles distribution', () => {
    const index = 1;

    const action = {
      type: 'TOGGLE_DIST',
      index,
    };

    const previousState = {
      filters: { distributions: [false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { distributions: [false, DISTRIBUTIONS[1], false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('toggles division', () => {
    const index = 1;

    const action = {
      type: 'TOGGLE_DIV',
      index,
    };

    const previousState = {
      filters: { divisions: [false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { divisions: [false, DIVISIONS[1], false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it('toggles others', () => {
    const index = 1;

    const action = {
      type: 'TOGGLE_OTHERS',
      index,
    };

    const previousState = { filters: { others: [false, false] }, error: null };
    const expectedNewState = {
      filters: { others: [false, OTHERS[1]] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it('toggles level', () => {
    const index = 1;

    const action = {
      type: 'TOGGLE_LEVEL',
      index,
    };

    const previousState = {
      filters: { levels: [false, false, false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { levels: [false, LEVELS[1], false, false, false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it('updates start time', () => {
    const time = '14:30';

    const action = {
      type: 'UPDATE_START',
      time,
    };

    const previousState = { filters: { start: '' }, error: null };
    const expectedNewState = { filters: { start: time }, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it('updates end time', () => {
    const time = '15:35';

    const action = {
      type: 'UPDATE_END',
      time,
    };

    const previousState = { filters: { end: '' }, error: null };
    const expectedNewState = { filters: { end: time }, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });
});
