'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  User,
  Store,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Plus,
  X,
  Camera,
  Save,
  Loader2,
  CheckCircle,
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ProfileData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  entrepreneurProfile?: {
    _id: string;
    businessName: string;
    bio: string;
    coverImage?: string;
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
    };
    contactInfo: {
      phone: string;
      whatsapp?: string;
      email: string;
    };
    socialLinks: {
      facebook?: string;
      instagram?: string;
      website?: string;
    };
    specializations: string[];
    isVerified: boolean;
  };
}

export default function EntrepreneurProfilePage() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');
  
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: ProfileData;
  }>('/api/v1/users', fetcher);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    businessName: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: '',
    facebook: '',
    instagram: '',
    website: '',
    specializations: [] as string[],
  });

  useEffect(() => {
    if (data?.data) {
      const { user, entrepreneurProfile } = data.data;
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        businessName: entrepreneurProfile?.businessName || '',
        bio: entrepreneurProfile?.bio || '',
        address: entrepreneurProfile?.location?.address || '',
        city: entrepreneurProfile?.location?.city || '',
        state: entrepreneurProfile?.location?.state || '',
        country: entrepreneurProfile?.location?.country || 'India',
        contactPhone: entrepreneurProfile?.contactInfo?.phone || '',
        contactWhatsapp: entrepreneurProfile?.contactInfo?.whatsapp || '',
        contactEmail: entrepreneurProfile?.contactInfo?.email || user.email || '',
        facebook: entrepreneurProfile?.socialLinks?.facebook || '',
        instagram: entrepreneurProfile?.socialLinks?.instagram || '',
        website: entrepreneurProfile?.socialLinks?.website || '',
        specializations: entrepreneurProfile?.specializations || [],
      });
    }
  }, [data]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update user info
      const userResponse = await fetch('/api/v1/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      if (!userResponse.ok) throw new Error('Failed to update user info');

      // Update entrepreneur profile
      const profileResponse = await fetch('/api/v1/entrepreneur/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          bio: formData.bio,
          location: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
          },
          contactInfo: {
            phone: formData.contactPhone,
            whatsapp: formData.contactWhatsapp,
            email: formData.contactEmail,
          },
          socialLinks: {
            facebook: formData.facebook,
            instagram: formData.instagram,
            website: formData.website,
          },
          specializations: formData.specializations,
        }),
      });

      if (!profileResponse.ok) throw new Error('Failed to update profile');

      toast.success('Profile updated successfully');
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  const profile = data?.data?.entrepreneurProfile;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your business profile and settings</p>
        </div>
        {profile?.isVerified && (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified Artisan
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Muhammad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Ali"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9975xxxxxx"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Your business or workshop name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About Your Business *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell customers about your craft, experience, and what makes your work special..."
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="gap-1">
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(spec)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      placeholder="Add a specialization (e.g., Embroidery, Pottery)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSpecialization();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addSpecialization}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Delhi"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Delhi"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  How customers can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Business Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+91 9975xxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactWhatsapp">WhatsApp</Label>
                    <Input
                      id="contactWhatsapp"
                      type="tel"
                      value={formData.contactWhatsapp}
                      onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)}
                      placeholder="+91 9975xxxxxx"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Business Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted mb-4">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {formData.businessName || 'Your Business Name'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.city && formData.state 
                      ? `${formData.city}, ${formData.state}` 
                      : 'Location'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  {formData.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {formData.contactPhone}
                    </div>
                  )}
                  {formData.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {formData.contactEmail}
                    </div>
                  )}
                </div>

                {formData.specializations.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-1">
                      {formData.specializations.slice(0, 4).map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
