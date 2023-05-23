export const ViewColumns = [
  {
    Name: 'serviceNumber',
    isCheck: true,
    Text: 'Service#',
    isDisable: true,
    index: 0,
    width: 150,
  },
  {
    Name: 'invNumber',
    isCheck: true,
    Text: 'Inv#',
    isDisable: false,
    index: 1,
    width: 150,
  },

  {
    Name: 'status',
    isCheck: true,
    Text: 'Status',
    isDisable: false,
    index: 3,
    width: 150,
  },
];
export const columns = [
  {
    Name: 'serviceNumber',
    isCheck: true,
    Text: 'Service#',
    isDisable: true,
    index: 0,
    width: 150,
  },
  {
    Name: 'invNumber',
    isCheck: true,
    Text: 'Inv#',
    isDisable: false,
    index: 1,
    width: 150,
  },
  {
    Name: 'branch',
    isCheck: true,
    Text: 'Branch',
    isDisable: false,
    index: 2,
    width: 150,
  },
  {
    Name: 'status',
    isCheck: false,
    Text: 'Status',
    isDisable: false,
    index: 3,
    width: 150,
  },
  {
    Name: 'custName',
    isCheck: false,
    Text: 'Customer',
    isDisable: false,
    index: 4,
    width: 150,
  },
  // {
  //   Name: 'unit',
  //   isCheck: false,
  //   Text: 'Unit',
  //   isDisable: false,
  //   index: 4,
  //   width: 150,
  // },
];
export const ServiceOrderData = [
  // {
  //   id: 1,
  //   service: 'V124963',
  //   inv: 'MP6186',
  //   branch: '',
  //   status: '',
  //   customer: '',
  //   unit: '',
  // },
  // {
  //   id: 2,
  //   service: 'V124962',
  //   inv: 'MP6244',
  //   branch: '',
  //   status: '',
  //   customer: '',
  //   unit: '',
  // },
  // {
  //   id: 3,
  //   service: 'V124961',
  //   inv: 'WP631',
  //   branch: '',
  //   status: '',
  //   customer: '',
  //   unit: '',
  // },
  // {
  //   id: 4,
  //   service: 'V124960',
  //   inv: 'R088',
  //   branch: '',
  //   status: '',
  //   customer: '',
  //   unit: '',
  // },
  // {
  //   id: 5,
  //   service: 'V124958',
  //   inv: 'MP8065',
  //   branch: '',
  //   status: '',
  //   customer: '',
  //   unit: '',
  // },
];

export const UnitList = [
  { id: 0, value: 'All Units' },
  { id: 1, value: 'COMPONENTS' },
  { id: 2, value: 'RENTAL FLEET' },
  { id: 3, value: 'VEHICLE' },
];

export const StatusList = [
  { id: 0, value: 'All Status' },
  { id: 1, value: 'ACTIVE' },
  { id: 3, value: 'CLOSED' },
  { id: 4, value: 'NEEDS INVOICED' },
  { id: 5, value: 'VOID' },
];
export const TopStatusList = [
  { id: 1, value: 'ACTIVE' },
  { id: 3, value: 'CLOSED' },
  { id: 4, value: 'NEEDS INVOICED' },
];
// Fuel System
export const FuelLevelList = [
  { id: 0, value: 'OVER' },
  { id: 1, value: 'FULL' },
  { id: 2, value: 'UNDER' },
  { id: 3, value: 'N/A' },
];
export const FuelWaterList = [
  { id: 0, value: 'YES' },
  { id: 1, value: 'NO' },
  { id: 2, value: 'N/A' },
];

