import {
  getAddedCourses,
  getHiddenCourses,
  getUnhiddenCourses,
  getSearchedCourses,
  getLoadedCourses,
  getStartTimes,
  getEndTimes,
  getFilters,
} from '../../selectors/course';

describe('Course Selector', () => {
  const course1 = {
    academic_year: 2020,
    semester: 'Fall',
    course_id: '018861',
    department: 'AFR',
    number: 201,
    section: '01',
    peoplesoft_number: '3937',
    consent: 'N',
    grading_basis: 'OPT',
    grading_basis_desc: 'Pass/Fail Available, Fifth Course Available',
    class_type: 'Studio',
    title_long: 'African Dance and Percussion',
    title_short: 'African Dance and Percussion',
    instructors: [
      {
        name: 'Sandra L. Burton',
        url: 'https://wso.williams.edu/factrak/professors/2535',
      },
      {
        name: 'Tendai Muparutsa',
        url: 'https://wso.williams.edu/factrak/professors/5585',
      },
    ],
    meetings: [
      {
        days: 'TF',
        start: '13:10',
        start12: '01:10PM',
        end: '15:50',
        end12: '03:50PM',
        facil: ' ',
      },
    ],
    attributes: {
      div_1: false,
      div_2: true,
      div_3: false,
      dpe: false,
      qfr: false,
      wac: false,
    },
    class_format:
      'Class hours will be divided among research and discussion of the dance, percussion, and music of two forms, as well as physical learning and group projects; also includes field trips to view an area performance and the archives at jacob pillow',
    class_req_eval:
      'Discussion of assignments, group response performances, and short research paper.  students enrolled for pe credit are responsible only for the performance-based projects',
    extra_info: '',
    prereqs: 'none',
    department_notes: '',
    description_search:
      "We will examine two forms that embody continuity of tradition or the impact of cultural shifts in generations. Lamban was created by the Djeli, popularly called Griots who historically served many roles in traditional society from the Kingdom of Ghana and Old Mali spanning the 12th-current centuries. This dance and music form continues as folklore in modern day Guinea, Senegal, Mali and The Gambia where it was created and practiced by the Mandinka people. Bira is an ancient and contemporary spiritual practice of Zimbabwe's Shona people. Both of these forms are enduring cultural practices while Kpanlogo from the modern West African state of Ghana represents the post-colonial identity of this nation's youth at the end of the 1950s.\nThis course can be taken for academic and/or PE credit",
    enrl_pref:
      'students who have taken DANC 100 or DANC 201; have experience in a campus-based performance ensemble; or have permission of the instructors',
  };

  const course2 = {
    academic_year: 2020,
    semester: 'Fall',
    course_id: '018861',
    department: 'AFR',
    number: 201,
    section: '01',
    peoplesoft_number: '3937',
    consent: 'N',
    grading_basis: 'OPT',
    grading_basis_desc: 'Pass/Fail Available, Fifth Course Available',
    class_type: 'Studio',
    title_long: 'African Dance and Percussion',
    title_short: 'African Dance and Percussion',
    instructors: [
      {
        name: 'Sandra L. Burton',
        url: 'https://wso.williams.edu/factrak/professors/2535',
      },
      {
        name: 'Tendai Muparutsa',
        url: 'https://wso.williams.edu/factrak/professors/5585',
      },
    ],
    meetings: [
      {
        days: 'TF',
        start: '13:10',
        start12: '01:10PM',
        end: '15:50',
        end12: '03:50PM',
        facil: ' ',
      },
    ],
    attributes: {
      div_1: false,
      div_2: true,
      div_3: false,
      dpe: false,
      qfr: false,
      wac: false,
    },
    class_format:
      'Class hours will be divided among research and discussion of the dance, percussion, and music of two forms, as well as physical learning and group projects; also includes field trips to view an area performance and the archives at jacob pillow',
    class_req_eval:
      'Discussion of assignments, group response performances, and short research paper.  students enrolled for pe credit are responsible only for the performance-based projects',
    extra_info: '',
    prereqs: 'none',
    department_notes: '',
    description_search:
      "We will examine two forms that embody continuity of tradition or the impact of cultural shifts in generations. Lamban was created by the Djeli, popularly called Griots who historically served many roles in traditional society from the Kingdom of Ghana and Old Mali spanning the 12th-current centuries. This dance and music form continues as folklore in modern day Guinea, Senegal, Mali and The Gambia where it was created and practiced by the Mandinka people. Bira is an ancient and contemporary spiritual practice of Zimbabwe's Shona people. Both of these forms are enduring cultural practices while Kpanlogo from the modern West African state of Ghana represents the post-colonial identity of this nation's youth at the end of the 1950s.\nThis course can be taken for academic and/or PE credit",
    enrl_pref:
      'students who have taken DANC 100 or DANC 201; have experience in a campus-based performance ensemble; or have permission of the instructors',
  };

  const course3 = {
    academic_year: 2020,
    semester: 'Fall',
    course_id: '020209',
    department: 'AFR',
    number: 105,
    section: '01',
    peoplesoft_number: '1089',
    consent: 'N',
    grading_basis: 'OPT',
    grading_basis_desc: 'Pass/Fail Available, Fifth Course Available',
    class_type: 'Lecture',
    title_long: 'Materials, Meanings, and Messages in the Arts of Africa',
    title_short: 'African Art Survey',
    instructors: [
      {
        name: 'Michelle M. Apotsos',
        url: 'https://wso.williams.edu/factrak/professors/5558',
      },
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

  const INITIAL_STATE = {
    courseState: {
      added: [course1, course3],
      hidden: [course3],
      loadGroup: 1,
      searched: [course1, course2, course3],
      queried: [course1, course2, course3],
      startTimes: ['08:30', '11:00'],
      endTimes: ['09:45', '12:15'],
      filters: {
        semesters: [false, false, false],
        distributions: [false, false, false],
        divisions: [false, false, false],
        others: [false, false],
        levels: [false, false, false, false, false],
        conflict: [true],
        start: '',
        end: '',
      },
    },
  };

  const INITIAL_STATE_2 = {
    courseState: {
      added: [course1, course3],
      hidden: [course3],
      loadGroup: 1,
      searched: [course1, course2, course3],
      queried: [course1, course2, course3],
      startTimes: ['08:30', '11:00'],
      endTimes: ['09:45', '12:15'],
      filters: {
        semesters: [false, false, false],
        distributions: [false, false, false],
        divisions: [false, false, false],
        others: [false, false],
        levels: [false, false, false, false, false],
        conflict: [false],
        start: '',
        end: '',
      },
    },
  };

  it('retrieves filters', () => {
    const expectedFilters = {
      semesters: [false, false, false],
      distributions: [false, false, false],
      divisions: [false, false, false],
      others: [false, false],
      levels: [false, false, false, false, false],
      conflict: [true],
      start: '',
      end: '',
    };
    const filters = getFilters(INITIAL_STATE);
    expect(filters).toEqual(expectedFilters);
  });

  it('gets searched courses', () => {
    const expectedSearchedCourses = [course1, course2, course3];
    const searchedCourses = getSearchedCourses(INITIAL_STATE_2);
    expect(searchedCourses).toEqual(expectedSearchedCourses);
  });

  it('gets loaded courses', () => {
    const expectedLoadedCourses = [course1, course2, course3];
    const loadedCourses = getLoadedCourses(INITIAL_STATE_2);
    expect(loadedCourses).toEqual(expectedLoadedCourses);
  });

  it('gets added courses', () => {
    const expectedAddedCourses = [course1, course3];
    const addedCourses = getAddedCourses(INITIAL_STATE);
    expect(addedCourses).toEqual(expectedAddedCourses);
  });

  it('gets hidden courses', () => {
    const expectedHiddenCourses = [course3];
    const hiddenCourses = getHiddenCourses(INITIAL_STATE);
    expect(hiddenCourses).toEqual(expectedHiddenCourses);
  });

  it('gets unhidden courses', () => {
    const expectedUnhiddenCourses = [course1];
    const unhiddenCourses = getUnhiddenCourses(INITIAL_STATE);
    expect(unhiddenCourses).toEqual(expectedUnhiddenCourses);
  });

  it('gets start times', () => {
    const expectedStartTime = ['08:30', '11:00'];
    const startTime = getStartTimes(INITIAL_STATE);
    expect(startTime).toEqual(expectedStartTime);
  });

  it('gets end times', () => {
    const expectedEndTime = ['09:45', '12:15'];
    const endTime = getEndTimes(INITIAL_STATE);
    expect(endTime).toEqual(expectedEndTime);
  });
});
