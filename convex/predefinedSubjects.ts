export const PREDEFINED_SUBJECTS = {
  10: [
    { name: 'Mathematics', code: 'MATH', description: 'Class 10 Mathematics' },
    { name: 'Science', code: 'SCI', description: 'Class 10 Science' },
    { name: 'Social Studies', code: 'SOCIAL', description: 'Class 10 Social Studies' },
    { name: 'English', code: 'ENG', description: 'Class 10 English' },
    { name: 'Gujarati', code: 'GUJ', description: 'Class 10 Gujarati' },
    { name: 'Hindi', code: 'HINDI', description: 'Class 10 Hindi' },
  ],
  11: [
    { name: 'Physics', code: 'PHY11', description: 'Class 11 Physics' },
    { name: 'Chemistry', code: 'CHEM11', description: 'Class 11 Chemistry' },
    { name: 'Mathematics', code: 'MATH11', description: 'Class 11 Mathematics (Optional)' },
    { name: 'English', code: 'ENG11', description: 'Class 11 English' },
  ],
  12: [
    { name: 'Physics', code: 'PHY12', description: 'Class 12 Physics' },
    { name: 'Chemistry', code: 'CHEM12', description: 'Class 12 Chemistry' },
    { name: 'Mathematics', code: 'MATH12', description: 'Class 12 Mathematics (Optional)' },
    { name: 'Biology', code: 'BIO12', description: 'Class 12 Biology (Optional)' },
    { name: 'English', code: 'ENG12', description: 'Class 12 English' },
  ],
}

export const SUBJECT_CATEGORIES = {
  10: 'Class 10 (CBSE)',
  11: 'Class 11 Science',
  12: 'Class 12 Science',
}

export const getSubjectsForClass = (classNumber: number) => {
  return PREDEFINED_SUBJECTS[classNumber as keyof typeof PREDEFINED_SUBJECTS] || []
}

export const getSubjectDescription = (classNumber: number) => {
  return SUBJECT_CATEGORIES[classNumber as keyof typeof SUBJECT_CATEGORIES] || 'Unknown Class'
}
