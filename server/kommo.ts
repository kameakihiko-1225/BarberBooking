import { CrmConfig } from "@shared/schema";

export interface KommoContact {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{
      value: string;
      enum_code?: string;
    }>;
  }>;
}

export interface KommoLead {
  id?: number;
  name: string;
  pipeline_id: number;
  status_id: number;
  price?: number;
  responsible_user_id?: number;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{
      value: string;
    }>;
  }>;
  _embedded?: {
    contacts: KommoContact[];
  };
}

export interface KommoApiResponse<T> {
  _embedded?: {
    leads?: T[];
    contacts?: T[];
  };
  _links?: any;
  _page?: any;
}

export interface KommoCreateResponse {
  id: number;
  merged?: boolean;
  contact_id?: number;
}

export interface DiscoveredConfig {
  pipelineId: number;
  statusId: number;
  customFields: {
    email?: number;
    phone?: number;
    message?: number;
    firstName?: number;
    lastName?: number;
    program?: number;
  };
}

export class KommoService {
  private config: CrmConfig;
  private baseUrl: string;
  private discoveredConfig: DiscoveredConfig | null = null;

  // Hardcoded K&K Barber Academy credentials
  private static readonly HARDCODED_CONFIG = {
    subdomain: 'kkbarberacademycrm',
    clientId: '0c4b93d4-9f99-4709-a4f0-f57349f932df',
    clientSecret: 'C9dtqROcoYxEjFPz7y2Fw9eGqw0hx48cP5HToCJwEtQPOQDpdoA9xETDTj8JkSVT',
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFhNWU3OWVmYzFmYzcxMzUzZjE0ZGE3OTU1ZmM0YzAzNDFmOWQ5MGU4OTZmOTI4YzIxMDNmZmE3YzY4OGE0ZDdhYTM1ZDI1MmU4NTU0MTRmIn0.eyJhdWQiOiIwYzRiOTNkNC05Zjk5LTQ3MDktYTRmMC1mNTczNDlmOTMyZGYiLCJqdGkiOiJhYTVlNzllZmMxZmM3MTM1M2YxNGRhNzk1NWZjNGMwMzQxZjlkOTBlODk2ZjkyOGMyMTAzZmZhN2M2ODhhNGQ3YWEzNWQyNTJlODU1NDE0ZiIsImlhdCI6MTc1NDU0OTgxNiwibmJmIjoxNzU0NTQ5ODE2LCJleHAiOjE3Nzc1MDcyMDAsInN1YiI6IjEzMjkwMTkxIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0Njc4NjA3LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiOTc5YWY0NWUtNjhmMS00NGEwLWFkNWEtZmZlNDZkODIzMjM1IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.msVjGGD47xoTBMIdC4oGZLs0vCfp5Cue9lnGrcswEIMo3oBuNw_Qt2UDFg9s2icHYkq99rVg8e6ryJt8RfPxG_U-mlJtRUXcohE7YJM6cBAYu3DnLDINHYMfoK7Ky3UiJ8Qctyk_KVijFR7W8jbD1J7qR5rYJEld8gUz7j2RrsByMRCB6Xi9UsP-HMOQ1014wb-ek0a2LsM6LGcK4kfEfowhY6WESdbCpCiCXHoj3cycSgxdpFjQczsH4T-1U8lTAv_2aT6PhPP3CAuV9NpsP4wtMl7WWya_JNmu5RmTqgXNJsutx2jUcb1A4vrMQyLCAbTdZiw7dHTa2Hj7TOIjmw'
  };

  constructor(config?: CrmConfig) {
    // Use hardcoded config for K&K Barber Academy
    this.config = {
      id: 1,
      subdomain: KommoService.HARDCODED_CONFIG.subdomain,
      clientId: KommoService.HARDCODED_CONFIG.clientId,
      clientSecret: KommoService.HARDCODED_CONFIG.clientSecret,
      accessToken: KommoService.HARDCODED_CONFIG.accessToken,
      refreshToken: null,
      tokenExpiresAt: null,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      // These will be auto-discovered
      pipelineId: null,
      statusId: null,
      emailFieldId: null,
      phoneFieldId: null,
      messageFieldId: null
    };
    this.baseUrl = `https://${this.config.subdomain}.kommo.com/api/v4`;
  }

