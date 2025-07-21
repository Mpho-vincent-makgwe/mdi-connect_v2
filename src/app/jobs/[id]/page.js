// JobDetailsPage.js
'use client';

import { useEffect, useState, use } from 'react';
import { useJobs } from '@/context/JobsContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import JobApplicationModal from '@/components/JobApplicationModal';
import { FiArrowLeft } from 'react-icons/fi';
import JobDetailsLoading from '@/components/JobDetailsLoading';

export default function JobDetailsPage({ params }) {
  const { id } = use(params);
  const { currentJob, loading, error, fetchJobDetails, hasAppliedToJob } = useJobs();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const router = useRouter();

  const hasApplied = hasAppliedToJob(id);

  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
    }
  }, [id, fetchJobDetails]);

  if (loading) {
    return <JobDetailsLoading />;
  }

  if (error) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#F2ECE4',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#8B0000' }}>{error}</p>
        <Button 
          variant="ghost" 
          style={{
            marginTop: '0.5rem',
            borderColor: '#8C3C1E',
            color: '#8C3C1E',
            backgroundColor: 'transparent'
          }}
          onClick={() => fetchJobDetails(id)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#F2ECE4',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.5rem',
      maxWidth: '56rem',
      margin: '0 auto'
    }}>
      <Button 
        variant="ghost" 
        onClick={() => router.push("/jobs")}
        style={{
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderColor: '#8C3C1E',
          color: '#8C3C1E',
          backgroundColor: 'transparent'
        }}
      >
        <FiArrowLeft style={{ height: '1rem', width: '1rem' }} />
        Back to Jobs
      </Button>

      <div style={{
        backgroundColor: '#F2ECE4',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1A1A1A'
              }}>{currentJob.title}</h1>
              <p style={{
                fontSize: '1.125rem',
                color: 'rgba(140, 60, 30, 0.7)'
              }}>{currentJob.company}</p>
            </div>
            <img 
              src={currentJob.img} 
              alt={currentJob.company} 
              style={{
                height: '4rem',
                width: '4rem',
                objectFit: 'contain',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem'
          }}>
            <div style={{
              gridColumn: 'span 2',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1A1A1A'
                }}>Job Description</h2>
                <p style={{
                  color: 'rgba(140, 60, 30, 0.8)',
                  whiteSpace: 'pre-line'
                }}>{currentJob.description}</p>
              </div>
              
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1A1A1A'
                }}>Requirements</h2>
                <ul style={{
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  color: 'rgba(140, 60, 30, 0.8)'
                }}>
                  {currentJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(242, 236, 228, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem'
              }}>
                <h3 style={{
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: '#1A1A1A'
                }}>Job Details</h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(140, 60, 30, 0.7)' }}>Location:</span>
                    <span>{currentJob.loc}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(140, 60, 30, 0.7)' }}>Sector:</span>
                    <span>{currentJob.sector}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(140, 60, 30, 0.7)' }}>Salary:</span>
                    <span>{currentJob.salary}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(140, 60, 30, 0.7)' }}>Deadline:</span>
                    <span>{new Date(currentJob.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ paddingTop: '0.5rem' }}>
                {hasApplied ? (
                  <Button 
                    variant="outline"
                    style={{
                      width: '100%',
                      color: '#014421',
                      borderColor: '#014421',
                      backgroundColor: 'rgba(1, 68, 33, 0.1)'
                    }}
                    disabled
                  >
                    Applied ✓
                  </Button>
                ) : (
                  <Button 
                    style={{
                      width: '100%',
                      backgroundColor: '#132857',
                      color: '#F2ECE4'
                    }}
                    onClick={() => setApplicationOpen(true)}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <JobApplicationModal 
        job={currentJob}
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
      />
    </div>
  );
}