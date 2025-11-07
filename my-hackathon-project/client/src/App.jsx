import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  useToast,
  Container,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  useSteps,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import axios from 'axios'

// --- The Form Steps ---
const steps = [
  { title: 'Student', description: 'Your Info' },
  { title: 'Experiment', description: 'Lab Details' },
  { title: 'Content', description: 'Code & Output' },
  { title: 'Finish', description: 'Review & Generate' },
]

// --- The Main App ---
function App() {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    subject: '',
    collegeName: 'CBIT', // Default value
    aim: '',
    theory: '',
    code: '',
    output: '',
    conclusion: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // --- Chakra UI Hook for Stepper ---
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0, // Start at step 0
    count: steps.length,
  })

  // --- Load Remembered Data on Start ---
  useEffect(() => {
    const savedData = localStorage.getItem('labGeneratorData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setFormData((prev) => ({ ...prev, ...parsedData }))
      setRememberMe(true)
    }
  }, [])

  // --- Handle Form Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // --- Handle "Remember Me" Checkbox ---
  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked)
    if (e.target.checked) {
      // Save to localStorage
      const dataToSave = {
        studentName: formData.studentName,
        rollNumber: formData.rollNumber,
        subject: formData.subject,
        collegeName: formData.collegeName,
      }
      localStorage.setItem('labGeneratorData', JSON.stringify(dataToSave))
    } else {
      // Clear from localStorage
      localStorage.removeItem('labGeneratorData')
    }
  }

  // --- Handle Form Submission ---
  const handleSubmit = async () => {
    setIsLoading(true)
    toast({
      title: 'Generating PDF...',
      description: 'Your lab record is being created.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })

    try {
      // Send data to the backend API
      const response = await axios.post('/api/generate', formData, {
        responseType: 'blob', // Expect a file blob back
      })

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      // Set a nice filename
      const filename = `${formData.subject.replace(
        /\s+/g,
        '_'
      )}_Lab_Record.pdf`
      link.setAttribute('download', filename)
      
      // Append to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      toast({
        title: 'Success!',
        description: 'Your PDF has been downloaded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Go back to the first step
      setActiveStep(0)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: 'Error',
        description: 'Could not generate PDF. Check the console.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Helper to render the current step's form ---
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Student Info
        return (
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Student Name</FormLabel>
              <Input
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Roll Number</FormLabel>
              <Input
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>College Name</FormLabel>
              <Input
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
              />
            </FormControl>
            <Checkbox isChecked={rememberMe} onChange={handleRememberMe}>
              Remember my details
            </Checkbox>
          </VStack>
        )
      case 1: // Experiment Details
        return (
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Aim</FormLabel>
              <Textarea name="aim" value={formData.aim} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Theory / Apparatus</FormLabel>
              <Textarea
                name="theory"
                value={formData.theory}
                onChange={handleChange}
                rows={10}
              />
            </FormControl>
          </VStack>
        )
      case 2: // Content
        return (
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Code / Procedure</FormLabel>
              <Textarea
                name="code"
                value={formData.code}
                onChange={handleChange}
                rows={15}
                fontFamily="monospace" // MONOSPACE FONT!
              />
            </FormControl>
            <FormControl>
              <FormLabel>Output / Observations</FormLabel>
              <Textarea
                name="output"
                value={formData.output}
                onChange={handleChange}
                rows={5}
                fontFamily="monospace"
              />
            </FormControl>
          </VStack>
        )
      case 3: // Review & Generate
        return (
          <Box textAlign="center">
            <Heading size="md" mb={4}>
              Ready to Generate?
            </Heading>
            <Text>
              Click the button below to download your lab record as a PDF.
            </Text>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Heading textAlign="center" mb={2}>
        Automated Lab Record Generator
      </Heading>
      <Text textAlign="center" color="gray.500" mb={8}>
        Built for Hacktoberfest @ CBIT
      </Text>

      <Stepper index={activeStep} mb={10}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardBody p={8}>
          {renderStepContent()}
        </CardBody>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={8}>
        <Button
          onClick={goToPrevious}
          isDisabled={activeStep === 0}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Generate PDF
          </Button>
        ) : (
          <Button onClick={goToNext}>Next</Button>
        )}
      </Box>
    </Container>
  )
}

export default App