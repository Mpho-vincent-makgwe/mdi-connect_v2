// app/questionnaire/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Questionnaire() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [formData, setFormData] = useState({
    sector: '',
    experience: '',
    qualifications: '',
    educationLevel: '',
    currentlyStudying: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    const newProgress = Math.min(progress + 20, 100);
    setProgress(newProgress);
    setStep(step + 1);
  };

  const prevStep = () => {
    const newProgress = Math.max(progress - 20, 0);
    setProgress(newProgress);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const userType = formData.qualifications === 'yes' ? 'skilled' : 'unskilled';
      
      await updateUser({
        ...formData,
        role: userType,
        completedQuestionnaire: true
      });

      if (formData.qualifications === 'yes') {
        router.push('/upload-qualifications');
      } else {
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Which sector are you interested in?</h3>
            <Select onValueChange={(value) => handleSelectChange('sector', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mining">Mining</SelectItem>
                <SelectItem value="tourism">Tourism</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Do you have any professional experience?</h3>
            <RadioGroup 
              onValueChange={(value) => handleSelectChange('experience', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="experience-yes" />
                <Label htmlFor="experience-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="experience-no" />
                <Label htmlFor="experience-no">No</Label>
              </div>
            </RadioGroup>
            {formData.experience === 'yes' && (
              <div className="space-y-2">
                <Label>Years of experience</Label>
                <Input 
                  type="number" 
                  name="yearsOfExperience" 
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Do you have any formal qualifications?</h3>
            <RadioGroup 
              onValueChange={(value) => handleSelectChange('qualifications', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="qualifications-yes" />
                <Label htmlFor="qualifications-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="qualifications-no" />
                <Label htmlFor="qualifications-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">What is your highest education level?</h3>
            <Select onValueChange={(value) => handleSelectChange('educationLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Are you currently enrolled in any educational program?</h3>
            <RadioGroup 
              onValueChange={(value) => handleSelectChange('currentlyStudying', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="studying-yes" />
                <Label htmlFor="studying-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="studying-no" />
                <Label htmlFor="studying-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Candidate Profile Setup</h1>
          <p className="text-gray-600">Complete your profile to access job opportunities</p>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-6">
          {renderStep()}
        </div>
        
        <div className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 5 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Complete Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}