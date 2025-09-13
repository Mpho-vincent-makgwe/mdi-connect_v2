'use client';

import { useState, useEffect } from 'react';
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
    yearsOfExperience: '',
    qualifications: '',
    educationLevel: '',
    currentlyStudying: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        sector: user.sector || '',
        experience: user.experience || '',
        yearsOfExperience: user.yearsOfExperience || '',
        qualifications: user.qualifications || '',
        educationLevel: user.educationLevel || '',
        currentlyStudying: user.currentlyStudying || '',
      });

      const filledSteps = [
        !!user.sector,
        !!user.experience,
        !!user.qualifications,
        !!user.educationLevel,
        !!user.currentlyStudying
      ].filter(Boolean).length;
      
      if (filledSteps > 0) {
        setStep(Math.min(filledSteps + 1, 5));
        setProgress(Math.min((filledSteps + 1) * 20, 100));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(''); // Clear validation error when user makes a change
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(''); // Clear validation error when user makes a change
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.sector) {
          setValidationError('Please select a sector');
          return false;
        }
        break;
      case 2:
        if (!formData.experience) {
          setValidationError('Please select your experience');
          return false;
        }
        if (formData.experience === 'yes' && !formData.yearsOfExperience) {
          setValidationError('Please enter years of experience');
          return false;
        }
        break;
      case 3:
        if (!formData.qualifications) {
          setValidationError('Please select your qualifications');
          return false;
        }
        break;
      case 4:
        if (!formData.educationLevel) {
          setValidationError('Please select your education level');
          return false;
        }
        break;
      case 5:
        if (!formData.currentlyStudying) {
          setValidationError('Please select your current study status');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      const newProgress = Math.min(progress + 20, 100);
      setProgress(newProgress);
      setStep(step + 1);
      setValidationError('');
    }
  };

  const prevStep = () => {
    const newProgress = Math.max(progress - 20, 0);
    setProgress(newProgress);
    setStep(step - 1);
    setValidationError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    try {
      const userType = formData.qualifications === 'yes' ? 'skilled' : 'unskilled';
      
      await updateUser({
        ...formData,
        role: userType,
        completedQuestionnaire: true
      });

      if (userType === 'skilled') {
        router.push('/upload-qualifications');
      } else {
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setValidationError('Failed to submit questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveForLater = async () => {
    try {
      await updateUser({
        ...formData,
        completedQuestionnaire: false
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving progress:', error);
      setValidationError('Failed to save progress. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1A1A1A' }}>Which sector are you interested in?</h3>
            <Select 
              onValueChange={(value) => handleSelectChange('sector', value)} 
              value={formData.sector}
            >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1A1A1A' }}>Do you have any professional experience?</h3>
            <RadioGroup 
              onValueChange={(value) => handleSelectChange('experience', value)}
              value={formData.experience}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="yes" id="experience-yes" />
                <Label htmlFor="experience-yes">Yes</Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="no" id="experience-no" />
                <Label htmlFor="experience-no">No</Label>
              </div>
            </RadioGroup>
            {formData.experience === 'yes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Label>Years of experience</Label>
                <Input 
                  type="number" 
                  name="yearsOfExperience" 
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1A1A1A' }}>Do you have any formal qualifications?</h3>
            <RadioGroup 
              onValueChange={(value) => handleSelectChange('qualifications', value)}
              value={formData.qualifications}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="yes" id="qualifications-yes" />
                <Label htmlFor="qualifications-yes">Yes</Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="no" id="qualifications-no" />
                <Label htmlFor="qualifications-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1A1A1A' }}>What is your highest education level?</h3>
            <Select 
              onValueChange={(value) => handleSelectChange('educationLevel', value)}
              value={formData.educationLevel}
            >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1A1A1A' }}>Are you currently enrolled in any educational program?</h3>
            <RadioGroup 
              onValueChange={(value) => handleSelectChange('currentlyStudying', value)}
              value={formData.currentlyStudying}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="yes" id="studying-yes" />
                <Label htmlFor="studying-yes">Yes</Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'rgba(242, 236, 228, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        backgroundColor: '#F2ECE4',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A1A1A' }}>Candidate Profile Setup</h1>
          <p style={{ color: 'rgba(140, 60, 30, 0.7)' }}>Complete your profile to access job opportunities</p>
        </div>
        
        <Progress value={progress} style={{ height: '0.5rem' }} />
        
        {validationError && (
          <div style={{ color: 'red', textAlign: 'center' }}>
            {validationError}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {renderStep()}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
              style={{
                borderColor: '#8C3C1E',
                color: '#8C3C1E',
                backgroundColor: 'transparent'
              }}
            >
              Back
            </Button>
          ) : (
            <div style={{ width: '80px' }}></div> // Placeholder for spacing
          )}
          
          {step < 5 ? (
            <>
              <Button 
                onClick={nextStep}
                style={{
                  backgroundColor: '#132857',
                  color: '#F2ECE4',
                  flex: 1
                }}
              >
                Next
              </Button>
              <Button 
                onClick={handleSaveForLater}
                style={{
                  backgroundColor: '#8C3C1E',
                  color: '#F2ECE4'
                }}
              >
                Save for later
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#132857',
                color: '#F2ECE4',
                flex: 1
              }}
            >
              {isSubmitting ? 'Completing...' : 'Complete Profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}