  // Auto-discovery methods
  async discoverPipelineAndStatus(): Promise<DiscoveredConfig> {
    try {
      console.log('[CRM Discovery] Fetching pipelines...');
      
      // Get all pipelines
      const response = await this.makeRequest<any>('/leads/pipelines');
      console.log('[CRM Discovery] Pipeline response structure:', Object.keys(response));

      // Extract pipelines from the _embedded structure
      let pipelines: any = {};
      
      if (response._embedded && response._embedded.pipelines) {
        // If pipelines are in _embedded structure, convert to key-value format
        const pipelineArray = response._embedded.pipelines;
        console.log('[CRM Discovery] Found pipelines in _embedded:', pipelineArray.length);
        
        if (pipelineArray.length > 0) {
          const firstPipeline = pipelineArray[0];
          console.log('[CRM Discovery] First pipeline structure:', Object.keys(firstPipeline));
          console.log('[CRM Discovery] First pipeline _embedded:', Object.keys(firstPipeline._embedded || {}));
          // Debug pipeline object structure
          console.log('[CRM Discovery] Pipeline object keys:', Object.keys(firstPipeline));
          if (firstPipeline._embedded) {
            console.log('[CRM Discovery] Pipeline _embedded keys:', Object.keys(firstPipeline._embedded));
          }
          
          // Use the first pipeline
          const pipelineId = firstPipeline.id;
          
          // Try to get pipeline statuses from separate API call
          console.log('[CRM Discovery] Fetching statuses for pipeline:', pipelineId);
          try {
            const statusResponse = await this.makeRequest<any>(`/leads/pipelines/${pipelineId}/statuses`);
            console.log('[CRM Discovery] Status response structure:', Object.keys(statusResponse));
            
            let statuses = statusResponse;
            if (statusResponse._embedded && statusResponse._embedded.statuses) {
              statuses = statusResponse._embedded.statuses;
            }
            
            let statusId;
            if (Array.isArray(statuses)) {
              if (statuses.length === 0) {
                throw new Error('No statuses found in pipeline status response');
              }
              statusId = statuses[0].id;
              console.log('[CRM Discovery] Using first status from array:', statusId);
            } else if (typeof statuses === 'object') {
              const statusIds = Object.keys(statuses).filter(key => !key.startsWith('_'));
              if (statusIds.length === 0) {
                throw new Error('No status IDs found in status response');
              }
              statusId = parseInt(statusIds[0]);
              console.log('[CRM Discovery] Using first status from object:', statusId);
            } else {
              throw new Error('Unexpected status response format');
            }
            
            
            // Discover custom fields
            const customFields = await this.discoverCustomFields();

            this.discoveredConfig = {
              pipelineId: pipelineId,
              statusId: statusId,
              customFields
            };

            console.log('[CRM Discovery] Configuration discovered successfully:', this.discoveredConfig);
            return this.discoveredConfig;
            
          } catch (statusError) {
            console.error('[CRM Discovery] Failed to fetch statuses for pipeline:', statusError);
            throw new Error(`Failed to fetch statuses for pipeline ${pipelineId}`);
          }
        }
      } else {
        // Try direct object format
        const directPipelineIds = Object.keys(response).filter(key => !key.startsWith('_'));
        console.log('[CRM Discovery] Direct pipeline IDs found:', directPipelineIds);
        
        if (directPipelineIds.length > 0) {
          const firstPipelineId = parseInt(directPipelineIds[0]);
          const firstPipeline = response[firstPipelineId];
          const statusIds = Object.keys(firstPipeline.statuses || {});
          
          if (statusIds.length === 0) {
            throw new Error('No statuses found in pipeline');
          }
          
          const firstStatusId = parseInt(statusIds[0]);
          
          console.log(`[CRM Discovery] Using pipeline ${firstPipelineId}, status ${firstStatusId}`);
          
          // Discover custom fields
          const customFields = await this.discoverCustomFields();

          this.discoveredConfig = {
            pipelineId: firstPipelineId,
            statusId: firstStatusId,
            customFields
          };

          console.log('[CRM Discovery] Configuration discovered successfully:', this.discoveredConfig);
          return this.discoveredConfig;
        }
      }

      throw new Error('No valid pipelines found in CRM response');

    } catch (error) {
      console.error('[CRM Discovery] Failed to discover pipeline configuration:', error);
      throw error;
    }
  }

