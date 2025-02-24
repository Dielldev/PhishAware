'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IconUser, IconX, IconEdit, IconMail, IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from '@tabler/icons-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface ProfileFormProps {
  initialData: {
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    image: initialData?.image || ''
  });
  const [activeTab, setActiveTab] = useState('general');

  const handleImageUpload = (imageUrl: string) => {
    console.log('Setting image URL:', imageUrl)
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'social', label: 'Social Links' },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Left Column - Profile Overview */}
      <div className="lg:w-1/3">
        <div className="bg-[#2a2a2a] rounded-2xl p-8 sticky top-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              {formData.image ? (
                <div className="relative">
                  <Image
                    src={formData.image}
                    alt="Profile"
                    width={160}
                    height={160}
                    className="rounded-2xl object-cover ring-4 ring-[#47F3AB]/20"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <IconX size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-[160px] h-[160px] bg-[#1a1a1a] rounded-2xl flex items-center justify-center ring-4 ring-[#47F3AB]/20">
                  <IconUser size={64} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CloudinaryUpload onUpload={handleImageUpload} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mt-6">{formData.name || 'Your Name'}</h3>
            <p className="text-gray-400 text-base mt-1">{formData.email}</p>
            
            <div className="w-full mt-8 space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full py-3 px-6 rounded-xl text-base font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#47F3AB] text-black shadow-lg shadow-[#47F3AB]/20' 
                      : 'text-gray-400 hover:bg-[#1a1a1a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Sections */}
      <div className="lg:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 'general' && (
            <>
              <div className="bg-[#2a2a2a] rounded-2xl p-8">
                <h4 className="text-xl font-semibold mb-6">Personal Information</h4>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                      />
                      <IconEdit size={20} className="absolute left-4 top-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                      />
                      <IconMail size={20} className="absolute left-4 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <div className="bg-[#2a2a2a] rounded-2xl p-8">
              <h4 className="text-xl font-semibold mb-6">Security Settings</h4>
              <div className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-base font-medium text-gray-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="w-full px-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-base font-medium text-gray-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full px-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-400 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-[#2a2a2a] rounded-2xl p-8">
              <h4 className="text-xl font-semibold mb-6">Social Links</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-400 mb-2">
                    GitHub
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                      placeholder="Your GitHub profile"
                    />
                    <IconBrandGithub size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-400 mb-2">
                    Twitter
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                      placeholder="Your Twitter handle"
                    />
                    <IconBrandTwitter size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-400 mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] focus:border-[#47F3AB] focus:ring-1 focus:ring-[#47F3AB] transition-colors text-base"
                      placeholder="Your LinkedIn profile"
                    />
                    <IconBrandLinkedin size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#47F3AB] text-black font-medium rounded-xl hover:bg-[#47F3AB]/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-base shadow-lg shadow-[#47F3AB]/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <IconEdit size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}