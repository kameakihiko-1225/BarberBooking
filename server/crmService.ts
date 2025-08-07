import { storage } from "./storage";
import { KommoService } from "./kommo";
import { InsertInquiry } from "@shared/schema";

export class CrmIntegrationService {
  private kommoService: KommoService | null = null;

  async initialize(): Promise<boolean> {
    try {
      console.log('[CRM] Initializing with hardcoded K&K Barber Academy credentials...');
      
      // Use hardcoded credentials and auto-discovery
      this.kommoService = new KommoService();
      
      // Run auto-discovery to learn pipeline structure and fields
      const initialized = await this.kommoService.initialize();
      if (!initialized) {
        console.error('[CRM] Auto-discovery failed');
        return false;
      }

      console.log('[CRM] Successfully initialized Kommo integration with auto-discovery');
      return true;
    } catch (error) {
      console.error('[CRM] Failed to initialize:', error);
      return false;
    }
  }

  async processFormSubmission(inquiryData: InsertInquiry): Promise<{
    inquiry: any;
    crmResult?: {
      leadId: number;
      contactId?: number;
      duplicateDetected: boolean;
    };
    error?: string;
  }> {
    try {
      // Always save to local database first
      const inquiry = await storage.createInquiry(inquiryData);
      console.log(`[CRM] Created local inquiry with ID: ${inquiry.id}`);

      // Try to sync with CRM if available
      if (!this.kommoService) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.log('[CRM] Warning: CRM integration not available - inquiry saved locally only');
          return { 
            inquiry,
            error: 'CRM integration not available - inquiry saved locally only'
          };
        }
      }

      try {
        // Ensure the Kommo service is properly initialized
        if (!this.kommoService) {
          throw new Error('KommoService not available');
        }

        // Process the CRM integration
        const crmResult = await this.kommoService.createLeadWithContact({
          firstName: inquiryData.firstName,
          lastName: inquiryData.lastName,
          email: inquiryData.email,
          phone: inquiryData.phone || undefined,
          program: inquiryData.program || undefined,
          message: inquiryData.message || undefined,
        });

        // Track the CRM lead in our database
        await storage.createCrmLead({
          inquiryId: inquiry.id,
          kommoLeadId: crmResult.leadId,
          kommoContactId: crmResult.contactId || null,
          status: crmResult.duplicateDetected ? 'merged' : 'created',
          duplicateDetected: crmResult.duplicateDetected ? 1 : 0,
          errorMessage: null,
        });

        console.log(`[CRM] Successfully created Kommo lead ${crmResult.leadId} for inquiry ${inquiry.id}`);
        
        if (crmResult.duplicateDetected) {
          console.log(`[CRM] Duplicate contact detected and merged`);
        }

        return { inquiry, crmResult };

      } catch (crmError) {
        console.error('[CRM] Failed to sync with Kommo:', crmError);
        
        // Track the error
        await storage.createCrmLead({
          inquiryId: inquiry.id,
          kommoLeadId: 0, // Use 0 to indicate failed creation
          kommoContactId: null,
          status: 'error',
          duplicateDetected: 0,
          errorMessage: crmError instanceof Error ? crmError.message : 'Unknown error',
        });

        return { 
          inquiry,
          error: `CRM sync failed: ${crmError instanceof Error ? crmError.message : 'Unknown error'}`
        };
      }

    } catch (error) {
      console.error('[CRM] Failed to process form submission:', error);
      throw error;
    }
  }

  async retryFailedSync(inquiryId: number): Promise<boolean> {
    try {
      if (!this.kommoService) {
        const initialized = await this.initialize();
        if (!initialized) {
          return false;
        }
      }

      // Get the original inquiry
      const inquiries = await storage.getInquiries();
      const inquiry = inquiries.find(i => i.id === inquiryId);
      
      if (!inquiry) {
        console.error(`[CRM] Inquiry ${inquiryId} not found`);
        return false;
      }

      // Try to sync again
      const crmResult = await this.kommoService!.createLeadWithContact({
        firstName: inquiry.firstName,
        lastName: inquiry.lastName,
        email: inquiry.email,
        phone: inquiry.phone || undefined,
        program: inquiry.program || undefined,
        message: inquiry.message || undefined,
      });

      // Update the CRM lead record
      const existingCrmLead = await storage.getCrmLeadByInquiryId(inquiryId);
      if (existingCrmLead) {
        await storage.createCrmLead({
          inquiryId: inquiry.id,
          kommoLeadId: crmResult.leadId,
          kommoContactId: crmResult.contactId || null,
          status: crmResult.duplicateDetected ? 'merged' : 'updated',
          duplicateDetected: crmResult.duplicateDetected ? 1 : 0,
          errorMessage: null,
        });
      }

      console.log(`[CRM] Successfully retried sync for inquiry ${inquiryId}`);
      return true;

    } catch (error) {
      console.error(`[CRM] Retry failed for inquiry ${inquiryId}:`, error);
      return false;
    }
  }

  isAvailable(): boolean {
    return this.kommoService !== null;
  }
}

export const crmService = new CrmIntegrationService();