export const ErrorMessages = {
  user_permission: {
    get_users: 'Error occurred when trying to get users data.',
    get_menu_list:
      'Error occurred when trying to get menu items for selected user.',
    get_department_modules:
      'Error occurred when trying to get department modules of selected user.',
    save: 'Error in saving user permission data.',
  },
  user_list: {
    list: 'Error occurred when trying to get users data.',
  },
  user: {
    check_user: 'Error in checking user',
    save_patch: 'Error occurred in updating user data.',
    add_user: 'Error occurred in creating user.',
    get_byId: 'Error in getting user data.',
    list: 'Error occurred when trying to get users data.',
  },
  employee: {
    get_unique_list_user: 'Error in getting employees data using user.',
    get_list: 'Error in getting employee list data.',
    get_one_by_id: 'Error occurred in getting employee detail by id.',
    get_activity: 'Error occurred in getting activity for employee.',
    get_certificates: 'Error occurred in getting certificates for employee.',
    save_certificates: 'Error occurred in saving certificates for employee.',
    delete_certificates:
      'Error occurred in deleting certificates for employee.',
    get_equipment: 'Error occurred in getting employee equipment.',
    save_equipment_list: 'Error occurred in saving equipment list.',
    get_history: 'Error occurred in getting history for employee',
    save: 'Error occurred in saving employee details.',
    save_note: 'Error in saving component notes data.',
    get_note_list: 'Error occurred in getting notes data.',
    save_work_info: 'Error occurred in saving work information.',
  },
  branch: {
    dropdown: 'Error in getting branch data for dropdown.',
    get_by_id: 'Error in getting branch detail by branch id.',
    save: 'Error in saving branch data.',
    add_lookup_company: 'Error occurred in add lookup company.',
    list: 'Error occurred in getting branch list data.',
  },
  permission_module: {
    permission_module_tab_list:
      'Error occurred in getting permission module tab list data.',
    permission_type: 'Error occurred in getting permission type data.',
    permission_module_mapping:
      'Error occurred in getting permission module mapping data.',
    save_permission_module_mapping:
      'Error occurred in saving permission module mapping data.',
    permission_list: 'Error occurred in getting permission data.',
    permission_module_list_by_department:
      'Error occurred in getting permission module list by department.',
    save_module_tab: 'Error occurred when trying to save module tab data.',
    permission_module_list:
      'Error occurred in getting permission module list data.',
    save_module: 'Error occurred in saving module data.',
    save_department: 'Error occurred in saving department data.',
  },
  transfer: {
    transfer_list: 'Error occurred when trying to get transfer data.',
  },
  file_manager: {
    get_all_list: 'Error occurred in retrieving data for file manager.',
    save: 'Error occurred in saving file data.',
    upload_files: 'Error occurred in uploading file.',
    get_list: 'Error occurred in getting file data.',
    delete_files: 'Error occurred in deleting files.',
  },
  drop_down: {
    states: 'Error occurred in getting states dropdown data.',
    company: 'Error occurred in getting company dropdown data.',
    branch_list: 'Error occurred in getting branch list for dropdown.',
    account_manager_list: 'Error occurred in getting acount manager list for dropdown.',
    get_equivalent_list: 'Error occurred in getting equivalent list data.',
    get_inventory_type_list:
      'Error occurred in getting inventory type list data.',
    measure_units: 'Error occurred in measure units data.',
    get_category_list: 'Error occurred in getting category list data.',
    get_sub_category_list: 'Error occurred in getting sub category list data.',
    get_vendor_list: 'Error occurred in getting vendor list data.',
    vehicle_type: 'Error occurred in getting vehicle type data.',
    vendor_type: 'Error occurred in getting vendor type data.',
    vendor_terms: 'Error occurred in getting vendor terms data.',
    carriers: 'Error occurred in getting carriers data.',
    crm_customer_type:
      'Error occurred in getting CRM customer type dropdown data.',
    labor_accounts: 'Error occurred in getting labor accounts.',
    component_type: 'Error occurred in getting compoent type.',
    get_PO_list: 'Error occurred in getting category list data.',
  },
  components: {
    save_info: 'Error in component.',
    save_note: 'Error in saving component notes data.',
    get_note_by_id: 'Error occurred in getting note data by id.',
    get_note_list: 'Error occurred in getting notes data.',
  },
  parts: {
    get_BOM_list: 'Error occurred in getting BOM data.',
    get_qty_data: 'Error occurred in getting quantity data.',
    update_parts_data: 'Error occurred in update parts data.',
    add_parts_data: 'Error occurred in add parts data.',
    check_inventory_type: 'Error occurred in checking inventory type.',
    get_history_list: 'Error occurred in getting history list.',
    update_parts_info: 'Error occurred in update parts information data.',
    get_list: 'Error occurred in getting parts data.',
    get_by_id: 'Error occurred in getting by part id.',
    download_part_data: 'Error occurred in download part data.',
    get_pricing_list: 'Error occurred in getting pricing list of parts.',
    export_data: 'Error occurred in exporting data.',
  },
  vehicle: {
    get_list: 'Error in getting vehicle list data.',
    get_history_by_vehicle_id:
      'Error occurred in getting history of vehicle data.',
    get_by_id: 'Error occurred in getting vehicle detail by id.',
    download_vehicle_data: 'Error occurred in download vehicle data.',
    deleteId: 'Error occurred in deleting by vehicle id',
    get_activity_list: 'Error occurred in getting vehicle activity list.',
    get_service_history: 'Error occurred in getting vehicle service history.',
    get_service_detail: 'Error occurred in getting vehicle service detail.',
    get_vehicle_no: 'Error occurred in getting vehicle number data.',
    add_data: 'Error occurred in adding vehicle data.',
    update_data: 'Error occurred in updating vehicle data.',
    non_expiring_vehicle_id:
      'Error occurred in getting non expiring vehicle data.',
    check_VIN: 'Error occurred in checking VIN number',
    load_picklist: 'Error occured in loading pick list data.',
    get_load_picklist: 'Error occurred in getting load pick list.',
    delete_picklist: 'Error occurred in deleting pick list.',
    load_quantity: 'Error occurred in loading quantity.',
    save_note: 'Error occurred in save note for vehicle.',
    get_note_by_id: 'Error occurred in getting vehicle note by id.',
    get_note_list: 'Error occurred in getting vehicle notes list.',
  },
  vendor: {
    get_one_by_id: 'Error occurred in getting vendor detail by id.',
    get_by_id: 'Error occurred in getting vendor detail by id.',
    get_list_filter: 'Error occurred in getting vendor list filter.',
    get_next_id: 'Error occurred in getting next vendor detail.',
    delete_id: 'Error occurred in deleting vendor detail.',
    download_vendor_data: 'Error occurred in download vendor data.',
    get_purchase_orders: 'Error in getting purchase orders.',
    get_vendor_parts: 'Error occurred in getting vendor parts.',
    get_report_data: 'Error occurred in getting report data.',
    get_purchase_orders_detail:
      'Error occurred in getting purchase orders detail.',
    get_export_part: 'Error occurred in getting export part.',
    download_file: 'Error occurred in downloading file.',
    update_contacts: 'Error occurred in updating vendor contacts.',
    add_contacts: 'Error occurred in creating vendor contacts.',
    get_contact_by_id: 'Error occurred in getting contact by id.',
    get_contact_list: 'Error occurred in getting contact list data.',
    get_history_by_vendor_id: 'Error occurred in getting history by vendor id.',
    update_vendor_data: 'Error occurred in updating vendor data.',
    add_vendor_data: 'Error occurred in creating vendor.',
    check_phone: 'Error occurred in checking phone of vendor.',
    save_patch: 'Error occurred in save patch for vendor.',
    save_note: 'Error occurred in save note for vendor.',
    get_note_by_id: 'Error occurred in getting note by id for vendor.',
    get_note_list: 'Error occurred in getting note list data.',
  },
  inventory: {
    get_inventory_types: 'Error occurred in getting inventory types.',
    load_invenotry: 'Error occurred in loading inventory data.',
    load_on_vehicle: 'Error occurred in loading on vehicle.',
    unload_on_vehicle: 'Error occurred in unloading on vehicle.',
    offload_vehicle: 'Error occurred in off loading vehicle.',
  },
  titles: {
    save_title: 'Error occurred in saving title data.',
    get_data_by_id: 'Error occurred in getting title data by id.',
    get_employee_list: 'Error in getting employee list data.',
    get_list: 'Error in getting titles data.',
  },
  divisional_revenue: {
    get_list: 'Error occurred in divisional revenue list data.',
    divisional_revenue_level2:
      'Error occurred in getting divisional revenue level2 data.',
    divisional_revenue_level3:
      'Error occurred in getting divisional revenue level3 data.',
    divisional_revenue_level3_labor_list:
      'Error occurred in divisional revenue level3 labour list data.',
    divisional_revenue_level3_inventory_list:
      'Error occurred in divisional revenue level3 inventory list data.',
    divisional_revenue_level3_invoice_list:
      'Error occurred in divisional revenue level3 invoice list data.',
    download_divisional_data: 'Error occurred in downloading divisional data.',
    divisional_revenue_region_level:
      'Error occurred in getting data for divisional revenue region level.',
    divisional_revenue_region_level2:
      'Error occurred in getting data for divisional revenue region level2.',
    divisional_revenue_region_level3:
      'Error occurred in getting data for divisional revenue region level3.',
  },
  customer: {
    get_list: 'Error occurred in getting data for customer list.',
    get_employee_list: 'Error occurred in getting employee list data.',
    get_one_by_id: 'Error occurred in getting single customer detail.',
    get_activity_by_customer_id:
      'Error occurred in getting activity by customer id.',
    get_contacts_list: 'Error occurred in getting contact list data.',
    save_contacts: 'Error occurred in saving contacts.',
    get_contacts_by_id: 'Error occurred in getting contacts by id.',
    get_history_by_customer_id:
      'Error occurred in getting history by customer id.',
    save: 'Error occurred in saving customer data.',
    save_note: 'Error occurred in saving customer note.',
    get_note_list: 'Error occurred in getting note list data.',
    save_patch: 'Error occurred in saving customer patch data.',
  },
  devices: {
    save_note: 'Error occurred in saving devices note.',
    get_note_list: 'Error occurred in getting note list data for devices.',
    get_note_by_id: 'Error occurred in getting note data by id.',
    get_error: 'Error while getting devices list.',

  },
  google_map_address: {
    error: 'Error occurred in google map component address.',
  },
  component_swap: {
    add_component: 'Error occurred in add compoent.',
    remove_component: 'Error occurred in remove compoent.',
    get_unit_list: 'Error occurred in getting unit list data.',
    get_selecteditem_list: 'Error occurred in getting selectd item list data.',
    get_items_list: 'Error occurred in getting item list data.',
  },
  fleet: {
    get_service_history: 'Error occurred in getting fleet service history.',
    save_note: 'Error occurred in save note for fleet.',
    get_note_by_id: 'Error occurred in getting fleet note by id.',
    get_note_list: 'Error occurred in getting fleet notes list.',
    get_activity_list: 'Error occurred in getting fleet activity list.',
    download_fleet_data: 'Error occurred in downloading fleet data.',
    get_service_detail: 'Error occurred in getting fleet service detail.',
    ser_accept_fleet: 'Error occurred in set assign to fleet',
    add_unit_info: 'Error occurred in add unit info for fleet.',
    edit_unit_info: 'Error occurred in edit unit info for fleet.',
    add_inventory_info: 'Error occurred in add inventory info for fleet.',
    get_inactive_fleet:
      'Error occurred in getting inactive inventory for fleet.',
      download_pipeline_data: 'Error occurred in downloading pipeline data.',
  },
  inventory_transfer_report: {
    download_inventory_transfer_data:
      'Error occurred in downloading inventory transfer data.',
  },
  Purchase_Order: {
    dropdown_PO_Number: 'Error occurred in getting purchase order dropdown.',
    save_receive_PO: 'Error occurred in save receive PO.',
    download_QB_PO_Data: 'Error occurred in downloading QB PO data.',
    ship_Details: 'Error occurred in getting ship details.',
    employee_Details: 'Error occurred in getting employee details.',
    lineItems_Details: 'Error occurred in getting line items details.',
    lineItems_Data: 'Error occurred in getting line items details.',
    part_Data: 'Error  occurred in getting part details.',
    inventory_Data: 'Error occurred in getting inventory details. ',
    save_LineItems_Data: 'Error occurred in getting save line items details. ',
    uom_Data: 'Error occurred in getting part uom details',
    job_Data: 'Error occurred in getting job details.',
    purchase_History_Data: 'Error occured in getting History details',
    employee_requestor: 'Error occurred in getting employee requestor',
    updateQuantity_LineItems:
      'Error occurred in getting updated quantity for line items.',
    updateCost_LineItems:
      'Error occurred in getting updated cost for line items',
    download_PO_Header_Excel: 'Error occurred in downloading PO data.',
  },   
  bidBoard: {
    get_by_branch: 'Error occurred in getting bid board details.'
  },
  timeapproval: {
    save_addpunch: 'Error occurred in save punch time for time approval.'
  },
  crmCustList:{
    download_crmcustlist_data: 'Error occurred in downloading CRM Customer List data.',
  },
  consignment: {
    get_run_need_invoicing: 'Error occurred in getting download run need invoicing data.',
    get_run_day_by_day_messenger_invoicing: 'Error occurred in getting download run day by day messenger data.',
  }
};
