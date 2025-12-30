import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, CheckCircle, Loader } from 'lucide-react';
import { Button, GlowCard, HUDHeading, InputField, TextArea } from '../components/UIComponents';

const Careers = () => {
  const [openJob, setOpenJob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const jobs = [
    {
      id: 1,
      title: 'Security Guard',
      department: 'Operations',
      location: 'Multiple Locations',
      type: 'Full-time',
      description: 'Provide security services at residential, corporate, and healthcare facilities. Monitor premises, control access, conduct patrols, and respond to incidents.',
      requirements: [
        'High school diploma or equivalent',
        'Valid security guard license (or willingness to obtain)',
        'Good physical fitness and ability to stand for extended periods',
        'Strong observation and communication skills',
        'Clean background check and drug screening',
      ],
      benefits: [
        'Competitive hourly wages with overtime opportunities',
        'Professional security training and certification',
        'Health insurance coverage',
        'Uniform and equipment provided',
      ],
    },
    {
      id: 2,
      title: 'Security Supervisor',
      department: 'Operations Management',
      location: 'City Center',
      type: 'Full-time',
      description: 'Supervise security guard teams at assigned locations. Conduct inspections, manage schedules, handle incidents, and ensure quality service delivery.',
      requirements: [
        '3+ years of security guard experience',
        'Valid security supervisor license',
        'Leadership and team management skills',
        'Experience with incident reporting and documentation',
        'Strong problem-solving abilities',
      ],
      benefits: [
        'Salary position with performance bonuses',
        'Leadership development training',
        'Health and dental insurance',
        'Career advancement opportunities',
      ],
    },
    {
      id: 3,
      title: 'Mobile Patrol Officer',
      department: 'Mobile Response',
      location: 'Various Sites',
      type: 'Full-time',
      description: 'Conduct mobile patrols across multiple client locations. Respond to alarms, perform security checks, and provide rapid response services.',
      requirements: [
        'Valid driver\'s license with clean driving record',
        'Security guard license',
        '1+ year of security experience preferred',
        'Ability to work flexible hours including nights and weekends',
        'Good knowledge of local area',
      ],
      benefits: [
        'Company vehicle provided',
        'Fuel allowance',
        'Communication equipment',
        'Mileage compensation',
      ],
    },
    {
      id: 4,
      title: 'Control Room Operator',
      department: 'Operations Center',
      location: 'Main Office',
      type: 'Full-time',
      description: 'Monitor CCTV systems, manage alarm responses, coordinate guard deployments, and maintain communication with field personnel.',
      requirements: [
        'Experience with CCTV and access control systems',
        'Good computer and communication skills',
        'Ability to multitask and remain calm under pressure',
        'Experience in security control room operations preferred',
        'Willingness to work shift patterns',
      ],
      benefits: [
        'Climate-controlled work environment',
        'Technology training provided',
        'Shift differentials for nights/weekends',
        'Career progression pathways',
      ],
    },
  ];

  const handleFileUpload = (file) => {
    if (file) {
      setIsScanning(true);
      setUploadedFile(file);
      
      // Simulate scanning animation
      setTimeout(() => {
        setIsScanning(false);
      }, 2000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="relative min-h-screen py-20 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
            <HUDHeading className="mb-4">Join Our Security Team</HUDHeading>
            <p className="text-xl text-silver-grey max-w-3xl mx-auto">
              Build your career with a leading security services provider. 
              We offer training, growth opportunities, and competitive compensation.
          <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-8">Open Positions</h3>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard className="cursor-pointer" onClick={() => setOpenJob(openJob === job.id ? null : job.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="text-2xl font-['Orbitron'] font-bold text-white">
                          {job.title}
                        </h4>
                        <span className="px-3 py-1 bg-cobalt/20 text-cobalt rounded-full text-sm font-['Orbitron']">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-silver-grey">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-cobalt rounded-full mr-2" />
                          {job.department}
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-cobalt rounded-full mr-2" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openJob === job.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="text-cobalt" size={24} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openJob === job.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-cobalt/30"
                      >
                        <div className="mb-6">
                          <h5 className="font-['Orbitron'] text-cobalt mb-2">Description</h5>
                          <p className="text-silver-grey">{job.description}</p>
                        </div>

                        <div className="mb-6">
                          <h5 className="font-['Orbitron'] text-cobalt mb-2">Requirements</h5>
                          <ul className="space-y-2">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start text-silver-grey">
                                <span className="w-1.5 h-1.5 bg-cobalt rounded-full mr-3 mt-2" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-['Orbitron'] text-cobalt mb-2">Benefits</h5>
                          <ul className="space-y-2">
                            {job.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start text-silver-grey">
                                <span className="w-1.5 h-1.5 bg-cobalt rounded-full mr-3 mt-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6">
                          <Button
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section id="application-form">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-['Orbitron'] font-bold text-white mb-8">Submit Your Application</h3>
            <GlowCard>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    placeholder="Enter your full name"
                    type="text"
                    required
                  />
                  <InputField
                    label="Email Address"
                    placeholder="your.email@example.com"
                    type="email"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    required
                  />
                  <div>
                    <label className="block text-sm font-['Orbitron'] mb-2 text-cobalt">
                      Position Applying For
                    </label>
                    <select className="w-full px-4 py-3 glass glow-border rounded-lg focus:outline-none focus:border-cobalt focus:shadow-[0_0_30px_rgba(0,71,255,0.6)] transition-all duration-300 text-white bg-obsidian">
                      <option value="">Select a position</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.title}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <InputField
                  label="LinkedIn Profile"
                  placeholder="https://linkedin.com/in/yourprofile"
                  type="url"
                />

                <TextArea
                  label="Cover Letter"
                  placeholder="Tell us why you're the perfect fit for this role..."
                  rows={6}
                  required
                />

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-['Orbitron'] mb-2 text-cobalt">
                    Resume / CV (PDF)
                  </label>
                  <div
                    className={`relative glass glow-border rounded-lg p-8 transition-all duration-300 ${
                      isDragging ? 'border-cobalt bg-cobalt/10' : ''
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="resume-upload"
                    />
                    
                    {!uploadedFile ? (
                      <div className="text-center">
                        <Upload className="mx-auto mb-4 text-cobalt" size={48} />
                        <p className="text-white font-['Orbitron'] mb-2">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-silver-grey text-sm">PDF format only, max 10MB</p>
                      </div>
                    ) : isScanning ? (
                      <div className="text-center">
                        <Loader className="mx-auto mb-4 text-cobalt animate-spin" size={48} />
                        <p className="text-cobalt font-['Orbitron'] mb-2">Scanning...</p>
                        <div className="max-w-md mx-auto h-1 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2 }}
                            className="h-full bg-cobalt"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                        <p className="text-white font-['Orbitron'] mb-2">
                          {uploadedFile.name}
                        </p>
                        <p className="text-green-400 text-sm">File uploaded successfully</p>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="mt-4 text-cobalt text-sm hover:underline"
                        >
                          Upload different file
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button variant="primary" className="px-12 text-lg">
                    Submit Application
                  </Button>
                </div>
              </form>
            </GlowCard>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Careers;
