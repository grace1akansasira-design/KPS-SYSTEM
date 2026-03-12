import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save,
  Mail,
  Phone,
  Building2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: user?.department || ""
  });
  
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");

  // Notification State
  const [notifications, setNotifications] = useState({
    timetableChanges: true,
    classAssignments: true,
    roomChanges: true,
    emailNotifications: false,
    smsAlerts: false
  });

  // Appearance State
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "en",
    compactMode: false
  });

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        department: user.department || ""
      });
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const result = await updateProfile({
      name: formData.name,
      email: formData.email,
      department: formData.department,
      avatar_url: avatarUrl
    });
    
    setIsSaving(false);
    
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "An error occurred while saving changes.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotifications = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Preferences Saved",
        description: "Your notification settings have been updated.",
      });
    }, 800);
  };

  const handleSaveAppearance = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Applied",
        description: "Appearance preferences saved successfully.",
      });
    }, 800);
  };

  const handleUpdateSecurity = () => {
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Security Updated",
        description: "Your security settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <DashboardLayout title="Settings Dashboard">
      <div className="space-y-10">

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 shadow-lg border-2 border-primary/10">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handlePhotoChange}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl font-bold uppercase text-[10px] tracking-widest"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">JPG, GIF or PNG. Max size 2MB</p>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* Form Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        className="pl-10 rounded-xl h-12 border-border/40 focus:border-primary/40 transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        className="pl-10 rounded-xl h-12 border-border/40 focus:border-primary/40 transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest ml-1">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        placeholder="+256 700 000 000" 
                        className="pl-10 rounded-xl h-12 border-border/40 focus:border-primary/40 transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-[10px] font-black uppercase tracking-widest ml-1">Department</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="department" 
                        value={formData.department} 
                        onChange={handleInputChange}
                        className="pl-10 rounded-xl h-12 border-border/40 focus:border-primary/40 transition-all font-medium" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    className="gap-2 rounded-xl h-12 px-8 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Timetable Changes</Label>
                      <p className="text-sm text-muted-foreground">Get notified when your timetable is updated</p>
                    </div>
                    <Switch 
                      checked={notifications.timetableChanges} 
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, timetableChanges: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Class Assignments</Label>
                      <p className="text-sm text-muted-foreground">Notifications for new class assignments</p>
                    </div>
                    <Switch 
                      checked={notifications.classAssignments} 
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, classAssignments: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Room Changes</Label>
                      <p className="text-sm text-muted-foreground">Get alerted when room assignments change</p>
                    </div>
                    <Switch 
                      checked={notifications.roomChanges} 
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, roomChanges: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.emailNotifications} 
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive urgent alerts via SMS</p>
                    </div>
                    <Switch 
                      checked={notifications.smsAlerts} 
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsAlerts: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="gap-2 rounded-xl"
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select 
                      value={appearance.theme} 
                      onValueChange={(val) => setAppearance(prev => ({ ...prev, theme: val }))}
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select 
                      value={appearance.language}
                      onValueChange={(val) => setAppearance(prev => ({ ...prev, language: val }))}
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="lg">Luganda</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use smaller spacing and fonts</p>
                    </div>
                    <Switch 
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="gap-2 rounded-xl"
                    onClick={handleSaveAppearance}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-600 uppercase text-xs tracking-widest">Change Password</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="rounded-xl border-border/40"
                      />
                    </div>
                    <div className="col-span-full sm:col-span-1" />
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="rounded-xl border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="rounded-xl border-border/40"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                <div className="space-y-4">
                  <h4 className="font-medium text-blue-600 uppercase text-xs tracking-widest">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={twoFactor}
                      onCheckedChange={setTwoFactor}
                    />
                  </div>
                </div>

                <Separator className="bg-border/40" />

                <div className="space-y-4">
                  <h4 className="font-medium text-blue-600 uppercase text-xs tracking-widest">Active Sessions</h4>
                  <div className="p-4 rounded-xl border border-border/40 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Current Device</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Last active: Just now</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg text-[10px] uppercase font-black tracking-widest h-8 px-3">Sign Out</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    className="gap-2 rounded-xl h-12 px-8 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    onClick={handleUpdateSecurity}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Updating..." : "Update Security"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
