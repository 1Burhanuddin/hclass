// Predefined subjects for different classes
export const PREDEFINED_SUBJECTS: Record<number, { name: string; code: string; optional?: boolean }[]> = {
  9: [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'Science', code: 'SCI' },
    { name: 'Social Studies', code: 'SS' },
    { name: 'English', code: 'ENG' },
    { name: 'Gujarati', code: 'GUJ' },
    { name: 'Hindi', code: 'HIN' },
  ],
  10: [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'Science', code: 'SCI' },
    { name: 'Social Studies', code: 'SS' },
    { name: 'English', code: 'ENG' },
    { name: 'Gujarati', code: 'GUJ' },
    { name: 'Hindi', code: 'HIN' },
  ],
  11: [
    { name: 'Physics', code: 'PHY' },
    { name: 'Chemistry', code: 'CHEM' },
    { name: 'Mathematics', code: 'MATH', optional: true },
    { name: 'Biology', code: 'BIO', optional: true },
    { name: 'English', code: 'ENG' },
  ],
  12: [
    { name: 'Physics', code: 'PHY' },
    { name: 'Chemistry', code: 'CHEM' },
    { name: 'Mathematics', code: 'MATH', optional: true },
    { name: 'Biology', code: 'BIO', optional: true },
    { name: 'English', code: 'ENG' },
  ],
}

export function getSubjectsForClass(classNumber: number) {
  return PREDEFINED_SUBJECTS[classNumber] || []
}

export function getOptionalSubjectsForClass(classNumber: number) {
  const subjects = getSubjectsForClass(classNumber)
  return subjects.filter((s) => s.optional === true)
}

export function getCompulsorySubjectsForClass(classNumber: number) {
  const subjects = getSubjectsForClass(classNumber)
  return subjects.filter((s) => s.optional !== true)
}