  async discoverCustomFields(): Promise<DiscoveredConfig['customFields']> {
    try {
      console.log('[CRM Discovery] Fetching custom fields...');
      
      // Get all leads custom fields
      const leadsFieldsResponse = await this.makeRequest<any>('/leads/custom_fields');
      console.log('[CRM Discovery] Leads fields response structure:', Object.keys(leadsFieldsResponse));
      
      let leadsFields = {};
      if (leadsFieldsResponse._embedded && leadsFieldsResponse._embedded.custom_fields) {
        const fieldsArray = leadsFieldsResponse._embedded.custom_fields;
        console.log('[CRM Discovery] Found leads custom fields in _embedded:', fieldsArray.length);
        // Convert array to object with field ID as key
        for (const field of fieldsArray) {
          leadsFields[field.id] = field;
        }
      }

      // Get all contacts custom fields
      const contactsFieldsResponse = await this.makeRequest<any>('/contacts/custom_fields');
      console.log('[CRM Discovery] Contacts fields response structure:', Object.keys(contactsFieldsResponse));
      
      let contactsFields = {};
      if (contactsFieldsResponse._embedded && contactsFieldsResponse._embedded.custom_fields) {
        const fieldsArray = contactsFieldsResponse._embedded.custom_fields;
        console.log('[CRM Discovery] Found contacts custom fields in _embedded:', fieldsArray.length);
        // Convert array to object with field ID as key
        for (const field of fieldsArray) {
          contactsFields[field.id] = field;
        }
      }

      const fields: DiscoveredConfig['customFields'] = {};

      // Function to find field by name patterns
      const findFieldByPatterns = (fieldsObj: any, patterns: string[], fieldType: string) => {
        for (const fieldId in fieldsObj) {
          const field = fieldsObj[fieldId];
          const fieldName = field.name?.toLowerCase() || '';
          
          for (const pattern of patterns) {
            if (fieldName.includes(pattern.toLowerCase()) || 
                field.code?.toLowerCase().includes(pattern.toLowerCase())) {
              console.log(`[CRM Discovery] Found ${fieldType} field: ${field.name} (ID: ${fieldId})`);
              return parseInt(fieldId);
            }
          }
        }
        return undefined;
      };

      // Search in both leads and contacts fields
      const allFields = { ...leadsFields, ...contactsFields };
      console.log('[CRM Discovery] Total custom fields available:', Object.keys(allFields).length);

      // Find email field
      fields.email = findFieldByPatterns(allFields, [
        'email', 'e-mail', 'mail', 'почта', 'почтовый'
      ], 'email');

      // Find phone field
      fields.phone = findFieldByPatterns(allFields, [
        'phone', 'tel', 'telephone', 'mobile', 'telefon', 'телефон'
      ], 'phone');

      // Find message/comment field
      fields.message = findFieldByPatterns(allFields, [
        'message', 'comment', 'note', 'description', 'inquiry', 
        'wiadomość', 'komentarz', 'opis', 'сообщение', 'комментарий'
      ], 'message');

      // Find first name field
      fields.firstName = findFieldByPatterns(allFields, [
        'first name', 'firstname', 'name', 'imię', 'имя'
      ], 'firstName');

      // Find last name field
      fields.lastName = findFieldByPatterns(allFields, [
        'last name', 'lastname', 'surname', 'nazwisko', 'фамилия'
      ], 'lastName');

      // Find program/course field - specifically look for "Course Type"
      fields.program = findFieldByPatterns(allFields, [
        'course type', 'coursetype', 'program', 'course', 'service', 'kurs', 'программа'
      ], 'program');

      // Get enum values for program field if it's a dropdown
      if (fields.program) {
        console.log('[CRM Discovery] Fetching enum values for Course Type field:', fields.program);
        try {
          const fieldDetails = await this.makeRequest<any>(`/contacts/custom_fields/${fields.program}`);
          if (fieldDetails.enums && fieldDetails.enums.length > 0) {
            console.log('[CRM Discovery] Available Course Type options:', fieldDetails.enums.map((e: any) => e.value));
          }
        } catch (error) {
          console.log('[CRM Discovery] Could not fetch enum values for Course Type field');
        }
      }

      console.log('[CRM Discovery] Custom fields mapping:', fields);
      return fields;

    } catch (error) {
      console.error('[CRM Discovery] Failed to discover custom fields:', error);
      return {};
    }
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('[CRM Discovery] Starting auto-discovery process...');
      
      // Test connection first
      const testResult = await this.testConnection();
      if (!testResult) {
        return false;
      }

      // Discover configuration
      await this.discoverPipelineAndStatus();
      
      console.log('[CRM Discovery] Auto-discovery completed successfully');
      return true;

    } catch (error) {
      console.error('[CRM Discovery] Auto-discovery failed:', error);
      return false;
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PATCH' = 'GET', 
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kommo API error (${response.status}): ${errorText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async findDuplicateContact(email?: string, phone?: string): Promise<KommoContact | null> {
    try {
      // Search by email first
      if (email) {
        const emailResponse = await this.makeRequest<KommoApiResponse<KommoContact>>(
          `/contacts?query=${encodeURIComponent(email)}`
        );
        
        if (emailResponse._embedded?.contacts?.length) {
          return emailResponse._embedded.contacts[0];
        }
      }

      // Search by phone if no email match
      if (phone) {
        const phoneResponse = await this.makeRequest<KommoApiResponse<KommoContact>>(
          `/contacts?query=${encodeURIComponent(phone)}`
        );
        
        if (phoneResponse._embedded?.contacts?.length) {
          return phoneResponse._embedded.contacts[0];
        }
      }

      return null;
    } catch (error) {
      console.error('Error searching for duplicate contact:', error);
      return null;
    }
  }

  mapFormDataToContact(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message?: string;
    program?: string;
  }): KommoContact {
    const contact: KommoContact = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      first_name: formData.firstName,
      last_name: formData.lastName,
      custom_fields_values: []
    };

    if (!this.discoveredConfig) {
      console.warn('[CRM] No discovered config available, contact will have minimal fields');
      return contact;
    }

    const { customFields } = this.discoveredConfig;
    console.log('[CRM] Mapping custom fields with discovered config');

    // Add email field (required - basic field)
    if (formData.email && customFields.email) {
      contact.custom_fields_values!.push({
        field_id: customFields.email,
        values: [{ value: formData.email, enum_code: "WORK" }]
      });
      console.log('[CRM] Added email field (ID:', customFields.email, ')');
    }

    // Add phone field (basic field)
    if (formData.phone && customFields.phone) {
      contact.custom_fields_values!.push({
        field_id: customFields.phone,
        values: [{ value: formData.phone, enum_code: "WORK" }]
      });
      console.log('[CRM] Added phone field (ID:', customFields.phone, ')');
    }

    // Add message field (basic text field)
    if (formData.message && customFields.message) {
      contact.custom_fields_values!.push({
        field_id: customFields.message,
        values: [{ value: formData.message }]
      });
      console.log('[CRM] Added message field (ID:', customFields.message, ')');
    }

    // Temporarily skip Course Type field until we confirm it's a text field
    if (formData.program && customFields.program) {
      console.log('[CRM] Temporarily skipping Course Type field (ID:', customFields.program, ') - validating field type');
      // TODO: Re-enable once confirmed as text field, not dropdown
      // contact.custom_fields_values!.push({
      //   field_id: customFields.program,
      //   values: [{ value: formData.program }]
      // });
    }

    return contact;
  }

