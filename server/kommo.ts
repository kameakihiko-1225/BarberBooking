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

export class KommoService {
  private config: CrmConfig;
  private baseUrl: string;

  constructor(config: CrmConfig) {
    this.config = config;
    this.baseUrl = `https://${config.subdomain}.kommo.com/api/v4`;
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
  }): KommoContact {
    const contact: KommoContact = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      first_name: formData.firstName,
      last_name: formData.lastName,
      custom_fields_values: []
    };

    // Add email field
    if (formData.email && this.config.emailFieldId) {
      contact.custom_fields_values!.push({
        field_id: this.config.emailFieldId,
        values: [{ value: formData.email, enum_code: "WORK" }]
      });
    }

    // Add phone field
    if (formData.phone && this.config.phoneFieldId) {
      contact.custom_fields_values!.push({
        field_id: this.config.phoneFieldId,
        values: [{ value: formData.phone, enum_code: "WORK" }]
      });
    }

    // Add message field
    if (formData.message && this.config.messageFieldId) {
      contact.custom_fields_values!.push({
        field_id: this.config.messageFieldId,
        values: [{ value: formData.message }]
      });
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
      const contact = this.mapFormDataToContact(formData);
      
      const leadData: KommoLead = {
        name: `Lead from ${contact.name} - ${formData.program || 'General Inquiry'}`,
        pipeline_id: this.config.pipelineId!,
        status_id: this.config.statusId!,
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
      const leadData: KommoLead = {
        name: `New inquiry from ${formData.firstName} ${formData.lastName} - ${formData.program || 'General'}`,
        pipeline_id: this.config.pipelineId!,
        status_id: this.config.statusId!,
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