export const HosePipeList = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const LeakageList = [
  { id: 0, value: 'YES' },
  { id: 1, value: 'NO' },
  { id: 2, value: 'N/A' },
];
//Lube System
export const CRANKCASEBREATHERList = [
  { id: 0, value: 'CLEAN' },
  { id: 1, value: 'CONTAMINATED' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const ENGINEOIL_CONDITIONList = [
  { id: 0, value: 'Clean' },
  { id: 1, value: 'Contaminated' },
  { id: 2, value: 'N/A' },
];
export const ENGINEOIL_LEVELList = [
  { id: 0, value: 'OVER' },
  { id: 1, value: 'FULL' },
  { id: 2, value: 'UNDER' },
  { id: 3, value: 'N/A' },
];

// Cooling System
export const COOLANT_LEVELList = [
  { id: 0, value: 'OVER' },
  { id: 1, value: 'FULL' },
  { id: 2, value: 'UNDER' },
  { id: 3, value: 'N/A' },
];

export const WATERPUMP_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKS' },
  { id: 2, value: 'CONTAMINATED' },
  { id: 3, value: 'N/A' },
];
export const FANSANDBELTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const WATERPUMPBEARINGS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Worn' },
  { id: 2, value: 'N/A' },
];
export const RADIATORCONDITION_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Leaks' },
  { id: 2, value: 'Contaminated' },
  { id: 3, value: 'N/A' },
];

// BATTERY System
export const BATTERY_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Leaks' },
  { id: 2, value: 'Contaminated' },
  { id: 3, value: 'N/A' },
];
export const BATTERYPOSTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const BATTERYCOMPARTMENT_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const BATTERYLEAKS_List = [
  { id: 0, value: 'YES' },
  { id: 1, value: 'NO' },
  { id: 2, value: 'N/A' },
];

// Electrical System
export const WIRINGCONDITION_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Corroded' },
  { id: 3, value: 'N/A' },
];
export const CONNECTIONS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const STARTERCONNECTIONS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const BREAKERS_FUSES_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const ALTERNATOR_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const CONTROLPANEL_LIST = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];

// Engine panel
export const AIRCLEANER_HOUSING_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const ENGINE_MOUNTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Worn' },
  { id: 2, value: 'Loose' },
  { id: 3, value: 'N/A' },
];
export const GOVERNERLINKAGE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const MSHAGUARDING_List = [
  { id: 0, value: 'YES' },
  { id: 1, value: 'NO' },
  { id: 2, value: 'N/A' },
];
export const SAFETYSWITCHES_List = [
  { id: 0, value: 'Working' },
  { id: 1, value: 'Not Working' },
  { id: 2, value: 'N/A' },
];
export const EMISSIONCONTROL_List = [
  { id: 0, value: 'NEUTRAL' },
  { id: 1, value: 'PARKING BRAKE' },
  { id: 2, value: 'N/A' },
];

//Centrifugal Pump
export const FOOTMOUNTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Damaged' },
  { id: 3, value: 'N/A' },
];
export const IMPELLERSCREWCAP_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const GLANDLIPSEAL_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];

export const IMPELLER_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const SEALRESERVOIRCONDITION_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const WEARRINGGAPS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const BEARINGS_List = [
  { id: 0, value: 'SMOOTH/EVEN' },
  { id: 1, value: 'ROUGH/UNEVEN' },
  { id: 2, value: 'N/A' },
];
export const GASKETS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const BALLVALVE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];

// Trailer
export const FRAME_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Bent' },
  { id: 2, value: 'Loose/Missing Bolts' },
  { id: 3, value: 'N/A' },
];
export const PINTLEHITCH_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const SAFETYLATCHES_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const WIRINGHARNESS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Corroded' },
  { id: 3, value: 'N/A' },
];
export const LIGHTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Corroded' },
  { id: 3, value: 'N/A' },
];
export const WHEELBEARINGS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Worn' },
  { id: 2, value: 'Loose' },
  { id: 3, value: 'N/A' },
];
export const WHEELS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const BRAKEACTUATOR_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const HUBS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Damaged' },
  { id: 3, value: 'N/A' },
];

// Coupler/Align/CheckValve
export const SETSCREWS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const ELEMENTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const HUBFLANGES_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const FLAPPERVALVE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const FLAPPERWEIGHT_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const SEALPLATE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];

// EXHAUST/ VAC TEST
export const MUFFLER_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const SUPPORTS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const RAINCAP_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];

// Air Seperation/ Reclaimer Tank
export const PEELERVALVE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const FLOATBALL_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const BACKFLOWVALVE_List = [
  { id: 0, value: 'Working' },
  { id: 1, value: 'Not Working' },
  { id: 2, value: 'N/A' },
];
export const HOSES_CONNECTIONS_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const COOLER_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const TANK_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];

