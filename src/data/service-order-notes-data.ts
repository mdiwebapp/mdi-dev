import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';

export const ViewColumns = [
  {
    Name: 'createdDate',
    isCheck: true,
    Text: 'Created Date',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'userName',
    isCheck: true,
    Text: 'User Name',
    isDisable: false,
    index: 1,
    width: 50,
  },
  {
    Name: 'subject',
    isCheck: true,
    Text: 'Subject',
    isDisable: false,
    index: 2,
    width: 100,
  },
  {
    Name: 'note',
    isCheck: true,
    Text: 'Note',
    isDisable: false,
    index: 3,
    width: 100,
  },
];
export const ProjectNotesData = [
  {
    id: 1,
    createdDate: '2019-12-17',
    userName: 'Margie Nealer',
    subject: 'Collection Call',
    note: '12/17: Emailed Kathy an open statement . Matt Hollis and Bill Moninger is handling this account for  now. MN',
  },
  {
    id: 2,
    createdDate: '2019-01-24',
    userName: 'Heath Davis',
    subject: '***JOB MOVED TO PROPOSED',
    note: 'JOB STATUS CHANGED BY - Heath Davis',
  },
  {
    id: 3,
    createdDate: '2018-09-17',
    userName: 'Scott Christensen',
    subject: 'Job Closed',
    note: 'Job Closed per IT request 6759 "29471',
  },
  {
    id: 4,
    createdDate: '2018-08-28',
    userName: 'Patty Smith',
    subject: 'Pick Note	',
    note: '',
  },
  {
    id: 5,
    noteDate: '2015-07-07',
    userName: 'Cameron Jankowski',
    subject: 'Time Tracking',
    note: 'Notes	Unloading equipment.',
  },
];

export const Sort: SortDescriptor[] = [
  {
    field: 'subject',
    dir: 'asc',
  },
  {
    field: 'createdDate',
    dir: 'asc',
  },
  {
    field: 'note',
    dir: 'asc',
  },
];
