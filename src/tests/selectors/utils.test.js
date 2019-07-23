import {
  getCurrSubMenu,
  getGAPI,
  getSignInStatus,
  getNotifications,
  getSemester,
  getTimeFormat
} from '../../selectors/utils';

describe('Utility Selector', () => {
  const INITIAL_STATE = {
    utilState: {
      active: 'Timetable',
      gapi: {loaded_0: null, loaded_1: null},
      signedIn: true,
      notifications: [
        {
          type: 'SUCCESS',
          title: 'Title',
          body: 'Body'
        }
      ],
      semester: 2,
      twelveHour: true
    }
  };

  it('retrieves semester', () => {
    const expectedSemester = 2;
    const semester = getSemester(INITIAL_STATE);
    expect(semester).toEqual(expectedSemester);
  });

  it('retrieves time format', () => {
    const expectedTwelveHour = true;
    const twelveHour = getTimeFormat(INITIAL_STATE);
    expect(twelveHour).toEqual(expectedTwelveHour);
  });

  it('retrieves notifications', () => {
    const expectedNotification = [
      {
        type: 'SUCCESS',
        title: 'Title',
        body: 'Body'
      }
    ];
    const notification = getNotifications(INITIAL_STATE);
    expect(notification).toEqual(expectedNotification);
  });

  it('retrieves active state', () => {
    const expectedActive = 'Timetable';
    const active = getCurrSubMenu(INITIAL_STATE);
    expect(active).toEqual(expectedActive);
  });

  it('retrieves gapi', () => {
    const expectedGAPI = {loaded_0: null, loaded_1: null};
    const gapi = getGAPI(INITIAL_STATE);
    expect(gapi).toEqual(expectedGAPI);
  });

  it('retrieves Sign-in status', () => {
    const expectedSignInStatus = true;
    const signInStatus = getSignInStatus(INITIAL_STATE);
    expect(signInStatus).toEqual(expectedSignInStatus);
  });
});