// Oil Reclaimer Tank
export const OILLEVEL_List = [
  { id: 0, value: 'OVER' },
  { id: 1, value: 'FULL' },
  { id: 2, value: 'UNDER' },
  { id: 3, value: 'N/A' },
];
export const OILCONDITION_List = [
  { id: 0, value: 'Clean' },
  { id: 1, value: 'Contaminated ' },
  { id: 2, value: 'N/A' },
];
export const SMOKEFILTER_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const OILTANK_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const GASKETSHOSES_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Worn' },
  { id: 2, value: 'N/A' },
];
// TEST/ VACUUM PUMP
export const PULLEYCONDITION_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Damaged' },
  { id: 3, value: 'N/A' },
];
export const VACUUMPUMP_BEARINGS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Loose' },
  { id: 2, value: 'Damaged' },
  { id: 3, value: 'N/A' },
];
export const BELTCONDITION_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const SPAREBELTS_List = [
  { id: 0, value: 'YES' },
  { id: 1, value: 'NO' },
  { id: 2, value: 'N/A' },
];
// Enviorn Box / Suction Spool
export const HOSEANDBALL_VALVES_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const FLOATS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const FLOATVALVE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const FLOATSIZE_List = [
  { id: 0, value: '3/4' },
  { id: 1, value: '1 1/4' },
];
//Suction Spool
export const SPOOLSCREEN_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'PLUGGED' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const SPOOLBALLVALVE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const VACUUMGAUGE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
export const SPOOLGASKETS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];
// EXHAUST System
export const MUFFLER_PIPES_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];
export const SUPPORTS_HANGERS_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Missing' },
  { id: 3, value: 'N/A' },
];

// Compressor
export const VENTURIHOSES_List = [
  { id: 0, value: 'GOOD' },
  { id: 1, value: 'LEAKING' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const VENTURI_Rings_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const PULLEY_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'Worn' },
  { id: 3, value: 'N/A' },
];
export const AIRFILTERCONDITION_List = [
  { id: 0, value: 'CLEAN' },
  { id: 1, value: 'DIRTY' },
  { id: 2, value: 'DAMAGED' },
  { id: 3, value: 'N/A' },
];
export const COMPRESSOROILLEVEL_List = [
  { id: 0, value: 'OVER' },
  { id: 1, value: 'FULL' },
  { id: 2, value: 'UNDER' },
  { id: 3, value: 'N/A' },
];
export const COMPRESSOROILCONDITION_List = [
  { id: 0, value: 'Clean' },
  { id: 1, value: 'Contaminated' },
  { id: 2, value: 'N/A' },
];
export const POPOFFVALVE_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 2, value: 'N/A' },
];

export const COMPRESSORBELT_List = [
  { id: 0, value: 'Good' },
  { id: 1, value: 'Damaged' },
  { id: 1, value: 'Worn ' },
  { id: 2, value: 'N/A' },
];