  async createLeadWithContact(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    program?: string;
    message?: string;
  }): Promise<{ leadId: number; contactId?: number; duplicateDetected: boolean }> {
    try {
      console.log('[CRM] Creating lead with contact. Form data:', JSON.stringify(formData, null, 2));
      const contact = this.mapFormDataToContact(formData);
      console.log('[CRM] Mapped contact data:', JSON.stringify(contact, null, 2));
      console.log('[CRM] Contact custom_fields_values count:', contact.custom_fields_values?.length);
      
      if (!this.discoveredConfig) {
        throw new Error('CRM not initialized - run initialize() first');
      }

      const leadData: KommoLead = {
        name: `Lead from ${contact.name} - ${formData.program || 'General Inquiry'}`,
        pipeline_id: this.discoveredConfig.pipelineId,
        status_id: this.discoveredConfig.statusId,
        price: 0,
        _embedded: {
          contacts: [contact]
        }
      };

      // Use complex endpoint for automatic duplicate handling
      const response = await this.makeRequest<KommoCreateResponse[]>(
        '/leads/complex',
        'POST',
        [leadData]
      );

      const result = response[0];
      
      return {
        leadId: result.id,
        contactId: result.contact_id,
        duplicateDetected: !!result.merged
      };
    } catch (error) {
      console.error('Error creating lead with contact:', error);
      throw error;
    }
  }

  async updateContact(contactId: number, formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message?: string;
  }): Promise<void> {
    try {
      const contact = this.mapFormDataToContact(formData);
      contact.id = contactId;

      await this.makeRequest(
        '/contacts',
        'PATCH',
        [contact]
      );
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async createLeadForExistingContact(contactId: number, formData: {
    firstName: string;
    lastName: string;
    program?: string;
  }): Promise<number> {
    try {
      if (!this.discoveredConfig) {
        throw new Error('CRM not initialized - run initialize() first');
      }

      const leadData: KommoLead = {
        name: `New inquiry from ${formData.firstName} ${formData.lastName} - ${formData.program || 'General'}`,
        pipeline_id: this.discoveredConfig.pipelineId,
        status_id: this.discoveredConfig.statusId,
        price: 0,
        _embedded: {
          contacts: [{ id: contactId, name: `${formData.firstName} ${formData.lastName}` }]
        }
      };

      const response = await this.makeRequest<KommoCreateResponse[]>(
        '/leads',
        'POST',
        [leadData]
      );

      return response[0].id;
    } catch (error) {
      console.error('Error creating lead for existing contact:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/account');
      return true;
    } catch (error) {
      console.error('Kommo connection test failed:', error);
      return false;
    }
  }
}