import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCcw } from "lucide-react";

interface CrmConfig {
  id?: number;
  subdomain: string;
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  pipelineId?: number;
  statusId?: number;
  emailFieldId?: number;
  phoneFieldId?: number;
  messageFieldId?: number;
  configured: boolean;
  hasAccessToken: boolean;
  connectedFields?: {
    pipelineId?: number;
    statusId?: number;
    emailFieldId?: number;
    phoneFieldId?: number;
    messageFieldId?: number;
  };
}

interface CrmStatus {
  available: boolean;
  configured: boolean;
  initialized: boolean;
}

interface Inquiry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  program?: string;
  message?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [crmForm, setCrmForm] = useState({
    subdomain: '',
    clientId: '',
    clientSecret: '',
    accessToken: '',
    pipelineId: '',
    statusId: '',
    emailFieldId: '',
    phoneFieldId: '',
    messageFieldId: ''
  });

  // Fetch CRM configuration
  const { data: crmConfig, isLoading: configLoading } = useQuery<CrmConfig>({
    queryKey: ['/api/crm/config'],
    retry: false,
  });

  // Fetch CRM status
  const { data: crmStatus, isLoading: statusLoading } = useQuery<CrmStatus>({
    queryKey: ['/api/crm/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch inquiries
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/inquiries'],
  });

  // Update CRM configuration mutation
  const updateCrmMutation = useMutation({
    mutationFn: async (config: typeof crmForm) => {
      const response = await fetch('/api/crm/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subdomain: config.subdomain,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          accessToken: config.accessToken || null,
          pipelineId: config.pipelineId ? parseInt(config.pipelineId) : null,
          statusId: config.statusId ? parseInt(config.statusId) : null,
          emailFieldId: config.emailFieldId ? parseInt(config.emailFieldId) : null,
          phoneFieldId: config.phoneFieldId ? parseInt(config.phoneFieldId) : null,
          messageFieldId: config.messageFieldId ? parseInt(config.messageFieldId) : null,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save configuration');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "CRM configuration saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/crm/config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/crm/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save CRM configuration",
        variant: "destructive",
      });
    },
  });

  // Retry failed sync mutation
  const retrySyncMutation = useMutation({
    mutationFn: async (inquiryId: number) => {
      const response = await fetch(`/api/crm/retry/${inquiryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to retry sync');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inquiry synced to CRM successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync inquiry to CRM",
        variant: "destructive",
      });
    },
  });

  // Update form when config is loaded
  useEffect(() => {
    if (crmConfig && crmConfig.configured) {
      setCrmForm({
        subdomain: crmConfig.subdomain || '',
        clientId: '', // Don't show sensitive data
        clientSecret: '', // Don't show sensitive data
        accessToken: '', // Don't show sensitive data
        pipelineId: crmConfig.connectedFields?.pipelineId?.toString() || '',
        statusId: crmConfig.connectedFields?.statusId?.toString() || '',
        emailFieldId: crmConfig.connectedFields?.emailFieldId?.toString() || '',
        phoneFieldId: crmConfig.connectedFields?.phoneFieldId?.toString() || '',
        messageFieldId: crmConfig.connectedFields?.messageFieldId?.toString() || '',
      });
    }
  }, [crmConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCrmMutation.mutate(crmForm);
  };

  const getStatusBadge = () => {
    if (statusLoading || configLoading) {
      return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Loading</Badge>;
    }
    
    if (!crmStatus?.configured) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Not Configured</Badge>;
    }
    
    if (!crmStatus?.initialized) {
      return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Not Connected</Badge>;
    }
    
    return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {getStatusBadge()}
      </div>

      <Tabs defaultValue="crm" className="space-y-6">
        <TabsList>
          <TabsTrigger value="crm">CRM Configuration</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kommo CRM Integration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your Kommo CRM integration for automatic lead management and duplicate detection.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subdomain">Kommo Subdomain</Label>
                    <Input
                      id="subdomain"
                      value={crmForm.subdomain}
                      onChange={(e) => setCrmForm({ ...crmForm, subdomain: e.target.value })}
                      placeholder="your-company"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      From https://your-company.kommo.com
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      value={crmForm.clientId}
                      onChange={(e) => setCrmForm({ ...crmForm, clientId: e.target.value })}
                      placeholder="OAuth Client ID"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={crmForm.clientSecret}
                      onChange={(e) => setCrmForm({ ...crmForm, clientSecret: e.target.value })}
                      placeholder="OAuth Client Secret"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="accessToken">Access Token</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      value={crmForm.accessToken}
                      onChange={(e) => setCrmForm({ ...crmForm, accessToken: e.target.value })}
                      placeholder="Access Token"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pipelineId">Pipeline ID</Label>
                    <Input
                      id="pipelineId"
                      type="number"
                      value={crmForm.pipelineId}
                      onChange={(e) => setCrmForm({ ...crmForm, pipelineId: e.target.value })}
                      placeholder="Pipeline ID"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="statusId">Status ID</Label>
                    <Input
                      id="statusId"
                      type="number"
                      value={crmForm.statusId}
                      onChange={(e) => setCrmForm({ ...crmForm, statusId: e.target.value })}
                      placeholder="Status ID"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emailFieldId">Email Field ID</Label>
                    <Input
                      id="emailFieldId"
                      type="number"
                      value={crmForm.emailFieldId}
                      onChange={(e) => setCrmForm({ ...crmForm, emailFieldId: e.target.value })}
                      placeholder="Email Custom Field ID"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneFieldId">Phone Field ID</Label>
                    <Input
                      id="phoneFieldId"
                      type="number"
                      value={crmForm.phoneFieldId}
                      onChange={(e) => setCrmForm({ ...crmForm, phoneFieldId: e.target.value })}
                      placeholder="Phone Custom Field ID"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="messageFieldId">Message Field ID</Label>
                    <Input
                      id="messageFieldId"
                      type="number"
                      value={crmForm.messageFieldId}
                      onChange={(e) => setCrmForm({ ...crmForm, messageFieldId: e.target.value })}
                      placeholder="Message Custom Field ID"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateCrmMutation.isPending}
                  className="w-full"
                >
                  {updateCrmMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Configuration...
                    </>
                  ) : (
                    'Save CRM Configuration'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Inquiries</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage and sync contact form submissions with Kommo CRM.
              </p>
            </CardHeader>
            <CardContent>
              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading inquiries...</span>
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {inquiry.firstName} {inquiry.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                          {inquiry.phone && (
                            <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
                          )}
                          {inquiry.program && (
                            <Badge variant="outline" className="mt-1">
                              {inquiry.program}
                            </Badge>
                          )}
                          {inquiry.message && (
                            <p className="text-sm mt-2 p-2 bg-muted rounded">
                              {inquiry.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(inquiry.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retrySyncMutation.mutate(inquiry.id)}
                            disabled={retrySyncMutation.isPending || !crmStatus?.initialized}
                          >
                            {retrySyncMutation.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCcw className="w-3 h-3" />
                            )}
                            <span className="ml-1">Sync to CRM</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inquiries found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}