export const PEER_VALVE_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Worn',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const FLOAT_BALL_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const BACK_FLOW_VALVE_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const HOSES_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'LEAKING',
  },
  {
    id: 2,
    value: 'DAMAGED',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const PEELAR_COOLER_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'LEAKING',
  },
  {
    id: 2,
    value: 'DAMAGED',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const TANK_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'LEAKING',
  },
  {
    id: 2,
    value: 'DAMAGED',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const OIL_LEVEL_LIST = [
  {
    id: 0,
    value: 'OVER',
  },
  {
    id: 1,
    value: 'FULL',
  },
  {
    id: 2,
    value: 'UNDER',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const OIL_CONDITION_LIST = [
  {
    id: 0,
    value: 'Clean',
  },
  {
    id: 1,
    value: 'Contaminated',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const SMOKE_FILTER_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const OIL_TANK_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'LEAKING',
  },
  {
    id: 2,
    value: 'DAMAGED',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const GASKETS_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Worn',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const OIL_COOLER_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'LEAKING',
  },
  {
    id: 2,
    value: 'DAMAGED',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const RIMS_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const TIRES_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Worn',
  },
  {
    id: 2,
    value: 'Poor',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const Tech_TIRES_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Worn',
  },
  {
    id: 2,
    value: 'Flat',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const LUG_NUTS_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Loose',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const BEARINGS_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'LOOSE',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const LEAF_SPRINGS_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const U_BOLTS_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Loose',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const SHACKLES_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Loose',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const HUBS_SEAL_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Leaking',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const AXLE_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'CRACKED',
  },
  {
    id: 2,
    value: 'BENT',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const FENDER_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'CRACKED',
  },
  {
    id: 2,
    value: 'BENT',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const BRAKE_FLUID_LEVEL_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Low',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const BRAKE_FLUID_LEAKS_LIST = [
  {
    id: 0,
    value: 'No',
  },
  {
    id: 1,
    value: 'Yes',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const ACTUATOR_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const SHOES_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'WORN',
  },
  {
    id: 2,
    value: 'MISSING',
  },

  {
    id: 3,
    value: 'N/A',
  },
];

export const BREAK_AWAY_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const PINTLE_HOOK_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const PINTLE_HOOK_BOLTS_LIST = [
  {
    id: 0,
    value: 'GOOD',
  },
  {
    id: 1,
    value: 'WORN',
  },
  {
    id: 2,
    value: 'MISSING',
  },

  {
    id: 3,
    value: 'N/A',
  },
];

export const SAFETY_CHAIN_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },

  {
    id: 3,
    value: 'N/A',
  },
];

export const JACK_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const LATCH_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const LF_TURN_SIGNALS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const RF_TURN_SIGNALS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const LR_TURN_SIGNALS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const RR_TURN_SIGNALS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const BRAKE_LIGHTS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const PIG_TAIL_CORD_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const FRONT_MARKERS_LIGHTS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const BACK_MARKERS_LIGHTS_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];
export const CONDITION_OF_WRITING_LIST = [
  {
    id: 0,
    value: 'Working',
  },
  {
    id: 1,
    value: 'Not Working',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const BOARDS_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const STEEL_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const SCREWS_LIST = [
  {
    id: 0,
    value: 'WORKING',
  },
  {
    id: 1,
    value: 'DAMAGED',
  },
  {
    id: 2,
    value: 'MISSING',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const REFLECTIVE_TAPE_LIST = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Missing',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const VEHICLE_REGISRATION_LIST = [
  {
    id: 0,
    value: 'VALID',
  },
  {
    id: 1,
    value: 'EXPIRED',
  },
  {
    id: 2,
    value: 'MISSING',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const LICENCE_PLATE_LIST = [
  {
    id: 0,
    value: 'VALID',
  },
  {
    id: 1,
    value: 'EXPIRED',
  },
  {
    id: 2,
    value: 'MISSING',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const CERTIFICATE_OF_INSURANCE_LIST = [
  {
    id: 0,
    value: 'VALID',
  },
  {
    id: 1,
    value: 'EXPIRED',
  },
  {
    id: 2,
    value: 'MISSING',
  },
  {
    id: 3,
    value: 'N/A',
  },
];
export const DOCUMENT_HOLDER_LIST = [
  {
    id: 0,
    value: 'IN PLACE',
  },
  {
    id: 1,
    value: 'MISSING',
  },
  {
    id: 2,
    value: 'N/A',
  },
];

export const VEHICLE_OPTION_LIST = [
  {
    id: 0,
    value: 'YES',
  },
  {
    id: 1,
    value: 'NO',
  },
  {
    id: 2,
    value: 'N/A',
  },
];


export const LOAD_BANK = [
  {
    id: 0,
    value: 'REQUIRED - PASSED',
  },
  {
    id: 1,
    value: 'REQUIRED - FAIL',
  },
  {
    id: 2,
    value: 'NOT REQUIRED',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const WIRING_CONNECTIONS = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Corroded',
  },
  {
    id: 3,
    value: 'N/A',
  },
];

export const REAR_BEARINGS = [
  {
    id: 0,
    value: 'Good',
  },
  {
    id: 1,
    value: 'Damaged',
  },
  {
    id: 2,
    value: 'Worn',
  },
  {
    id: 3,
    value: 'N/A',
  },
];